const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ProductSchema } = require("./Product");

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  products: [ProductSchema],

  status: {
    type: String,
    default: "processing",
    enum: ["processing", "cancelled", "completed", "failed"],
  },

  orderAmount: {
    type: Number,
  },

  ShippingAddress: {
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
//
// OrderSchema.pre('save', async function (next) {
//   let user = await User.findById(this.userId).populate('address');
//   if(user.role === 'user') {
//     let addressId = user.address._id;
//     this.shippingAddress = addressId;
//   }
//   next();
// })

module.exports = mongoose.model("Order", OrderSchema);
