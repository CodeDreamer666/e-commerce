import { z } from "zod";

const oneCartItemDataSchema = z.object({
    id: z.number().positive(),
    product_id: z.number().positive(),
    unit_price: z.coerce.number().positive().multipleOf(0.01),
    total_price: z.coerce.number().positive().multipleOf(0.01),
    quantity: z.number().positive().multipleOf(1),
    is_selected: z.boolean(),
    title: z.string(),
    image: z.url(),
});

export const cartDataSchema = z.array(oneCartItemDataSchema);

export type CartData = z.infer<typeof cartDataSchema>
