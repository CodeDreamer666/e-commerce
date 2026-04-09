"use client"
import useClientFetch from "../hooks/useClientFetch"
import React, { useState, useEffect } from "react"
import { ordersSchema } from "../schemas/orders"
import Card from "../components/shared/Card"
import type { Orders } from "../schemas/orders"
import useRefresh from "../hooks/useRefresh"
import Input from "../components/shared/Input"

export default function OrderHistory() {
    const [orders, setOrders] = useState<Orders | null>(null)

    const { data, error } = useClientFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        "GET",
        ordersSchema
    )
    const { setRefresh } = useRefresh();

    useEffect(() => {
        if (data === null) return;

        setOrders(data)
    }, [data])

    if (error === "auth") {
        return (
            <Card
                heading="Please login to continue"
                text="You need to be signed in to access the page. Choose an option below:"
                buttonOneText="Go to Login Page"
                buttonOnePath="/auth"
                buttonTwoPath="/"
                buttonTwoText="Back to Home"
            />
        )
    }

    if (error === "server") {
        return (
            <Card
                heading="Something went wrong"
                text="Oops! Something went wrong while loading. Please refresh the page or try again later."
                buttonOneText="Try again"
                buttonTwoPath="/"
                buttonTwoText="Back to Home"
                onClick={() => {
                    setRefresh(true);
                }}
            />
        )
    }

    if (error === "checkoutSession" || !orders) {
        return (
            <Card
                heading="No orders found yet"
                text="It looks like you haven’t placed any orders with us. When you do, your order history, tracking details, and digital receipts will all appear right here."
                buttonOnePath="/cart"
                buttonOneText="Go Back to Cart"
            />
        )
    }

    const fieldConfig = [
        { key: 'fullName', label: 'Full Name' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'address', label: 'Address' },
        { key: 'city', label: 'City' },
        { key: 'postalCode', label: 'Postal Code' },
        { key: 'country', label: 'Country' },
        { key: 'deliveryMethod', label: 'Delivery Method' },
        { key: 'paymentMethod', label: 'Payment Method' },
    ];

    return (
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] w-full max-w-6xl mx-auto mt-20 px-4 pb-6 pt-4">
            {orders.orders.map((order, index) => {
                return (
                    <section key={index} className="mb-4 p-4 shadow-lg rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Order Information {index + 1}</h2>

                        <div className="px-4 grid xs:grid-cols-2 xs:gap-2 md:grid-cols-4">
                            {fieldConfig.map(({ key, label }) => {
                                const value = order[key as keyof typeof order]
                                return (
                                    <Input
                                        key={key}
                                        value={value?.toString() || ""}
                                        displayText={label}
                                        text={key}
                                        isReadOnly={true}
                                        type="text"
                                    />
                                )
                            })}
                        </div>
                        <h2 className="text-2xl font-bold">Order Summary {index + 1}</h2>

                        <div className="grid md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:justify-center">
                            {order.orderProducts.map(({ id, quantity, image, product_title, subtotal }) => {
                                return (
                                    <section key={id} className="flex max-xs:flex-col max-xs:gap-2 gap-4 items-center">
                                        <img
                                            src={image}
                                            className="object-contain max-h-40"
                                            alt={`A picture of ${product_title}`}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-[24px] font-semibold text-gray-900">{product_title}</h2>

                                            <p className="flex items-center gap-2 text-[20px]">
                                                <span className="text-gray-500 font-medium">Quantity:</span>
                                                <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                                    {quantity}
                                                </span>
                                            </p>

                                            <p className="flex items-center gap-2 text-[20px]">
                                                <span className="text-gray-500 font-medium">Subtotal:</span>
                                                <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                                    {subtotal}
                                                </span>
                                            </p>
                                        </div>
                                    </section>
                                )
                            })}
                        </div>
                    </section>
                )
            })}
        </section>
    )
}