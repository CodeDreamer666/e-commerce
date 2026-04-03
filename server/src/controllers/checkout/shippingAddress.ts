import type { AuthRequest } from "../../middlewares/jwtVerify.js"
import type { Response } from "express"
import { shippingAddress } from "../../schema/checkout.js"
import { pool } from "../../db.js"

export default async function shippingAddressController(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    }

    const result = shippingAddress.safeParse(req.body);

    if (!result.success) {
        const firstError = result.error.issues[0].message;
        return res.status(400).json({ error: firstError });
    }

    const { full_name, postal_code, phone_number, city, address, country } = result.data;
    
    const checkoutSession = await pool.query(
        "SELECT id FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    );

    if (checkoutSession.rows.length === 0) {
        return res.status(400).json({
            error: "No active checkout session found. Please select items before proceeding to shipping"
        })
    }

    await pool.query(
        "UPDATE checkout_sessions SET full_name = $1, phone_number = $2, address = $3, city = $4, country = $5, postal_code = $6 WHERE user_id = $7 AND status = 'draft'",
        [full_name, phone_number, address, city, country, postal_code, req.user.userId]
    );

    return res.status(201).json({
        message: "Shipping information saved successfully"
    });
}