// Imports from packages
const mongoose = require("mongoose");

const conn_string = process.env.DB_URI || "Invalid Connection String";

// method to connect mongoDB Database
async function connectDB() {
  try {
    await mongoose.connect(conn_string);
    console.info("Mongo connection established successfully!");
  } catch (err: any) {
    console.error(err.message);
  }
}

// Exporting all schemas thourgh db-connector
export = {
  connectDB,
  mongoose: mongoose,
  User: require("./user"),
  Shortcut: require("./shortcut"),
};
