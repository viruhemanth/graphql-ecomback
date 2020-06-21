const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
  },

  discount: {
    type: Number,
  },

  amountToPay: {
    type: Number,
  },

  productImage: {
    type: String,
  },
  store: {
    type: Schema.Types.ObjectID,
    ref: "Store",
  },

  category: {
    type: Schema.Types.ObjectID,
    ref: "Category",
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

ProductSchema.index({ name: "text" });

ProductSchema.pre("save", function (next) {
  const discountedValue = (this.price * this.discount) / 100;
  this.amountToPay = this.price - discountedValue;
  next();
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = { ProductSchema, Product };
// module.exports = { ProductSchema };
