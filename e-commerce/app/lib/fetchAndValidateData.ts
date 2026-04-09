import { redirect } from "next/navigation";
import { z } from "zod";
import { expiredSchema } from "@/app/schemas/backendResponse";

type UrlCategory = "auth" | "products" | "reviews" | "cart" | "checkout"

type UrlBaseForm = `${string}/${UrlCategory}`

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
