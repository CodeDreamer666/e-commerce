import { pool } from "../../db.js";
import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import type { Response } from "express";

export default async function getShippingAddress(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue"
        })
    }

    const shippingAddress = await pool.query(
        "SELECT full_name, phone_number, city, address, country, postal_code FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    );

    if (shippingAddress.rows.length === 0) {
        return res.status(400).json({
            error: "No active checkout session found. Please select items before proceeding to reviewing order"
        })
    }

    return res.json(shippingAddress.rows[0]);
}