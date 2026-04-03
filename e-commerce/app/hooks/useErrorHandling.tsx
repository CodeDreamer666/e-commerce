"use client"
import { useState, useEffect } from "react"

type ErrorType = "auth" | "server" | "checkoutSession" | null

export default function useErrorHandling() {
    const [error, setError] = useState<ErrorType>(null)

    return { error, setError }
}