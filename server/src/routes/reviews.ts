import express from "express";
import getReview from "../controllers/reviews/getReview.js";
import catchError from "../middlewares/catchError.js";

export const reviewsRouter = express.Router();

reviewsRouter.get("/:productId", catchError(getReview));
