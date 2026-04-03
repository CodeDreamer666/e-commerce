import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import type { Response } from "express";
import { pool } from "../../db.js";

export default async function placeOrder(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue"
        })
    }

    const checkoutSessions = await pool.query(
        "SELECT * FROM checkout_sessions WHERE user_id = $1 AND status ='draft'",
        [req.user.userId]
    );

    if (checkoutSessions.rows.length === 0) {
        return res.status(400).json({
            error: "No active checkout session found. Please select items before proceeding to reviewing order"
        })
    }

    const checkoutItems = await pool.query(
        "SELECT * FROM checkout_items WHERE checkout_session_id = $1",
        [checkoutSessions.rows[0].id]
    )

    if (checkoutItems.rows.length === 0) {
        return res.status(400).json({
            error: "No checkout items found. Please select items before proceeding to reviewing order"
        })
    }

    const {
        delivery_method,
        payment_method,
        full_name,
        phone_number,
        postal_code,
        city,
        address,
        country,
    } = checkoutSessions.rows[0]

    let totalPrice = delivery_method === "standard" ? 5 : 12

    for (const { total_price } of checkoutItems.rows) {
        totalPrice += total_price
    }

    const orderId = await pool.query(
        "INSERT INTO orders (user_id, full_name, phone_number, country, city, address, postal_code, delivery_method, payment_method, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
        [req.user.userId, full_name, phone_number, country, city, address, postal_code, delivery_method, payment_method, totalPrice]
    );

    for (const { total_price, product_id, title, quantity, image } of checkoutItems.rows) {
        await pool.query(
            "INSERT INTO order_items (order_id, product_id, product_title, quantity, subtotal, image) VALUES ($1, $2, $3, $4, $5, $6)",
            [orderId.rows[0].id, product_id, title, quantity, total_price, image]
        )

        await pool.query(
            "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
            [req.user.userId, product_id]
        )
    }

    await pool.query(
        "DELETE FROM checkout_items WHERE checkout_session_id = $1",
        [checkoutSessions.rows[0].id]
    )

    await pool.query(
        "DELETE FROM checkout_sessions WHERE user_id = $1 AND status = 'draft'",
        [req.user.userId]
    );

    return res.status(201).json({
        message: "Place order successfully"
    })
}