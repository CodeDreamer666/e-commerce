import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import { pool } from "../../db.js";

export default async function updateProductQuantity(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    };

    const { productId, action } = req.params;

    if (action === "increase") {
        await pool.query(
            "UPDATE cart SET quantity = quantity + 1 WHERE product_id = $1 AND user_id = $2",
            [Number(productId), req.user.userId]
        );
    } else {
        await pool.query(
            "UPDATE cart SET quantity = quantity - 1 WHERE product_id = $1 AND user_id = $2 AND quantity > 1",
            [Number(productId), req.user.userId]
        );
    }

    return res.status(201).json({
        message: "Quantity updated successfully"
    })
}