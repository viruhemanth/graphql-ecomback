const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  street: {
    type: String,
  },
  house: {
    type: String,
  },
  additional: {
    type: String,
  },
  zip: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
