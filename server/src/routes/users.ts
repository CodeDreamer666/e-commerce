import express from "express";
import signInController from "../controllers/users/signIn.js";
import loginController from "../controllers/users/login.js";
import me from "../controllers/users/me.js";
import logout from "../controllers/users/logout.js";
import refresh from "../controllers/users/refresh.js";
import jwtVerify from "../middlewares/jwtVerify.js";
import catchError from "../middlewares/catchError.js";

export const usersRouter = express.Router();

usersRouter.post("/sign-in", catchError(signInController));
usersRouter.post("/login", catchError(loginController));
usersRouter.get("/me", jwtVerify(), catchError(me));
usersRouter.post("/logout", jwtVerify(true), catchError(logout));
usersRouter.post("/refresh", catchError(refresh));
