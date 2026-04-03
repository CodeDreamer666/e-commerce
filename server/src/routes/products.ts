import express from "express";
import getProducts from "../controllers/products/getProducts.js";
import getProductId from "../controllers/products/getProductId.js";
import catchError from "../middlewares/catchError.js";

export const productsRouter = express.Router();

productsRouter.get("/", catchError(getProducts));
productsRouter.get("/:productId", catchError(getProductId));