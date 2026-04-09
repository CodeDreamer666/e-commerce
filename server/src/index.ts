import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { usersRouter } from "./routes/users.js";
import { productsRouter } from "./routes/products.js";
import { reviewsRouter } from "./routes/reviews.js";
import { cartRouter } from "./routes/cart.js";
import { checkoutRouter } from "./routes/checkout.js";
import { ordersRouter } from "./routes/orders.js";
import errorHandler from "./middlewares/errorHandler.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8000;

app.use(cors({
    origin: ["http://localhost:3000", "e-commerce-1-eight-kappa.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});

app.use("/auth", usersRouter);
app.use("/products", productsRouter);
app.use("/reviews", reviewsRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);
app.use("/orders", ordersRouter)

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is connected at PORT: ${PORT}`));