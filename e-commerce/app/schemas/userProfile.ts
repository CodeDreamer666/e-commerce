import { z } from "zod";

// Current user profile response schema
export const usernameDataSchema = z.object({
    username: z.string().default("Guest")
});

export type UsernameData = z.infer<typeof usernameDataSchema>;
