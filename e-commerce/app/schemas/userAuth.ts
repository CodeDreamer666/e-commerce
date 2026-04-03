import { z } from "zod"

// LOGIN SCHEMA - For user login requests
export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .max(254, "Email is too long")
        .email("Invalid email address")
        .toLowerCase(),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password is too long")
});

// SIGN-UP/REGISTER SCHEMA - For new user registration
export const signInSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "Username must be 1–20 characters long")
        .max(20, "Username must be 1–20 characters long")
        .regex(/^[A-Za-z0-9_]+$/, "Username must contain only letters, numbers, or underscores (_)."),

    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .max(254, "Email is too long")
        .email("Invalid email address")
        .toLowerCase(),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, "Password must include uppercase, lowercase, number and symbol")
        .max(72, "Password is too long")
});

// INFERRED TYPES
export type LoginSchema = z.infer<typeof loginSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
