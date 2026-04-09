import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/jwtVerify.js";
import { pool } from "../../db.js";

type OrderProduct = {
    id: number,
    quantity: number,
    subtotal: string,
    product_id: number,
    product_title: string,
    order_id: number
} | null

export default async function getOrders(req: AuthRequest, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            error: "Please login to continue"
        })
    }

    const orderInformation = await pool.query(
        "SELECT * FROM orders WHERE user_id = $1",
        [req.user.userId]
    )

    if (orderInformation.rows.length === 0) {
        return res.status(400).json({
            error: "No orders Found"
        })
    }

    let orderItems: OrderProduct[] = []

    for (const { id } of orderInformation.rows) {
        const products = await pool.query(
            "SELECT id, quantity, subtotal, product_id, image, product_title, order_id FROM order_items WHERE order_id = $1",
            [id]
        )

        products.rows.forEach((product) => {
            orderItems.push(product);
            return;
        })
    }

    const orders = orderInformation.rows.map(({ id, full_name, phone_number, address, city, postal_code, country, delivery_method, payment_method }) => {
        return {
            id,
            fullName: full_name,
            phoneNumber: phone_number,
            postalCode: postal_code,
            city, 
            address,
            country,
            deliveryMethod: delivery_method,
            paymentMethod: payment_method,
            orderProducts: orderItems.filter((product) => {
                if (!product) return null;

                return product.order_id === id
            })
        }
    })

    return res.json({
       orders
    })
}