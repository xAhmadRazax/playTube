import express from "express";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/error.middleware.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { AppErrorV4 } from "./utils/ApiError.util.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
if (process?.env?.NODE_ENV === "development") {
    // Log HTTP requests in development mode
    app.use(morgan("dev"));
}
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
// Allow our app to parse incoming JSON data in request body (up to 64kb)
app.use(express.json({ limit: "64kb" }));
// Allow our app to parse URL-encoded data (e.g. from HTML forms)
app.use(express.urlencoded({ extended: true }));
// Serve static files (like images, CSS, JS) from the "public" folder
app.use(express.static("public"));
// Access and set browser cookies
app.use(cookieParser());
import { router as authRouter } from "./routes/auth.route.js";
app.use("/api/v1/users", authRouter);
app.use((req, res, next) => {
    console.log("in the all route", StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    next(new AppErrorV4(StatusCodes.NOT_FOUND, `${req.originalUrl} Route ${ReasonPhrases.NOT_FOUND} on this server`));
});
app.use(globalErrorHandler);
export { app };
