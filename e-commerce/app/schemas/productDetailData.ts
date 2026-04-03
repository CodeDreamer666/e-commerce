import { z } from "zod"

export const productIdDataSchema = z.object({
    id: z.number().gt(0),
    title: z.string(),
    description: z.string(),
    price: z.coerce.number().positive().multipleOf(0.01),
    discounted_percentage: z.coerce.number().positive().multipleOf(0.01),
    rating: z.coerce.number().positive().multipleOf(0.01),
    stock: z.number().positive(),
    warranty_information: z.string(),
    shipping_information: z.string(),
    availability_status: z.string(),
    return_policy: z.string(),
    minimum_order_quantity: z.number().positive(),
    image: z.string().url()
});

export type ProductIdData = z.infer<typeof productIdDataSchema>