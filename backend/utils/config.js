const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  cloudinaryUrl: process.env.CLOUDINARY_URL || ''
};


