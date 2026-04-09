"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import FormTitle from "@/app/components/checkout/FormTitle";
import useStatusMessage from "@/app/hooks/useStatusMessage";
import StatusMessage from "@/app/components/shared/StatusMessageClient";
import sendRequestAndGetResponse from "@/app/lib/sendRequest"
import StepNavigation from "@/app/components/checkout/StepNavigation";
import Button from "@/app/components/shared/Button";
import Card from "@/app/components/shared/Card";
import useClientFetch from "@/app/hooks/useClientFetch"
import useRefresh from "@/app/hooks/useRefresh";
import SelectionBox from "@/app/components/checkout/SelectionBox";
import type { DeliveryPayment } from "@/app/schemas/checkoutApi";
import { deliveryPayment } from "@/app/schemas/checkoutApi";

export default function ShippingOption() {
    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const { setRefresh } = useRefresh();

    const { error, data } = useClientFetch<DeliveryPayment, unknown>(
        "http://localhost:8000/checkout/delivery-payment",
        "GET",
        deliveryPayment
    )

    useEffect(() => {
        if (data === null) return;
        setDeliveryMethod(data.deliveryMethod);
        setPaymentMethod(data.paymentMethod);
        return;
    }, [data])

    const router = useRouter();

    const {
        isSuccess,
        setIsSuccess,
        message,
        setMessage
    } = useStatusMessage();


    async function formSubmission(event: React.SyntheticEvent) {
        event.preventDefault();

        if (deliveryMethod === "") {
            setIsSuccess(false);
            setMessage("Please select a shipping method");
            return;
        }

        if (paymentMethod === "") {
            setIsSuccess(false);
            setMessage("Please select a payment method");
            return;
        }

        try {
            const result = await sendRequestAndGetResponse({
                url: "http://localhost:8000/checkout/delivery-payment",
                method: "POST",
                body: {
                    deliveryMethod,
                    paymentMethod
                }
            });

            if (result.isSuccess) {
                router.replace("/checkout/review-order");
                return;
            } else {
                setIsSuccess(false);
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
                heading=" Complete previous steps first"
                text="It looks like you haven’t selected any items for checkout yet, or your shipping address hasn’t been completed. Please add items to your cart and fill in your shipping address before choosing a delivery or payment method."
                buttonOneText=" Back to previous step"
                buttonTwoText="Back to Cart"
                buttonOnePath="/checkout/shipping-address"
                buttonTwoPath="/cart"
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
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)]  flex flex-col justify-center items-center min-h-[80vh] w-full px-4 pb-6 pt-4">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <div className="w-full flex flex-col gap-2 max-w-md mx-auto">

                <StepNavigation
                    path="/checkout/shipping-address"
                />

                <form
                    onSubmit={(event) => formSubmission(event)}
                    className="shadow-md rounded-md flex flex-col p-4"
                >

                    <FormTitle
                        heading="Delivery & Payment"
                        subHeading="Choose your preferred delivery and payment method"
                    />

                    <SelectionBox
                        value={deliveryMethod}
                        displayText="Shipping Method"
                        displayTextId="shipping-method"
                        onChange={(event) => setDeliveryMethod(event.target.value)}
                        selectionText={[
                            { text: "Select your shipping method", value: "" },
                            { text: "Standard Shipping (3-5 days) $5", value: "Standard" },
                            { text: "Express Shipping (1-2 days) $12", value: "Express" }
                        ]}
                    />

                    <SelectionBox
                        value={paymentMethod}
                        displayText="Payment Method"
                        displayTextId="payment-method"
                        onChange={(event) => setPaymentMethod(event.target.value)}
                        selectionText={[
                            { text: "Select your payment method", value: "" },
                            { text: "Credit Card", value: "Credit Card" },
                            { text: "PayPal", value: "PayPal" },
                            { text: "Debit Card", value: "Debit Card" }
                        ]}
                    />

                    <Button
                        type="submit"
                        displayText="Next"
                    />

                </form>

            </div>
        </section>
    )
}