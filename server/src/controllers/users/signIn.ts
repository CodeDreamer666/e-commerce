import type { Request, Response } from "express";
import { signIn } from "../../schema/users.js";
import dotenv from "dotenv"
import hashing from "../../utils/hashing.js";
import generateToken from "../../utils/generateToken.js";
import { pool } from "../../db.js";

dotenv.config();

export default async function signInController(req: Request, res: Response) {
    const result = signIn.safeParse(req.body);

    if (!result.success) {
        const firstError = result.error.issues[0].message;
        return res.status(400).json({ error: firstError });
    }

    const existing = await pool.query(
        "SELECT username, email FROM users WHERE email = $1 OR username = $2",
        [result.data.email, result.data.username]
    );

    if (existing.rows.length > 0) {
        return res.status(400).json({
            error: "Username or email already in use"
        })
    }

    const hashedPassword = await hashing(result.data.password);

    const userId = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id ",
        [result.data.username, result.data.email, hashedPassword]
    );

    const accessToken = generateToken(userId.rows[0].id, result.data.username, "access");
    const refreshToken = generateToken(userId.rows[0].id, result.data.username, "refresh");

    const hashedRefreshToken = await hashing(refreshToken);

    await pool.query(
        "INSERT INTO refresh_tokens (user_id, refresh_token) VALUES ($1, $2)",
        [userId.rows[0].id, hashedRefreshToken]
    );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 100 // 7 days
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/" // 15 minutes
        });

        return res.status(201).json({
            message: "Registered successfully"
        })
};

