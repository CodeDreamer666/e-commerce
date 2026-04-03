import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import type { Response } from "express";
import { deliveryPayment } from "../../schema/checkout.js"
import { pool } from "../../db.js";

export default async function deliveryPaymentController(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue"
        })
    }

    const result = deliveryPayment.safeParse(req.body);

    if (!result.success) {
        const firstError = result.error.issues[0].message;
        return res.status(400).json({
            error: firstError
        });
    }

    const checkoutSession = await pool.query(
        "SELECT id FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    );

    if (checkoutSession.rows.length === 0) {
        return res.status(400).json({
            error: "No active checkout session found. Please select items before proceeding to payment"
        })
    }

    await pool.query(
        "UPDATE checkout_sessions SET delivery_method = $1, payment_method = $2 WHERE user_id = $3 AND status = 'draft'",
        [result.data.deliveryMethod, result.data.paymentMethod, req.user.userId]
    );

    return res.status(201).json({
        message: "Delivery and payment information saved successfully"
    });
}