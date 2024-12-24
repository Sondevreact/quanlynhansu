const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected Sucsses kekeke <3 :) : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error, Bug roi, fix di : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;