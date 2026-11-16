import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB || "staff-management";

declare global {
  var mongooseCache: {
    conn: Connection | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
