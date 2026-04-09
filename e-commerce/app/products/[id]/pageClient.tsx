"use client"
import { useState } from "react";
import StatusMessage from "@/app/components/shared/StatusMessageClient";
import useStatusMessage from "@/app/hooks/useStatusMessage";
import sendRequestAndGetResponse from "@/app/lib/sendRequest";
import type { ProductIdData } from "@/app/schemas/productDetailData";
import type { ReviewsData } from "@/app/schemas/reviewData";

export type ProductIdClientProps = {
    productIdData: ProductIdData,
    reviewsData: ReviewsData,
}

export default function ProductIdClient({ productIdData, reviewsData }: ProductIdClientProps) {
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [productQuantity, setProductQuantity] = useState<number>(1);;

    const {
        id,
        title,
        description,
        price,
        discounted_percentage,
        stock,
        warranty_information,
        shipping_information,
        availability_status,
        return_policy,
        minimum_order_quantity,
        image
    } = productIdData;

    const {
        setMessage,
        setIsSuccess,
        message,
        isSuccess
    } = useStatusMessage();

    const discounted_price = Number((Number(price) * (1 - Number(discounted_percentage) / 100)).toFixed(2));

    async function addCart() {
        const result = await sendRequestAndGetResponse({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`,
            body: {
                unit_price: discounted_price,
                quantity: productQuantity,
            }
        });

        setIsSuccess(result.isSuccess);

        if (result.isSuccess) {
            setMessage(result.message);
        } else {
            setMessage(result.error);
        }
    }

    function formatDate(dateStr: Date) {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    return (

        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] w-full">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />
            <div className="p-4 md:p-8">
                <div className="grid md:grid-cols-[350px_1fr] md:mt-20 md:items-center md:justify-center lg:grid-cols-[480px_1fr] lg:max-w-260 lg:mx-auto">
                    <div>
                        <div className="max-md:absolute max-md:top-20 max-md:left-3 md:inline-block bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md shadow-md">
                            {Math.floor(discounted_percentage)}% OFF
                        </div>

                        <img
                            className="mt-16 w-full max-h-75 object-contain"
                            src={image}
                            alt={`A picture of ${title}`}
                        />
                    </div>

                    <div>
                        <div className="flex flex-row gap-4 items-center">
                            <h1 className="font-bold text-2xl">{title}</h1>
                            <div className="flex items-baseline gap-3">
                                <span className="text-gray-400 line-through text-lg">${price}</span>
                                <span className="text-black/80 font-bold text-xl">${discounted_price}</span>
                            </div>
                        </div>

                        <p className="ml-4 mt-2 text-gray-700 font-semibold">
                            {description}
                        </p>

                        <h2 className="mt-6 text-lg font-bold">
                            Stock: <span className="text-gray-700">{stock} ( {availability_status} )</span>
                        </h2>

                        <h2 className="text-lg font-bold">
                            Minimum Order Quantity: <span className="text-gray-700">{minimum_order_quantity}</span>
                        </h2>


                        <h2 className="text-lg font-bold">
                            Shipping Information: <span className="text-gray-700">{shipping_information}</span>
                        </h2>

                        <h2 className="text-lg font-bold">
                            Warranty Information: <span className="text-gray-700">{warranty_information}</span>
                        </h2>

                        <h2 className="text-lg font-bold">
                            Return Policy: <span className="text-gray-700">{return_policy}</span>
                        </h2>

                        <button
                            onClick={() => {
                                setIsCartOpen(!isCartOpen);
                            }}
                            className="hidden md:block w-full mt-6 mx-auto bg-black/80 text-white py-2 font-bold rounded-lg hover:bg-white hover:text-black/80 transition-all duration-300 cursor-pointer">
                            Add to Cart
                        </button>
                    </div>
                </div>

                {reviewsData ? (
                    <div className="max-w-260 mx-auto">
                        <h2 className="text-lg font-bold mt-4">Reviews: </h2>
                        <ul className="w-full flex flex-col gap-4 mt-2 mb-6 lg:grid lg:grid-cols-2">
                            {reviewsData.map(({ rating, date, comment, id, reviewer_name }) => {
                                return (
                                    <li
                                        key={id}
                                        className="w-full bg-white shadow-md rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg">{reviewer_name}</h3>
                                            <p className="text-gray-500 text-sm">{formatDate(date)}</p>
                                        </div>

                                        <div className="flex items-center mb-2">
                                            <span className="font-bold text-yellow-600">{rating}★</span>
                                        </div>

                                        <p className="text-gray-700">{comment}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ) : <p className="font-semibold mt-4 text-[20px]">No reviews available</p>}

                <button
                    onClick={() => {
                        setIsCartOpen(!isCartOpen);
                    }}
                    className="md:hidden w-full mt-6 mx-auto bg-black/80 text-white py-2 font-bold rounded-lg hover:bg-white hover:text-black/80 transition-all duration-300 cursor-pointer">
                    Add to Cart
                </button>
            </div>

            {
                isCartOpen && (
                    <>
                        <section
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className="fixed inset-0 z-50 mx-auto flex justify-center items-center">
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white shadow-lg p-4 rounded-lg w-[95%] max-w-100">
                                <div className="flex justify-between">
                                    <h1 className="text-3xl font-bold">Cart</h1>
                                    <button
                                        onClick={() => setIsCartOpen(!isCartOpen)}
                                        className="font-semibold mr-2 cursor-pointer hover:scale-120 transition-all duration-300">
                                        X
                                    </button>
                                </div>
                                <img src={image} alt={`A picture of ${title}`} className="object-contain w-6/10 mx-auto" />
                                <div className="flex gap-4 items-center">
                                    <h2 className="text-2xl font-semibold">Quantity:</h2>
                                    <div className="flex gap-4 items-center">
                                        <button
                                            onClick={() => setProductQuantity(productQuantity - 1)}
                                            disabled={productQuantity === 1}
                                            className="font-bold disabled:cursor-not-allowed text-lg hover:bg-gray-500 transition-all duration-300 bg-gray-300 px-6 py-2 rounded-full cursor-pointer">
                                            -
                                        </button>
                                        <p className="font-bold text-[20px]">{productQuantity}</p>
                                        <button
                                            onClick={() => setProductQuantity(productQuantity + 1)}
                                            className="font-bold text-lg hover:bg-gray-500 transition-all duration-300 bg-gray-300 px-6 py-2 rounded-full cursor-pointer">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <h2 className="text-2xl font-semibold">Price:</h2>
                                    <p className="font-bold text-[20px] mt-0.5">${Number((discounted_price * productQuantity).toFixed(2))}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        addCart();
                                        setIsCartOpen(false);
                                    }}
                                    className="mt-4 w-full font-bold text-[20px] bg-black text-white rounded-lg py-1 cursor-pointer hover:bg-gray-200 hover:text-black transition-all duration-300">
                                    Add to Cart
                                </button>
                            </div>
                        </section>

                        <div className="bg-black/40 inset-0 fixed cursor-pointer z-40" />
                    </>
                )
            }

        </section>
    )
}
