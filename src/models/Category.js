const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
});

CategorySchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
