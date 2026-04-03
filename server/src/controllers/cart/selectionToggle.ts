import type { Response } from "express"
import type { AuthRequest } from "../../middlewares/jwtVerify.js"
import { pool } from "../../db.js"

export default async function selectionToggle(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    }

    const { action } = req.params;

    if (action === "selectAll") {
        await pool.query(
            "UPDATE cart SET is_selected = $1 WHERE user_id = $2",
            [true, req.user.userId]
        )
    } else {
        await pool.query(
            "UPDATE cart SET is_selected = $1 WHERE user_id = $2",
            [false, req.user.userId]
        )
    }

    return res.status(201).json({
        message: "Selection toggled successfully"
    })

}