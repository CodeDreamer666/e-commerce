import type { Response } from "express"
import type { AuthRequest } from "../../middlewares/jwtVerify.js"
import { pool } from "../../db.js"

export default async function getCart(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        })
    }

    const cartData = await pool.query(
        "SELECT id, product_id, quantity, unit_price, is_selected, total_price FROM cart WHERE user_id = $1 ORDER BY id ASC",
        [req.user.userId]
    );

    const productsData = await Promise.all(
        cartData.rows.map(async (cartItem) => {
            const { rows } = await pool.query(
                "SELECT image, title FROM products WHERE id = $1",
                [cartItem.product_id]
            );

            return {
                ...cartItem,
                title: rows[0].title,
                image: rows[0].image
            }
        })
    );

    return res.json(productsData);
}