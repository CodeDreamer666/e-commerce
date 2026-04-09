import express from "express";
import getOrders from "../controllers/orders/getOrders.js";
import catchError from "../middlewares/catchError.js";
import jwtVerify from "../middlewares/jwtVerify.js";

export const ordersRouter = express.Router();

ordersRouter.get("/", jwtVerify(), catchError(getOrders));
