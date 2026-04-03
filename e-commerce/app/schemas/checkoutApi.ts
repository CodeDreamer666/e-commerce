import { z } from "zod"

export const deliveryPayment = z.object({
    deliveryMethod: z.string(),
    paymentMethod: z.string()
})

export const shippingAddress = z.object({
    full_name: z.string().trim().nonempty("Full name is required"),
    phone_number: z.coerce
        .number("Only numbers is allowed")
        .int("Only numbers is allowed")
        .min(10000000, "Phone number must be exactly 8 digits")
        .max(99999999, "Phone number must be exactly 8 digits"),
    address: z.string().trim().nonempty("Address is required"),
    city: z.string().trim().nonempty("City is required"),
    country: z.string().trim().nonempty("Country is required"),
    postal_code: z.string().trim().regex(/^[0-9]{8}$/, "Postal Code must be exactly 8 digits"),
})

export type DeliveryPayment = z.infer<typeof deliveryPayment>