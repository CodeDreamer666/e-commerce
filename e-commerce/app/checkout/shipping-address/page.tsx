"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormTitle from "@/app/components/checkout/FormTitle";
import useStatusMessage from "@/app/hooks/useStatusMessage";
import StatusMessage from "@/app/components/shared/StatusMessageClient";
import sendRequestAndGetResponse from "@/app/lib/sendRequest"
import Input from "@/app/components/shared/Input";
import useClientFetch from "@/app/hooks/useClientFetch";
import useRefresh from "@/app/hooks/useRefresh";
import Card from "@/app/components/shared/Card";
import StepNavigation from "@/app/components/checkout/StepNavigation";
import Button from "@/app/components/shared/Button";
import { shippingAddress } from "@/app/schemas/checkoutApi";

export default function ShippingAddress() {
    const [full_name, setFullName] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postal_code, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const router = useRouter();
    const { setRefresh } = useRefresh()

    const { data, error } = useClientFetch(
        "http://localhost:8000/checkout/shipping-address",
        "GET",
        shippingAddress
    )

    useEffect(() => {
        if (data === null) return;

        setFullName(data.full_name);
        setPhoneNumber(data.phone_number.toString());
        setAddress(data.address);
        setCity(data.city);
        setCountry(data.country);
        setPostalCode(data.postal_code)
    }, [data])

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage
    } = useStatusMessage();

    async function formSubmission(event: React.SyntheticEvent) {
        event.preventDefault();

        const body = {
            full_name,
            phone_number,
            address,
            city,
            country,
            postal_code
        }

        const result = shippingAddress.safeParse(body);

        if (!result.success) {
            const firstError = result.error.issues[0].message;
            setIsSuccess(false);
            setMessage(firstError);
            return;
        }

        try {
            const res = await sendRequestAndGetResponse({
                url: "http://localhost:8000/checkout/shipping-address",
                method: "POST",
                body: {
                    full_name,
                    phone_number,
                    address,
                    city,
                    country,
                    postal_code
                }
            });

            if (!res.isSuccess) {
                setIsSuccess(false);
                setMessage(res.error);
                return;
            }

            router.replace("/checkout/delivery-payment");
            return;

        } catch (err) {
            console.error(err);
            setIsSuccess(false);
            setMessage("Server Error");
            return;
        }
    }

    const inputList = [
        {
            displayText: "Full name",
            text: "full-name",
            value: full_name,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setFullName(event.target.value),
            type: "text",
            placeholder: "Enter your full name"
        },
        {
            displayText: "Phone number",
            text: "phone-number",
            value: phone_number,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(event.target.value),
            type: "tel",
            placeholder: "Enter your phone number"
        },
        {
            displayText: "Address",
            text: "address",
            value: address,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setAddress(event.target.value),
            type: "text",
            placeholder: "Enter your address"
        },
        {
            displayText: "City",
            text: "city",
            value: city,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value),
            type: "text",
            placeholder: "Enter your city"
        },
        {
            displayText: "Postal code",
            text: "postal-code",
            value: postal_code,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setPostalCode(event.target.value),
            type: "text",
            placeholder: "Enter your postal code"
        },
        {
            displayText: "Country",
            text: "country",
            value: country,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setCountry(event.target.value),
            type: "text",
            placeholder: "Enter your country"
        }
    ]

    if (error === "auth") {
        return (
            <Card
                heading="Please login to continue"
                text="You need to be signed in to access the page. Choose an option below:"
                buttonOnePath="/auth"
                buttonOneText="Go to Login Page"
                buttonTwoPath="/"
                buttonTwoText="Back to Home"
            />
        )
    }

    if (error === "checkoutSession") {
        return (
            <Card
                heading="Complete previous steps first"
                text=" It looks like you haven’t selected any items for checkout yet. Please add items to your cart."
                buttonOnePath="/cart"
                buttonOneText="Back to cart"
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

    return (
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] flex flex-col justify-center items-center w-full min-h-[80vh] px-4 pb-6 pt-4">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />
            <div className="w-full flex flex-col gap-2 max-w-md mx-auto">

                <StepNavigation />

                <form
                    onSubmit={(event) => formSubmission(event)}
                    className="shadow-md rounded-md flex flex-col p-4 "
                >

                    <FormTitle
                        heading="Shipping Address"
                        subHeading="Enter your delivery details below"
                    />

                    {inputList.map((input) => (
                        <Input
                            key={input.text}
                            displayText={input.displayText}
                            text={input.text}
                            value={input.value}
                            onChange={input.onChange}
                            type={input.type}
                            placeholder={input.placeholder}
                        />
                    ))}

                    <Button
                        displayText="Next"
                        type="submit"
                    />


                </form>
            </div>
        </section>
    )
}