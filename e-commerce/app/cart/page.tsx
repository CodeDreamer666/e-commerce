"use client"
import React from "react";
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import useStatusMessage from "@/app/hooks/useStatusMessage";
import StatusMessage from "@/app/components/shared/StatusMessageClient";
import sendRequestAndGetResponse from "../lib/sendRequest";
import CartButton from "../components/cart/CartButton";
import CartCheckbox from "../components/cart/CartCheckbox";
import type { CartData } from "@/app/schemas/cartData";
import { cartDataSchema } from "@/app/schemas/cartData";
import { expiredSchema } from "@/app/schemas/backendResponse";

export default function CartClient() {
    const [cartData, setCartData] = useState<CartData>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [productTitle, setProductTitle] = useState<string>("");
    const [productId, setProductId] = useState<number>(0);
    const router = useRouter();

    const isEmpty: boolean = !cartData || cartData.length === 0;
    const selectedItems: number = cartData.filter(item => item.is_selected).length ?? 0
    let path;

    if (isEmpty) {
        path = "/"
    } else if (selectedItems === 0) {
        path = "/cart"
    } else {
        path = "/checkout/shipping-address"
    }

    let totalPrice = 0;

    if (cartData && cartData.length > 0) {
        totalPrice = cartData.reduce((acc, item) => acc + Number((item.is_selected ? item.total_price : 0)), 0)
    }

    useEffect(() => {
        async function fetchCartData() {
            try {
                let res = await fetch("http://localhost:8000/cart", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                    credentials: "include"
                });

                let json: unknown = await res.json();

                if (res.status === 403) {
                    const result = expiredSchema.safeParse(json);

                    if (result.success && result.data.error_code === "EXPIRED_ACCESS_TOKEN") {

                        await fetch("http://localhost:8000/auth/refresh", {
                            method: "POST",
                            credentials: "include"
                        });

                        router.refresh();

                        res = await fetch("http://localhost:8000/cart", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",

                            },
                            cache: "no-store",
                            credentials: "include"
                        });

                        json = await res.json();
                    }
                }

                if (!res.ok) setCartData([]);

                const result = cartDataSchema.safeParse(json);

                if (!result.success) {
                    return setCartData([])
                }

                return setCartData(result.data);
            } catch (err) {
                console.error(err);
                return setCartData([]);
            }
        }

        fetchCartData();
    }, [])

    const {
        isSuccess,
        setIsSuccess,
        message,
        setMessage
    } = useStatusMessage();

    async function deleteCartItem(id: number) {
        try {
            const result = await sendRequestAndGetResponse({
                method: "DELETE",
                url: `http://localhost:8000/cart/${id}`
            });

            setIsSuccess(result.isSuccess);

            if (result.isSuccess) {
                setMessage(result.message);
                setCartData(prev => {
                    if (!prev) return prev;
                    return prev.filter(item => item.product_id !== id)
                });

            } else {
                setMessage(result.error);
            }

        } catch (err) {
            setIsSuccess(false);
            setMessage("Server Error");
            console.error(err);
        }
    }

    async function updateCartItemQuantity(id: number, action: "increase" | "decrease") {
        try {
            const result = await sendRequestAndGetResponse({
                method: "PATCH",
                url: `http://localhost:8000/cart/${id}/${action}`
            });

            setIsSuccess(result.isSuccess);

            if (result.isSuccess) {
                setMessage(result.message);
                setCartData(prev => {
                    if (!prev) return prev;

                    return prev.map((item) => {
                        if (item.product_id === id) {
                            if (action === "increase") {
                                return {
                                    ...item,
                                    total_price: (Number(item.unit_price) * (item.quantity + 1)),
                                    quantity: item.quantity + 1
                                }
                            } else {
                                return {
                                    ...item,
                                    total_price: item.quantity === 1 ? item.total_price : (Number(item.unit_price) * (item.quantity - 1)),
                                    quantity: item.quantity === 1 ? item.quantity : item.quantity - 1
                                }
                            }
                        } else {
                            return item;
                        }
                    })
                });

            } else {
                setMessage(result.error);
            }
        } catch (err) {
            setIsSuccess(false);
            setMessage("Server Error");
            console.error(err);
        }
    }

    async function tickOrUntickCartItem(id: number) {
        try {
            const result = await sendRequestAndGetResponse({
                method: "PATCH",
                url: `http://localhost:8000/cart/${id}`
            });

            setIsSuccess(result.isSuccess);

            if (result.isSuccess) {
                setMessage(result.message);
                setCartData(prev => {
                    if (!prev) return prev;

                    return prev.map((item) => {
                        if (item.product_id === id) {
                            return {
                                ...item,
                                is_selected: item.is_selected ? false : true
                            };
                        } else {
                            return item;
                        }
                    })
                });
            } else {
                setMessage(result.error);
            }
        } catch (err) {
            setIsSuccess(false);
            setMessage("Server Error");
            console.error(err);
        }
    }

    async function selectionToggle(action: "selectAll" | "clearAllSelection") {
        try {
            const result = await sendRequestAndGetResponse({
                method: "PATCH",
                url: `http://localhost:8000/cart/selection/${action}`
            });

            setIsSuccess(result.isSuccess);

            if (result.isSuccess) {
                setMessage(result.message);
                setCartData(prev => {
                    if (!prev) return prev;

                    return prev.map((item) => {
                        return {
                            ...item,
                            is_selected: action === "selectAll"
                        }
                    })
                });
            } else {
                setMessage(result.error);
            }

        } catch (err) {
            setIsSuccess(false);
            setMessage("Server Error");
            console.error(err);
        }
    }

    async function checkout() {
        if (selectedItems === 0) {
            setIsSuccess(false);
            setMessage("Please select products before proceeding to checkout");
            return;
        }

        const selectedCartItems = cartData.filter((product => product.is_selected));

        try {
            await sendRequestAndGetResponse({
                url: "http://localhost:8000/checkout",
                method: "POST",
                body: selectedCartItems
            });
        } catch (err) {
            console.error(err);
        }
    }

    return (

        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] w-full mt-16 px-4 pb-6 pt-4 max-w-6xl mx-auto">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <section className="mb-4 w-full flex flex-row justify-end items-center gap-4">
                <CartButton
                    cartData={cartData}
                    selectionToggle={selectionToggle}
                    action={"selectAll"}
                />
                <CartButton
                    cartData={cartData}
                    selectionToggle={selectionToggle}
                    action={"clearAllSelection"}
                />
            </section>

            {cartData.map(({ title, image, id, product_id, quantity, unit_price, total_price, is_selected }) => {
                return (
                    <React.Fragment key={id}>
                        <section className="w-full relative">

                            <div className="h-8 flex justify-between items-center lg:hidden">
                                <CartCheckbox
                                    is_selected={is_selected}
                                    product_id={product_id}
                                    tickOrUntickCartItem={tickOrUntickCartItem}
                                />

                                <button
                                    onClick={() => {
                                        setIsOpen(true);
                                        setProductTitle(title)
                                        setProductId(product_id)
                                    }}
                                    className="px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-300 text-white hover:text-black transition-all duration-300 cursor-pointer">
                                    Remove
                                </button>
                            </div>

                            <div className="grid xs:grid-cols-2 sm:grid-cols-[200px_1fr_120px] sm:items-center sm:gap-2 md:grid-cols-[200px_1fr_180px_120px] md:gap-4 md:items-center lg:grid-cols-[40px_160px_1fr_120px_120px_140px_140px] lg:gap-6 lg:max-w-300 lg:mx-auto">
                                <input
                                    type="checkbox"
                                    checked={is_selected}
                                    onChange={() => tickOrUntickCartItem(product_id)}
                                    className="hidden lg:block w-5 h-5 cursor-pointer text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />

                                <div>
                                    <img
                                        className="max-h-50 mx-auto object-contain"
                                        src={image}
                                        alt={`A picture of ${title}`}
                                    />
                                </div>

                                <h1 className="xs:hidden font-semibold text-2xl mx mb-2 lg:block">{title}</h1>

                                <div className="flex my-4 max-xs:justify-between max-xs:items-center xs:flex-col xs:my-2 lg:hidden">
                                    <h1 className="hidden xs:block font-semibold text-2xl mx mb-2">{title}</h1>
                                    <div className="flex flex-col xs:pl-4 md:hidden">
                                        <div className="flex gap-2 text-lg">
                                            <p className="font-semibold">Each: </p>
                                            <p className="text-red-600 font-semibold">${unit_price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex gap-2 text-lg">
                                            <p className="font-semibold">Subtotal:</p>
                                            <p className="text-red-600 font-semibold">${total_price.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 xs:my-4 xs:pl-4 sm:hidden">
                                        <button
                                            onClick={() => updateCartItemQuantity(product_id, "decrease")}
                                            disabled={quantity === 1}
                                            className="font-semibold flex items-center justify-center text-[20px] bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-500 cursor-pointer transition-all duration-300 rounded-full w-8 h-8">
                                            -
                                        </button>

                                        <p className="font-bold text-lg">{quantity}</p>

                                        <button
                                            onClick={() => updateCartItemQuantity(product_id, "increase")}
                                            className="font-semibold flex items-center justify-center text-[20px] bg-gray-400 hover:bg-gray-500 cursor-pointer rounded-full w-8 h-8">
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col xs:pl-4 lg:hidden">
                                    <div className="flex gap-2 text-lg">
                                        <p className="font-semibold">Each: </p>
                                        <p className="text-red-600 font-semibold">${unit_price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex gap-2 text-lg">
                                        <p className="font-semibold">Subtotal:</p>
                                        <p className="text-red-600 font-semibold">${total_price.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="hidden lg:flex gap-2 text-lg">
                                    <p className="font-semibold">Each: </p>
                                    <p className="text-red-600 font-semibold">${unit_price.toFixed(2)}</p>
                                </div>

                                <div className="hidden sm:flex sm:gap-2">
                                    <button
                                        onClick={() => updateCartItemQuantity(product_id, "decrease")}
                                        disabled={quantity === 1}
                                        className="font-semibold flex items-center justify-center text-[20px] bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-500 cursor-pointer transition-all duration-300 rounded-full w-8 h-8">
                                        -
                                    </button>

                                    <p className="font-bold text-lg">{quantity}</p>

                                    <button
                                        onClick={() => updateCartItemQuantity(product_id, "increase")}
                                        className="font-semibold flex items-center justify-center text-[20px] bg-gray-400 hover:bg-gray-500 cursor-pointer rounded-full w-8 h-8">
                                        +
                                    </button>
                                </div>

                                <div className="hidden lg:flex gap-2 text-lg">
                                    <p className="font-semibold">Subtotal:</p>
                                    <p className="text-red-600 font-semibold">${total_price.toFixed(2)}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsOpen(true);
                                        setProductTitle(title)
                                        setProductId(product_id)
                                    }}
                                    className="hidden lg:block lg:max-w-30 px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-300 text-white hover:text-black transition-all duration-300 cursor-pointer">
                                    Remove
                                </button>

                            </div>

                        </section>
                        <div className="mt-2 w-full h-px mb-4 bg-gray-300" />

                    </React.Fragment>
                )
            })}

            {isOpen && (
                <section
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center w-full h-screen fixed bg-black/40 inset-0">

                    <section
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white shadow-lg p-4 rounded-lg w-[95%] max-w-100 flex flex-col gap-4">

                        <h2 className="font-bold text-[20px]">Are you sure you want to remove {productTitle} from your cart ?</h2>

                        <section className="flex justify-end gap-4">

                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded border font-semibold border-gray-300 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300 cursor-pointer">
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    deleteCartItem(productId)
                                }}
                                className="px-4 py-2 rounded border font-semibold border-red-700 bg-red-600 text-white hover:bg-red-700 transition-all duration-300 cursor-pointer">
                                Remove
                            </button>

                        </section>

                    </section>

                </section>
            )}

            {isEmpty ? (
                <></>
            ) : (
                <section className="mt-4 flex justify-center items-end flex-col">
                    <section className="text-lg flex gap-2 items-center font-bold">
                        <h2 className="">Subtotal ({selectedItems} items):</h2>
                        <p className="text-gray-800">${totalPrice.toFixed(2)}</p>
                    </section>
                    <section className="text-lg flex gap-2 items-center font-bold">
                        <h2 className="">Total:</h2>
                        <p>${totalPrice.toFixed(2)}</p>
                    </section>
                </section>
            )}


            {isEmpty ? (
                <p className="text-center mt-8 font-semibold text-lg">Your cart is empty</p>
            ) : ""}

            <Link href={path}>
                <button
                    onClick={!isEmpty ? checkout : undefined}
                    className={`${isEmpty ? "mt-2" : "mt-4"} flex gap-2 justify-center items-center w-full bg-blue-400 font-semibold rounded-md text-lg py-2 cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:text-white`}>
                    {isEmpty ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <p>Start Shopping</p>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            <p>Checkout</p>
                        </>
                    )}
                </button>
            </Link>

        </section>
    )
}
