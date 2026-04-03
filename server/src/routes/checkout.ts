import express from "express";
import jwtVerify from "../middlewares/jwtVerify.js";
import storeProductsController from "../controllers/checkout/storeProducts.js";
import getProducts from "../controllers/checkout/getCheckout.js";
import shippingAddressController from "../controllers/checkout/shippingAddress.js";
import deliveryPaymentController from "../controllers/checkout/deliveryPayment.js";
import getDeliveryPayment from "../controllers/checkout/getDeliveryPayment.js";
import getShippingAddress from "../controllers/checkout/getShippingAddress.js";
import placeOrder from "../controllers/checkout/placeOrder.js";
import catchError from "../middlewares/catchError.js";

export const checkoutRouter = express.Router();

checkoutRouter.post("/", jwtVerify(), catchError(storeProductsController));
checkoutRouter.get("/", jwtVerify(), catchError(getProducts));
checkoutRouter.post("/shipping-address", jwtVerify(), catchError(shippingAddressController))
checkoutRouter.post("/delivery-payment", jwtVerify(), catchError(deliveryPaymentController));
checkoutRouter.get("/delivery-payment", jwtVerify(), catchError(getDeliveryPayment));
checkoutRouter.get("/shipping-address", jwtVerify(), catchError(getShippingAddress));
checkoutRouter.post("/place-order", jwtVerify(), catchError(placeOrder));

