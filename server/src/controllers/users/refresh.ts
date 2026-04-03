import type { Request, Response } from "express"
import { pool } from "../../db.js";
import compare from "../../utils/compare.js";
import generateToken from "../../utils/generateToken.js";
import hashing from "../../utils/hashing.js";

export default async function refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            error: "Please login to continue",
        });
    }

    const allRefreshTokens = await pool.query(
        "SELECT user_id, refresh_token FROM refresh_tokens"
    );

    let match;

    for (const row of allRefreshTokens.rows) {
        if (await compare(refreshToken, row.refresh_token)) {
            match = row;
            break;
        }
    }

    if (!match) {
        return res.status(400).json({
            error: "Invalid token"
        });
    }

    const userId = match.user_id;

    const username = await pool.query(
        "SELECT username FROM users WHERE id = $1",
        [userId]
    );

    if (username.rows.length === 0) {
        return res.status(400).json({
            error: "Invalid token"
        });
    }

    const newAccessToken = generateToken(userId, username.rows[0].username, "access");
    const newRefreshToken = generateToken(userId, username.rows[0].username, "refresh");

    const hashedRefreshToken = await hashing(newRefreshToken)

    await pool.query(
        "INSERT INTO refresh_tokens (user_id, refresh_token) VALUES ($1, $2)",
        [userId, hashedRefreshToken]
    );

    await pool.query(
        "DELETE FROM refresh_tokens WHERE user_id = $1 AND refresh_token = $2",
        [userId, match.refresh_token]
    );

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/"
    });

    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        path: "/"
    });

    return res.status(201).json({
        message: "Refresh tokens successfully"
    });
}