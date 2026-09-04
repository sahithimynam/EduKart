import mongoose from "mongoose";

export async function connectDB(uri) {
  const connectionUri = uri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/edukart";
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(connectionUri);
    console.log(`✅ MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB URI:", error.message);
    // If remote connection failed, attempt local connection fallback
    if (!connectionUri.includes("127.0.0.1") && !connectionUri.includes("localhost")) {
      console.log("🔄 Attempting fallback to local MongoDB: mongodb://127.0.0.1:27017/edukart");
      try {
        await mongoose.connect("mongodb://127.0.0.1:27017/edukart");
        console.log("✅ Connected to local MongoDB fallback!");
        return;
      } catch (fallbackError) {
        console.error("❌ Local fallback connection also failed:", fallbackError.message);
      }
    }
  }
}
