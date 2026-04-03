import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import type { Response } from "express";
import { pool } from "../../db.js";

export default async function getCheckout(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    }

    const checkoutSession = await pool.query(
        "SELECT id FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    )

    if (checkoutSession.rows.length === 0) {
        return res.status(400).json({
            error: "No active checkout session found. Please select items before proceeding to reviewing order"
        })
    }

    const products = await pool.query(
        "SELECT * FROM checkout_items WHERE checkout_session_id = $1",
        [checkoutSession.rows[0].id]
    );

    const orderInformation = await pool.query(
        "SELECT full_name, phone_number, delivery_method, payment_method, country, city, address, postal_code FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    )

    const {
        full_name,
        phone_number,
        country,
        delivery_method,
        payment_method,
        city,
        address,
        postal_code
    } = orderInformation.rows[0]


    if (!full_name || !phone_number || !country || !city || !address || !postal_code || !delivery_method || !payment_method) {
        return res.status(400).json({
            error: "You need to complete your shipping address or delivery and payment before reviewing your order"
        })
    }

    return res.json({
        products: products.rows,
        orderInformation: orderInformation.rows[0]
    });
}