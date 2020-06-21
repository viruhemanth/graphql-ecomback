const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectID,
    ref: "User",
  },
  storeOpen: {
    type: Boolean,
    default: true,
  },
  address: {
    type: Schema.Types.ObjectID,
    ref: "Address",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

StoreSchema.index({ name: "text" });

module.exports = mongoose.model("Store", StoreSchema);
