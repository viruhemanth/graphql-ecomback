const mongoose = require("mongoose");

const User = require("../models/User");
const Address = require("../models/Address");
const Store = require("../models/Store");
const { Product } = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

const resolvers = {
  Query: {
    users: async (_, __, { user }) => {
      if (!user) {
        return null;
      }
      if (user.role !== "admin") {
        throw new Error("Unauthorized");
        return null;
      }
      return await User.find({}).populate("address");
    },
    me: (_, __, { user }) => {
      if (!user) {
        return null;
      }
      return { ...user._doc, id: user._id };
    },
    stores: async (_, __, { user }) => {
      if (!user) {
        return null;
      }
      return await Store.find({}).populate("owner").populate("address");
    },
    products: async (_, __, context) => {
      // try {
      const products = await Product.find({})
        .populate("store")
        .populate("category");
      return products;
      // } catch (e) {
      //   throw new Error("Unable to get products", e);
      //   return null;
      // }
    },
    categories: async (_, __, context) => {
      const categories = await Category.find({});
      return categories;
    },

    allOrders: async (_, __, context) => {
      const orders = await Order.find({})
        .populate("userId")
        .populate({
          path: "products",
          populate: [
            {
              path: "store",
              populate: [
                {
                  path: "owner",
                },
                {
                  path: "address",
                },
              ],
            },
            {
              path: "category",
            },
          ],
        })
        .populate("ShippingAddress");
      console.log(orders);
      return orders;
    },
    userOrders: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }
      if (user.role === "user") {
        const orders = await Order.find({ userId: user.id })
          .populate("userId")
          .populate("ShippingAddress")
          .populate({
            path: "products",
            populate: [
              {
                path: "store",
                populate: [
                  {
                    path: "owner",
                  },
                  {
                    path: "address",
                  },
                ],
              },
              {
                path: "category",
              },
            ],
          });
        return orders;
      }

      if (user.role === "store") {
        console.log("Im here");
        const orders = await Order.find({}).populate({
          path: "products",
          populate: [
            {
              path: "store",
              populate: [
                {
                  path: "owner",
                },
                {
                  path: "address",
                },
              ],
            },
            {
              path: "category",
            },
          ],
        });
        const newOrder = orders.filter((order) => {
          return order.products.filter((product) => {
            return product.store.owner.id === user.id;
          });
        });

        console.log(newOrder);
        return newOrder;
      }
    },
  },

  Mutation: {
    signup: async (_, { input }, __) => {
      const { _doc: address } = await Address.create(input.address);
      const { _doc: user } = await User.create({
        ...input,
        address: address._id,
      });
      return {
        ...user,
        id: user._id,
        address: { ...address, id: address._id },
      };
    },

    login: async (_, { username, password }, context) => {
      let user = await User.findOne({ username }).populate("address");
      if (!user) {
        throw new Error("Invalid Username");
      }
      if (!user.verifyPassword(password)) {
        throw new Error("Invalid Password");
      }
      const token = context.createToken(user);
      return { token, user };
    },
    createStore: async (_, { input }, context) => {
      if (context.user.role === "user") {
        throw new Error("Unauthroized Action");
        return false;
      }
      let owner;

      if (!input.owner) {
        owner = context.user.id;
      }
      if (context.user.role === "admin") {
        owner = input.owner;
      }
      try {
        const storeAddress = await Address.create(input.address);
        console.log("Came here");
        const store = await Store.create({
          ...input,
          owner,
          address: storeAddress.id,
        });
        return true;
      } catch (e) {
        throw new error("Failed to create Store with error,", e);
        return false;
      }
    },
    updateStore: async (_, { input, id, address }, { user }) => {
      if (!user) {
        return null;
      }
      if (user.role === "user") {
        throw new Error(
          "Unauthroized Request, Only Admin and Store Owner Can Access this"
        );
        return null;
      }

      if (address) {
        const store = await Store.findById(id);
        const updatedAddress = await Address.findOneAndUpdate(
          { _id: store.address },
          { ...address },
          { new: true }
        );
      }

      const results = await Store.findOneAndUpdate(
        { _id: id },
        { ...input },
        { new: true }
      )
        .populate("owner")
        .populate("address");
      return results;
    },
    searchStore: async (_, { name }, context) => {
      if (!name) {
        return null;
      }
      const store = await Store.find({ $text: { $search: name } });
      return store;
    },
    createProduct: async (
      _,
      {
        input: { name, description, discount, price, productImage, category },
        storeID,
      },
      context
    ) => {
      let categoryId;
      const hasCategory = await Category.findOne({
        name: category.name.toLowerCase(),
      });
      if (hasCategory) {
        categoryId = hasCategory.id;
      } else {
        const { _doc } = await Category.create({ name: category.name });
        categoryId = _doc._id;
      }
      const { _doc: product } = await Product.create({
        name,
        description,
        discount,
        price,
        productImage,
        category: categoryId,
        store: storeID,
      });
      return true;
    },
    searchProduct: async (_, { name }, context) => {
      if (!name) {
        return null;
      }
      const product = await Product.find({ $text: { $search: name } });
      return product;
    },
    updateProduct: async (_, { input, id }, { user }) => {
      if (!user) {
        throw new Error("Authentication Required");
        return null;
      }

      if (user.role === "user") {
        throw new Error(
          "UnAuthorized Request, You dont have permission to perform this action"
        );
        return null;
      }
      const product = await Product.findOneAndUpdate(
        { _id: id },
        { ...input },
        { new: true }
      );
      return product;
    },
    createOrder: async (_, { userID, products }, { user }) => {
      if (!user) {
        throw new Error("Authentication Required");
      }
      const { address: ShippingAddress } = await User.findById(userID);
      let orderAmount = 0;
      products.forEach((product) => {
        orderAmount += product.amountToPay;
      });
      const newProducts = products.map((product) => {
        return {
          ...product,
          category: product.category.id,
          store: product.store.id,
        };
      });

      try {
        const order = await Order.create({
          userId: userID,
          products: newProducts,
          ShippingAddress,
          orderAmount,
        });
        console.log(order);
        return true;
      } catch (e) {
        throw new Error("Unable to Place Order", e);
        return false;
      }
    },
    updateOrder: async (_, { id, status }, { user }) => {
      if (!user) {
        throw new Error("UnAuthenticated, Login and Try Again");
      }
      if (user.role === "user") {
        throw new Error("UnAuthorized Request");
      }
      let orderStatus =
        status.toLowerCase() === "accept" ? "completed" : "rejected";
      const order = Order.findOneAndUpdate(
        { _id: id },
        { status: orderStatus },
        { new: true }
      ).populate({
        path: "products",
        populate: [
          {
            path: "store",
            populate: [
              {
                path: "owner",
              },
              {
                path: "address",
              },
            ],
          },
          {
            path: "category",
          },
        ],
      });
      return order;
    },
  },
};

module.exports = {
  resolvers,
};
