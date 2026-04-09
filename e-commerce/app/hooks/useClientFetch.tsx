"use client"
import { useState, useEffect } from "react"
import { expiredSchema } from "@/app/schemas/backendResponse"
import useErrorHandling from "./useErrorHandling"
import { z } from "zod"

type UrlCategory = "auth" | "products" | "reviews" | "cart" | "checkout" | "orders"
type UrlBaseForm = `http://localhost:8000/${UrlCategory}`
type Url = `${UrlBaseForm}${string}`

export default function useClientFetch<T, BodyType>(
    url: Url,
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    idealSchema: z.ZodType<T>,
    body?: BodyType
) {
    const [data, setData] = useState<T | null>(null)

    const {
        error,
        setError
    } = useErrorHandling()

    useEffect(() => {
        async function fetchData() {
            try {
                let res = await fetch(url, {
                    method,
                    body: body ? JSON.stringify(body) : undefined,
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });

                let json = await res.json();

                if (res.status === 403) {
                    const result = expiredSchema.safeParse(json);

                    if (result.success && result.data.error_code === "EXPIRED_ACCESS_TOKEN") {

                        await fetch("http://localhost:8000/auth/refresh", {
                            method: "POST",
                            credentials: "include"
                        });

                        res = await fetch(url, {
                            method,
                            body: body ? JSON.stringify(body) : undefined,
                            headers: { "Content-Type": "application/json" },
                            credentials: "include"
                        });

                        json = await res.json();
                    }
                }

                if (res.status === 401) {
                    setError("auth");
                    return
                }

                if (res.status === 400) {
                    setError("checkoutSession");
                    return
                }

                const result = idealSchema.safeParse(json);

                if (!result.success) {
                    setData(null)
                    return;
                }

                setData(result.data)

            } catch (err) {
                console.error(err);
                setError("server")
                return;
            }
        }

        fetchData()
    }, [url, method])

    return { error, data }
}