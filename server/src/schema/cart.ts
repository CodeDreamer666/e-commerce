import { z } from "zod"

export const addProduct = z.object({
    unit_price: z
        .coerce.number()
        .positive("Unit price must be greater than 0")
        .multipleOf(0.01, "Unit price must have at most 2 decimal places"),

    quantity: z
        .coerce.number()
        .min(1, "Quantity must be at least 1")
        .multipleOf(1, "Quantity must be a whole number")
});

export type AddProduct = z.infer<typeof addProduct>;