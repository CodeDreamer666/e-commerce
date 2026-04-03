import { z } from "zod";

export const reviewsDataSchema = z.array(
  z.object({
    id: z.coerce.number().positive().int(),
    rating: z.coerce.number().positive().min(0),
    comment: z.string(),
    date: z.coerce.date(),
    product_id: z.coerce.number().positive().int(),
    reviewer_name: z.string(),
  })
);

export type ReviewsData = z.infer<typeof reviewsDataSchema>