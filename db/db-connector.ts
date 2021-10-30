const mongoose = require("mongoose");

const conn_string = process.env.DB_URI || "Invalid Connection String";

async function connectDB() {
  await mongoose
    .connect(conn_string)
    .then(async () => {
      console.log("Mongo connection established successfully!");
    })
    .catch((err: any) => {
      console.error(err.message);
    });
}

// Exporting all schemas thourgh db-connector
module.exports = {
  connectDB,
  User: require("./user"),
  Shortcut: require("./shortcut"),
};
