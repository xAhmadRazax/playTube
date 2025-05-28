import { connect } from "mongoose";
import { DB_NAME } from "../constants.js";
// note db is in other continent so always use async await
export const connectDB = async (cb) => {
    try {
        const connectionInstance = await connect(`${process.env.MONGO_DB_URI.replace("<db_password>", process.env.MONGO_DB_PASSWORD)}/${DB_NAME}`);
        console.log(`\n✅ MongoDB connected !! host: ${connectionInstance.connection.host}`);
        cb?.();
    }
    catch (error) {
        console.log("❌ mongo DB connection failed: ", error);
        process.exit(1);
    }
};
