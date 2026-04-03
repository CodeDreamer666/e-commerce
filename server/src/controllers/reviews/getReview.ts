import type { Request, Response } from "express"
import { pool } from "../../db.js";

export default async function getReview(req: Request, res: Response) {
  const { productId } = req.params;

  const review = await pool.query(
    "SELECT * FROM reviews WHERE product_id = $1",
    [Number(productId)]
  );


  return res.json(review.rows);
}