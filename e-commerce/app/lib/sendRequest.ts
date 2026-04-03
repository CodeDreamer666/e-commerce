import { messageSchema, errorSchema, expiredSchema } from "@/app/schemas/backendResponse"

type UrlCategory = "auth" | "products" | "reviews" | "cart" | "checkout" | "shipping"

type UrlBaseForm = `http://localhost:8000/${UrlCategory}`

type Url = `${UrlBaseForm}${string}`

type ApiResponse =
    { isSuccess: true, message: string } |
    { isSuccess: false, error: string }

type SendRequestProps<BodyType> = {
    method: "POST" | "PUT" | "DELETE" | "PATCH",
    url: Url,
    body?: BodyType,
}

export default async function sendRequestAndGetResponse<BodyType>(
    {
        method,
        body,
        url,
    }: SendRequestProps<BodyType>
): Promise<ApiResponse> {

    const resOption: RequestInit = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include"
    };

    try {

        let res = await fetch(url, resOption);

        let data = await res.json();

        if (res.status === 403) {
            const isExpired = expiredSchema.safeParse(data);

            if (isExpired.success && isExpired.data.error_code === "EXPIRED_ACCESS_TOKEN") {
                await fetch("http://localhost:8000/auth/refresh", {
                    method: "POST",
                    credentials: "include"
                });

                res = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",

                    },
                    credentials: "include"
                });

                data = await res.json();
            }
        }

        const isMessage = messageSchema.safeParse(data);
        const isError = errorSchema.safeParse(data);


        if (!res.ok) {
            return {
                isSuccess: false,
                error: isError.success ? isError.data.error : "Server Error"
            };
        }

        if (isMessage.success) {
            return { isSuccess: true, message: isMessage.data.message };
        }

        return { isSuccess: false, error: "Server Error" };

    } catch (err) {
        console.error(err);
        return { isSuccess: false, error: "Server Error" };
    }
}

