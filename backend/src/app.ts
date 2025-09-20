import express from "express";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/error.middleware.js";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { AppError } from "./utils/apiError.util.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

if (process?.env?.NODE_ENV === "development") {
  // Log HTTP requests in development mode
  app.use(morgan("dev"));
}

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
    origin: "http://localhost:3000", // Specific origin, not "*"
    credentials: true, // Allow credentials
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// setting query parse
app.set("query parser", "extended");

// Allow our app to parse incoming JSON data in request body (up to 64kb)
app.use(express.json({ limit: "64kb" }));

// Allow our app to parse URL-encoded data (e.g. from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files (like images, CSS, JS) from the "public" folder
app.use(express.static("public"));
// Access and set browser cookies
app.use(cookieParser());

import { router as authRouter } from "./routes/auth.route.js";
import { router as userRouter } from "./routes/users.route.js";
import { router as videoRouter } from "./routes/video.routes.js";
import { router as likeRouter } from "./routes/like.routes.js";
import { router as postRouter } from "./routes/post.route.js";
import { router as commentRouter } from "./routes/comment.routes.js";
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);

// admin routes
import { router as settingsRouter } from "./routes/adminSettings.route.js";
app.use("/api/v1/admin-settings", settingsRouter);

app.use((req, res, next) => {
  console.log(
    "in the all route",
    StatusCodes.NOT_FOUND,
    ReasonPhrases.NOT_FOUND
  );
  next(
    new AppError(
      StatusCodes.NOT_FOUND,
      `${req.originalUrl} Route ${ReasonPhrases.NOT_FOUND} on this server`
    )
  );
});
app.use(globalErrorHandler);
export { app };
