import type { Request, Response } from "express";
import { pool } from "../../db.js";

export default async function getProductId(req: Request, res: Response) {
    const { productId } = req.params;

    const product = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [Number(productId)]
    );

    return res.json(product.rows[0]);
}