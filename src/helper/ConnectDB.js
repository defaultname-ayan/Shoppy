import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: false });
dotenv.config();

let isConnectionInProgress = null;

console.log("Loading environment variables...");
const ConnectDB = async () => {
    const usingVar = process.env.MONGO_URI ? "MONGO_URI" : (process.env.MONGO_URL ? "MONGO_URL" : null);
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!uri) {
        console.error("Mongo URI is not set. Add MONGO_URI (or MONGO_URL) in .env.local");
        throw new Error("Missing Mongo URI env var");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (isConnectionInProgress) {
        return isConnectionInProgress;
    }

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
    });

    console.log("Attempting MongoDB connect using", usingVar);
    isConnectionInProgress = mongoose.connect(uri);
    try {
        await isConnectionInProgress;
        return mongoose.connection;
    } finally {
        isConnectionInProgress = null;
    }
};

export default ConnectDB;