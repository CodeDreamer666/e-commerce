"use client"
import Navigation from "./Link";
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import StatusMessage from "@/app/components/shared/StatusMessageClient";
import useStatusMessage from "../../hooks/useStatusMessage";
import sendRequestAndGetResponse from "@/app/lib/sendRequest";
import { usernameDataSchema } from "@/app/schemas/userProfile";
import { expiredSchema } from "@/app/schemas/backendResponse";
import Logout from "./Logout";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("Guest");
    const pathname = usePathname();

    useEffect(() => {
        async function fetchUsernameData() {
            try {
                let res = await fetch("http://localhost:8000/auth/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                    credentials: "include"
                });

                let json: unknown = await res.json();

                if (res.status === 401) redirect("/unauthorized");

                if (res.status === 403) {
                    const result = expiredSchema.safeParse(json);

                    if (result.success && result.data.error_code === "EXPIRED_ACCESS_TOKEN") {

                        await fetch("http://localhost:8000/auth/refresh", {
                            method: "POST",
                            credentials: "include"
                        });

                        res = await fetch("http://localhost:8000/auth/me", {
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

                if (!res.ok) setUsername("Guest");

                const result = usernameDataSchema.safeParse(json);

                if (!result.success) {
                    return setUsername("Guest")
                }

                return setUsername(result.data.username)
            } catch (err) {
                console.error(err);
                return setUsername("Guest")
            }
        }

        fetchUsernameData();
    }, [])

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const { isSuccess, setIsSuccess, message, setMessage } = useStatusMessage();

    async function logout() {
        const res = await sendRequestAndGetResponse({
            method: "POST",
            url: "http://localhost:8000/auth/logout"
        });

        setIsOpen(false);

        if (res.isSuccess) {
            setIsSuccess(res.isSuccess);
            setMessage(res.message);
            setTimeout(() => {
                window.location.replace("/");
            }, 1000);
        } else {
            setIsSuccess(res.isSuccess);
            setMessage(res.error);
        }
    }

    const navLinks = (
        <>
            <Navigation
                displayText="Shop"
                path="/"
                icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                )}
            />

            {username !== "Guest" ? (
                <>
                    <Logout onClick={() => logout()} />
                    <Navigation
                        displayText="Order"
                        path="/order-history"
                        icon={(
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        )}
                    />
                </>
            ) : (
                <Navigation
                    displayText="Login"
                    path="/auth"
                    icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                    )}
                />
            )}

            <Navigation
                displayText="Cart"
                path="/cart"
                icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                )}
            />
        </>
    );

    return (
        <header>
            <StatusMessage
                message={message}
                isSuccess={isSuccess}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />
            <nav className="z-50 h-16 fixed w-full bg-[linear-gradient(to_bottom_right,#2895d7,#53AADF,#2895d7)] flex items-center shadow-md px-4">
                {/* Main Container */}
                <div className="flex w-full justify-between items-center max-w-6xl mx-auto">

                    {/* Brand / Welcome Message */}
                    <p className="font-semibold text-lg text-black">
                        Welcome, {username}
                    </p>

                    {/* Desktop Menu - visible from 'sm' up */}
                    <ul className="hidden sm:flex items-center gap-2">
                        {navLinks}
                    </ul>

                    {/* Hamburger Button - visible only below 'sm' */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="sm:hidden text-3xl text-black font-bold cursor-pointer hover:scale-105 transition-all duration-300"
                        aria-label="Toggle Menu"
                    >
                        &#9776;
                    </button>
                </div>

                {/* Mobile Side Drawer */}
                <ul className={`fixed top-0 left-0 h-screen w-64 bg-gray-200 p-6 shadow-2xl z-60 flex flex-col gap-4 transform transition-transform duration-500 ease-in-out sm:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    {navLinks}
                </ul>

                {/* Dark Overlay for Mobile Drawer */}
                {isOpen && (
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-55 sm:hidden"
                    />
                )}
            </nav>
        </header>
    );
}

{/*
                    <ul className={`max-sm:hidden flex gap-4 items-center p-4`}>
                    
                    </ul> */}