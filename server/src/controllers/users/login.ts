import type { Request, Response } from "express";
import { login } from "../../schema/users.js";
import { pool } from "../../db.js";
import compare from "../../utils/compare.js";
import generateToken from "../../utils/generateToken.js";
import hashing from "../../utils/hashing.js";

export default async function loginController(req: Request, res: Response) {
    const result = login.safeParse(req.body);

    if (!result.success) {
        const firstError = result.error.issues[0].message;
        return res.status(400).json({ error: firstError });
    }

    const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [result.data.email]
    );

    if (existing.rows.length === 0) {
        return res.status(400).json({
            error: "Incorrect email or password"
        })
    }

    const user = existing.rows[0];

    const isValid = await compare(result.data.password, user.password);

    if (!isValid) {
        return res.status(400).json({
            error: "Incorrect email or password"
        })
    }

    const accessToken = generateToken(user.id, user.username, "access");
    const refreshToken = generateToken(user.id, user.username, "refresh");

    const hashedRefreshToken = await hashing(refreshToken);

    await pool.query(
        "INSERT INTO refresh_tokens (user_id, refresh_token) VALUES ($1, $2)",
        [user.id, hashedRefreshToken]
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/"
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        path: "/"
    });

    return res.status(201).json({
        message: "Login successfully",
    })
}