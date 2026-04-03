import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { expiredSchema } from "@/app/schemas/backendResponse";

type UrlCategory = "auth" | "products" | "reviews" | "cart" | "checkout"

type UrlBaseForm = `http://localhost:8000/${UrlCategory}`

type Url = `${UrlBaseForm}${string}`

type GetRequestProps<T> = {
    url: Url,
    idealSchema: z.ZodType<T>
    option: "SSR" | "SSG" | "ISR"
}

export default async function fetchAndValidateData<T>(
    {
        url,
        idealSchema,
        option,
    }: GetRequestProps<T>
) {
    try {
        let renderingDataMethod: RequestInit & {
            next?: { revalidate: number }
        };

        let cookieStore = await cookies();

        if (option === "SSR") {
            renderingDataMethod = { cache: "no-store" }
        } else if (option === "SSG") {
            renderingDataMethod = { cache: "force-cache" }
        } else {
            renderingDataMethod = { next: { revalidate: 3600 } } // 1 hour
        }

        let res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString()
            },
            ...renderingDataMethod,
        });

        let json: unknown = await res.json();

        if (res.status === 401) redirect("/unauthorized");

        if (res.status === 403) {
            const result = expiredSchema.safeParse(json);

            if (result.success && result.data.error_code === "EXPIRED_ACCESS_TOKEN") {

                await fetch("http://localhost:3000/api/auth/refresh", { 
                    method: "POST",
                });

                res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: cookieStore.toString()
                    },
                    ...renderingDataMethod,
                });

                json = await res.json();
            }
        }

        if (!res.ok) throw new Error(`failed with status ${res.status}`);

        const result = idealSchema.safeParse(json);

        const firstError = result.error?.issues[0].message

        if (!result.success) {
            throw new Error(
                `GET ${url} returned invalid data: ${firstError})}`
            );
        }

        return result.data;
    } catch (err) {
        console.error(err);
    }
}
