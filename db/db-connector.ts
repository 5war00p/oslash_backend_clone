const mongoose = require("mongoose");

const conn_string =
  process.env.DB_URI || "Invalid Connection String";

mongoose
  .connect(conn_string)
  .then(() => {
    console.log(
      "Mongo connection established successfully!"
    );
  })
  .catch((err: any) => {
    console.error(err.message);
  });

module.exports = {
  mongoose: mongoose,
};
