import { z } from "zod"

const oneProductDataSchema = z.object({
    image: z.url(),
    title: z.string(),
    price: z.coerce.number().positive().multipleOf(0.01),
    discounted_percentage: z.coerce.number().positive().min(0).max(100).multipleOf(0.01),
    id: z.number().gt(0),
});

export const fullProductData = z.array(oneProductDataSchema)

export type FullProductData = z.infer<typeof fullProductData>