import express from "express";
import addCart from "../controllers/cart/addProduct.js";
import getCart from "../controllers/cart/getCart.js";
import updateProductQuantity from "../controllers/cart/updateQuantity.js";
import tickProduct from "../controllers/cart/tickProduct.js";
import deleteProduct from "../controllers/cart/deleteProduct.js";
import selectionToggle from "../controllers/cart/selectionToggle.js";
import jwtVerify from "../middlewares/jwtVerify.js";
import catchError from "../middlewares/catchError.js";

export const cartRouter = express.Router();

cartRouter.post("/:productId", jwtVerify(), catchError(addCart));
cartRouter.get("/", jwtVerify(), catchError(getCart));
cartRouter.patch("/selection/:action", jwtVerify(), catchError(selectionToggle));
cartRouter.patch("/:productId/:action", jwtVerify(), catchError(updateProductQuantity));
cartRouter.patch("/:productId", jwtVerify(), catchError(tickProduct));
cartRouter.delete("/:productId", jwtVerify(), catchError(deleteProduct));