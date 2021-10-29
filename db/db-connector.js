const mongoose = require("mongoose");

const conn_string =
  process.env.DB_URI || "Invalid Connection String";

mongoose
  .connect(conn_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(
      "Mongo connection established successfully!"
    );
  })
  .catch((err) => {
    console.error(err.message);
  });

module.export = {
  mongoose: mongoose,
};
