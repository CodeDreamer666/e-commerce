import { z } from "zod"

export const messageSchema = z.object({
    message: z.string(),
});

export const errorSchema = z.object({
    error: z.string()
});

export const expiredSchema = z.object({
    error: z.string().nonempty(),
    error_code: z.string().nonempty()
});


export type MessageSchema = z.infer<typeof messageSchema>;

export type ErrorSchema = z.infer<typeof errorSchema>;

export type ExpiredSchema = z.infer<typeof expiredSchema>;
