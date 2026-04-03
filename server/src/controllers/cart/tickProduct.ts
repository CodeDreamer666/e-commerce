import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import { pool } from "../../db.js";

export default async function tickProduct(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    }

    const { productId } = req.params;

    const is_selected = await pool.query(
        "SELECT is_selected FROM cart WHERE user_id = $1 AND product_id = $2",
        [req.user.userId, productId]
    );

    if (is_selected.rows.length === 0) {
        return res.status(404).json({
            error: "Product not found in cart"
        })
    }

    if (is_selected.rows[0].is_selected) {
        await pool.query(
            "UPDATE cart SET is_selected = $1 WHERE user_id = $2 AND product_id = $3",
            [false, req.user.userId, Number(productId)]
        );
    } else {
        await pool.query(
            "UPDATE cart SET is_selected = $1 WHERE user_id = $2 AND product_id = $3",
            [true, req.user.userId, Number(productId)]
        );
    }

    return res.status(201).json({
        message: "Selection toggled successfully"
    });

}