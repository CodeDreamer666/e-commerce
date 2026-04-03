import { z } from "zod"

export const order = z.object({
    products: z.array(z.object({
        image: z.url(),
        title: z.string(),
        quantity: z.coerce.number().int().min(1),
        total_price: z.coerce.number().multipleOf(0.01).positive()
    })),
    
    orderInformation: z.object({
        full_name: z
            .string(),

        phone_number: z
            .coerce
            .number()
            .int()
            .min(10000000)
            .max(99999999),

        address: z
            .string()
            .trim()
            .nonempty(),

        city: z
            .string()
            .trim()
            .nonempty(),

        country: z
            .string()
            .trim()
            .nonempty(),

        postal_code: z
            .string()
            .trim()
            .regex(/^\d{8}$/),

        delivery_method: z
            .string(),

        payment_method: z
            .string()
    })
})

export type Order = z.infer<typeof order>;