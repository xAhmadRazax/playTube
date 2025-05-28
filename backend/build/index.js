import "./utils/env.util.js"; // import dotenv from "dotenv";
import { connectDB } from "./db/connect.db.js";
import { app } from "./app.js";
connectDB(() => {
    app
        .listen(+process.env.PORT || 8000, () => {
        console.log("✅ Application is running on port: " + process.env.PORT || 8000);
    })
        .on("error", (err) => {
        console.error("❌ Server failed to start:", err);
        process.exit(1);
    });
});
process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});
// best practice no 1 where we add connection to db in index file
// but we will use modular approach and have different file for different things
// import dotenv from "dotenv";
// dotenv.config();
// import { connect } from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constants.js";
// const app = express();
// (async () => {
//   try {
//     const mongoURI = process.env.MONGO_DB_URI.replace(
//       "<db_password>",
//       process.env.MONGO_DB_PASSWORD
//     );
//     await connect(`${mongoURI}/${DB_NAME}`);
//     console.log("connected to db");
//     app.on("error", (err) => {
//       console.log("ERROR: ", err);
//       throw err;
//     });
//     app.listen(process.env.PORT, () => {
//         console.log("server running at: "+{process.env.PORT})
//     });
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// })();
