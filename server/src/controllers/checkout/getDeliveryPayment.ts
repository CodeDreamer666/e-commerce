import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import type { Response } from "express";
import { pool } from "../../db.js";

export default async function getDeliveryPayment(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue"
        })
    }

    const deliveryPayment = await pool.query(
        "SELECT delivery_method, payment_method FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    );

    const shippingAddress = await pool.query(
        "SELECT full_name, phone_number, city, address, country, postal_code FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    )

    if (deliveryPayment.rows.length === 0) {
        return res.status(400).json({
            error: "No active checkout session found. Please select items before proceeding to reviewing order"
        })
    }

    const { full_name, phone_number, country, city, address, postal_code } = shippingAddress.rows[0]

    if (!full_name || !phone_number || !country || !city || !address || !postal_code) {
        return res.status(400).json({
            error: "You need to complete your shipping address before selecting a delivery or payment method"
        })
    }

    const { delivery_method, payment_method } = deliveryPayment.rows[0]

    return res.json({
        deliveryMethod: delivery_method === null ? "" : delivery_method,
        paymentMethod: payment_method === null ? "" : payment_method
    })
}