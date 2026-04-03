// Logout endpoint should always succeed unless a server error occurs.
import type { Response } from "express"
import type { AuthRequest } from "../../middlewares/jwtVerify.js"
import { pool } from "../../db.js";
import compare from "../../utils/compare.js";

export default async function logout(req: AuthRequest, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken

    if (!refreshToken || !req.user || !accessToken) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.json({
            message: "Logged out successfully"
        });
    }

    const hashedRefreshTokenFromDB = await pool.query(
        "SELECT refresh_token FROM refresh_tokens WHERE user_id = $1",
        [req.user.userId]
    );

    if (hashedRefreshTokenFromDB.rows.length === 0) {
        return res.json({
            message: "Logged out successfully"
        });
    }

    let matched;

    for (const row of hashedRefreshTokenFromDB.rows) {
        if (await compare(refreshToken, row.refresh_token)) {
            matched = row;
            break;
        }
    }

    if (matched) {
        await pool.query(
            "DELETE FROM refresh_tokens WHERE user_id = $1 AND refresh_token = $2",
            [req.user.userId, matched.refresh_token]
        );
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.json({
        message: "Logged out successfully"
    });

}