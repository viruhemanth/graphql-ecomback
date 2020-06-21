const mongoose = require("mongoose");
mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds131905.mlab.com:31905/ecom` ||
    "mongodb://localhost/test",
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected Dude");
});
