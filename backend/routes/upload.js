import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary API Key in route:", process.env.CLOUDINARY_API_KEY);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Wrap upload_stream in a Promise
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res
      .status(500)
      .json({ error: err.message || "Upload failed", details: err });
  }
});

export default router;
