import { z } from "zod"

export const ordersSchema = z.object({
    orders: z.array(z.object({
        id: z.number().int().positive().min(1),
        deliveryMethod: z.string().nonempty(),
        paymentMethod: z.string().nonempty(),
        fullName: z.string().nonempty(),
        city: z.string().nonempty(),
        country: z.string().nonempty(),
        address: z.string().nonempty(),
        phoneNumber: z.coerce.number().int().min(10000000,).max(99999999),
        postalCode: z.string().trim().regex(/^[0-9]{8}$/),
        orderProducts: z.array(z.object({
            id: z.number().int().positive().min(1),
            quantity: z.coerce.number().int().positive().min(1),
            product_id: z.coerce.number().int().positive().min(1),
            product_title: z.string().nonempty(),
            subtotal: z.coerce.number().positive().multipleOf(0.01),
            image: z.string().nonempty()
        }))
    }))
})

export type Orders = z.infer<typeof ordersSchema>