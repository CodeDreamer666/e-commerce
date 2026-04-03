import type { Response } from "express"
import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import { addProduct } from "../../schema/cart.js";
import { pool } from "../../db.js";

export default async function addCart(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    }

    const { productId } = req.params;
    const result = addProduct.safeParse(req.body);

    if (!result.success) {
        const firstError = result.error.issues[0].message
        return res.status(400).json({ error: firstError })
    }

    const { quantity, unit_price } = result.data;

    const isProductIdFound = await pool.query(
        "SELECT id FROM cart WHERE product_id = $1 AND user_id = $2",
        [productId, req.user.userId]
    );

    if (isProductIdFound.rowCount && isProductIdFound.rowCount > 0) {
        await pool.query(
            "UPDATE cart SET quantity = GREATEST(quantity + $1, 1) WHERE product_id = $2 AND user_id = $3",
            [quantity, productId, req.user.userId]
        );
    } else {
        await pool.query(
            "INSERT INTO cart (user_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)",
            [req.user.userId, productId, quantity, unit_price]
        );
    }

    return res.status(200).json({
        message: "Cart Updated Successfully"
    })
}