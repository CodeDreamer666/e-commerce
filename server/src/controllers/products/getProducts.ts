import type { Request, Response } from "express";
import { pool } from "../../db.js";

export default async function getProducts(req: Request, res: Response) {
    const products = await pool.query("SELECT * FROM products");
    
    return res.json(products.rows);
}