const mongoose = require('mongoose');
const { mongoUri } = require('./config');

async function connectDb() {
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { autoIndex: true });
  return mongoose;
}

module.exports = { connectDb };


