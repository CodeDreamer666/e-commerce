import { z } from "zod"

export const checkoutDataSchema = z.array(z.object({
    id: z.int().positive().multipleOf(1),
    title: z.string(),
    product_id: z.int().positive().multipleOf(1),
    quantity: z.int().positive().multipleOf(1),
    total_price: z.coerce.number().positive().multipleOf(0.01),
    image: z.url()
}))

export type CheckoutData = z.infer<typeof checkoutDataSchema>;