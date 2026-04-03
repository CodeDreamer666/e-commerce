import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import { pool } from "../../db.js";

export default async function deleteProduct(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue",
        });
    }

    const { productId } = req.params

    await pool.query(
        "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
        [req.user.userId, Number(productId)]
    );
    
    return res.status(200).json({
        message: "Product deleted successfully"
    });

}