"use client"
import Link from "next/link"
import { useState, useEffect } from "react";
import StepNavigation from "@/app/components/checkout/StepNavigation";
import Card from "@/app/components/shared/Card";
import Input from "@/app/components/shared/Input";
import sendRequestAndGetResponse from "@/app/lib/sendRequest";
import useStatusMessage from "@/app/hooks/useStatusMessage";
import StatusMessage from "@/app/components/shared/StatusMessageClient";
import useClientFetch from "@/app/hooks/useClientFetch";
import useRefresh from "@/app/hooks/useRefresh";
import type { Order } from "@/app/schemas/orderData";
import { order } from "@/app/schemas/orderData";
import { useRouter } from "next/navigation";

export default function ReviewOrder() {
    const [orders, setOrders] = useState<Order | null>(null);
    const { setRefresh } = useRefresh();
    const router = useRouter();

    const {
        isSuccess,
        setIsSuccess,
        message,
        setMessage
    } = useStatusMessage();

    const { data, error } = useClientFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        "GET",
        order
    )

    useEffect(() => {
        setOrders(data);
    }, [data]);

    async function placeOrder() {
        try {
            const result = await sendRequestAndGetResponse({
                url: `${process.env.NEXT_PUBLIC_API_URL}/checkout/place-order`,
                method: "POST"
            });

            setIsSuccess(result.isSuccess);

            if (result.isSuccess) {
                setMessage(result.message);
                router.replace("/")
                return;
            } else {
                setMessage(result.error);
                return;
            }

        } catch (err) {
            console.error(err);
            setIsSuccess(false);
            setMessage("Server Error");
            return;
        }
    }


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
                heading="Cannot review order"
                text="You haven’t selected any items for checkout yet, or some required information—such as your shipping address, delivery method, or payment details—is incomplete. Please add items and complete all steps before reviewing your order."
                buttonOnePath="/cart"
                buttonOneText="Go Back to Cart"
                buttonTwoPath="/shipping-address"
                buttonTwoText="Fill in Missing Information"
            />
        )
    }

    const {
        full_name,
        phone_number,
        address,
        city,
        country,
        postal_code,
        delivery_method,
        payment_method
    } = orders.orderInformation

    const subtotal = orders.products.reduce((acc, currentValue) => {
        return acc + Number(currentValue.total_price)
    }, 0);

    const shippingFee = delivery_method === "standard" ? 5 : 12

    const inputList = [
        {
            displayText: "Full name",
            text: "full-name",
            value: full_name,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Phone number",
            text: "phone-number",
            value: phone_number,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Address",
            text: "address",
            value: address,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "City",
            text: "city",
            value: city,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Postal code",
            text: "postal-code",
            value: postal_code,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Country",
            text: "country",
            value: country,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Delivery Method",
            text: "delivery-method",
            value: delivery_method[0].toUpperCase() + delivery_method.slice(1),
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Payment Method",
            text: "payment-method",
            value: payment_method,
            type: "text",
            isReadOnly: true
        }
    ];

    return (
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] max-w-6xl mx-auto w-full px-4 pb-6 pt-4">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <StepNavigation
                path="/checkout/delivery-payment"
            />

            <h2 className="text-[26px] mb-2 font-bold">Order Summary</h2>

            <section className="mb-4 grid xs:mx-auto md:max-w-4xl">
                {orders.products.map(({ title, total_price, quantity, image }, index) => {
                    return (
                            <section key={index} className="flex flex-col gap-4 xs:grid xs:grid-cols-2 xs:gap-2 xs:justify-center xs:items-center sm:grid-cols-[200px_1fr_180px] sm:gap-4 md:grid-cols-[180px_1fr_150px_150px]">

                                <img
                                    src={image}
                                    className="object-contain max-h-50 mx-auto"
                                    alt={`A picture of ${title}`}
                                />

                                <h2 className="hidden sm:block text-[26px] font-semibold text-gray-900">{title}</h2>

                                <div className="flex flex-col gap-2 md:hidden">
                                    <h2 className="text-[26px] font-semibold text-gray-900 sm:hidden">{title}</h2>

                                    <p className="flex items-center gap-2 text-[20px]">
                                        <span className="text-gray-500 font-medium">Quantity:</span>
                                        <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                            {quantity}
                                        </span>
                                    </p>

                                    <p className="flex items-center gap-2 text-[20px]">
                                        <span className="text-gray-500 font-medium">Subtotal:</span>
                                        <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                            {total_price}
                                        </span>
                                    </p>
                                </div>

                                <p className="hidden md:flex items-center gap-2 text-[20px]">
                                    <span className="text-gray-500 font-medium">Quantity:</span>
                                    <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                        {quantity}
                                    </span>
                                </p>


                                <p className="hidden md:flex items-center gap-2 text-[20px]">
                                    <span className="text-gray-500 font-medium">Subtotal:</span>
                                    <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                        {total_price}
                                    </span>
                                </p>

                            </section>
                    )
                })}
            </section>

            <h2 className="text-[26px] my-4 font-bold">Order Information</h2>

            <div className="grid xs:grid-cols-2 xs:gap-2 lg:grid-cols-4 lg:gap-2">
                {inputList.map((input) => {
                    return (
                        <Input
                            key={input.text}
                            displayText={input.displayText}
                            isReadOnly={input.isReadOnly}
                            type={input.type}
                            value={input.value.toString()}
                            text={input.text}
                        />
                    )
                })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">

                {/* 1. Payment */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold border-b pb-2">Payment</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>Subtotal: ${subtotal.toFixed(2)}</p>
                        <p>Shipping: ${shippingFee.toFixed(2)}</p>
                        <p className="font-bold text-black pt-1">Total: ${(subtotal + shippingFee).toFixed(2)}</p>
                    </div>
                </div>

                {/* 2. Shipping Details (New Column for Balance) */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold border-b pb-2">Delivery To</h2>
                    <div className="text-sm text-gray-600">
                        <p>{full_name}</p>
                        <p>{city}, {address}</p>
                        <p>{postal_code}</p>
                    </div>
                </div>

                {/* 3. The "Help" Text */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold border-b pb-2">Review</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Please verify your details. You can still modify items or addresses before the final step.
                    </p>
                </div>

                {/* 4. The Buttons */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold border-b pb-2">Actions</h2>
                    <div className="flex flex-col gap-2">
                        <Link href="/cart" className="w-full py-2 text-center bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700">
                            Edit Order
                        </Link>
                        <Link href="/checkout/shipping-address" className="w-full py-2 text-center border border-blue-600 text-blue-600 rounded text-sm font-semibold hover:bg-blue-50">
                            Change Address
                        </Link>
                    </div>
                </div>

            </div>

            <button
                type="button"
                onClick={() => placeOrder()}
                className="cursor-pointer px-4 py-2 mt-8 block text-center w-full bg-blue-600 text-white font-semibold rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
            >
                Place Order
            </button>

        </section>
    )
}