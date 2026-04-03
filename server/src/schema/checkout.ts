import { z } from "zod";

export const storeProducts = z.array(z.object({
    id: z.number().positive(),
    product_id: z.number().positive(),
    unit_price: z.coerce.number().positive().multipleOf(0.01),
    total_price: z.coerce.number().positive().multipleOf(0.01),
    quantity: z.number().positive().multipleOf(1),
    is_selected: z.boolean(),
    title: z.string(),
    image: z.url(),
}));

export const deliveryPayment = z.object({
    paymentMethod: z.string().nonempty("Please select a payment method"),
    deliveryMethod: z.string().nonempty("Please select a shipping method")
})

export const shippingAddress = z.object({
    full_name: z.string().trim().nonempty("Full name is required"),
    phone_number: z.coerce
        .number("Only numbers is allowed")
        .int("Only numbers is allowed")
        .min(10000000, "Phone number must be exactly 8 digits")
        .max(99999999, "Phone number must be exactly 8 digits"),
    address: z.string().trim().nonempty("Address is required"),
    city: z.string().trim().nonempty("City is required"),
    country: z.string().trim().nonempty("Country is required"),
    postal_code: z.string().trim().regex(/^[0-9]{8}$/, "Postal Code must be exactly 8 digits"),
});

// Inferred Types
export type StoreProducts = z.infer<typeof storeProducts>;
export type DeliveryPayment = z.infer<typeof deliveryPayment>;
export type ShippingAddress = z.infer<typeof shippingAddress>;