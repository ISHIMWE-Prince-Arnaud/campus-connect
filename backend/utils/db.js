import mongoose from "mongoose";

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    autoIndex: true,
    tls: true,
    tlsAllowInvalidCertificates: true, // For troubleshooting only; remove in production
  });
  return mongoose;
}
