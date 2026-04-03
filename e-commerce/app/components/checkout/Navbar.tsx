"use client"
// Checkout Step Indicator - Shows the current step in the checkout process
import { usePathname } from "next/navigation"
import CurrentStep from "@/app/components/checkout/Navigation";

export default function Navbar() {
    const pathname = usePathname();
    const splitPathname = pathname.split("/");
    const currentStep = splitPathname[splitPathname.length - 1].trim().toLowerCase()

    return (
        <nav className="w-full bg-white shadow-sm rounded-md overflow-x-auto mt-16">
            <ul className="flex items-center justify-around w-full py-3 gap-4 text-sm font-medium text-gray-600">

                <CurrentStep
                    currentStep={currentStep}
                    expectedStep="shipping-address"
                    displayText="Shipping Address"
                />

                <CurrentStep
                    currentStep={currentStep}
                    expectedStep="delivery-payment"
                    displayText="Delivery & Payment"
                />

                <CurrentStep
                    currentStep={currentStep}
                    expectedStep="review-order"
                    displayText="Review Order"
                />

            </ul>
        </nav>
    )
}