require("dotenv").config();
const mongoose = require("mongoose");

let isConnected = false;

async function connect() {
  try {
    if (isConnected) return;
    try {
      const db = await mongoose.connect(process.env.DB_URL, {
        autoIndex: true,
      });
      console.log("DB is connected");
    } catch (error) {
      console.error("Database connection error:", error);
      throw error;
    }
  } catch (err) {
    console.log(err);
  }
}

const disconnect = async () => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected after seeding");
};

module.exports = { connect, disconnect };
