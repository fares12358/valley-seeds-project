import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize:              20,     // max concurrent connections to Atlas
      minPoolSize:              2,      // keep 2 warm connections in the pool
      serverSelectionTimeoutMS: 5000,   // fail fast if Atlas is unreachable
      socketTimeoutMS:          45000,  // close idle sockets after 45s
      family:                   4,      // force IPv4 — avoids dual-stack slowdown
    });
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[db] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
