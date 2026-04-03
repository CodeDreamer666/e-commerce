import type { AuthRequest } from "../../middlewares/jwtVerify.js"
import type { Response } from "express";
import { pool } from "../../db.js";
import { storeProducts } from "../../schema/checkout.js";

export default async function storeProductsController(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    }

    const result = storeProducts.safeParse(req.body);

    if (!result.success) {
        const firstError = result.error.issues[0].message;
        return res.status(400).json({ error: firstError })
    }

    const checkoutSession = await pool.query(
        "SELECT id FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    );

    // What if user had two checkout sessions
    if (checkoutSession.rows.length > 0) {
        await pool.query(
            "DELETE FROM checkout_items WHERE checkout_session_id = $1",
            [checkoutSession.rows[0].id]
        );

        // could be inefficient
        for (const { product_id, title, quantity, total_price, image } of result.data) {
            await pool.query(
                "INSERT INTO checkout_items (product_id, title, quantity, total_price, checkout_session_id, image) VALUES ($1, $2, $3, $4, $5, $6)",
                [product_id, title, quantity, total_price, checkoutSession.rows[0].id, image]
            );
        }
    } else {
        const newCheckoutSession = await pool.query(
            "INSERT INTO checkout_sessions (user_id) VALUES ($1) RETURNING id",
            [req.user.userId]
        );

        for (const { product_id, title, quantity, total_price, image } of result.data) {
            await pool.query(
                "INSERT INTO checkout_items (product_id, title, quantity, total_price, checkout_session_id, image) VALUES ($1, $2, $3, $4, $5, $6)",
                [product_id, title, quantity, total_price, newCheckoutSession.rows[0].id, image]
            );
        }
    }

    return res.status(201).json({
        message: "Checkout session created successfully"
    });
}