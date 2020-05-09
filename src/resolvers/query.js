import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";
import Product from "../models/product";

const Query = {
  postsOffset: async (parent, { limit, offset }) => {
    const cursor = Product.find();
    if (limit) cursor.limit(limit);
    if (offset) cursor.skip(offset);
    return cursor;
  },
  user: (parent, args, { userId }, info) => {
    // Check if user logged in
    if (!userId) throw new Error("Please log in");

    return User.findById(userId)
      .populate({
        path: "products",
        options: { sort: { createdAt: "desc" } },
        populate: { path: "user" },
      })
      .populate({ path: "carts", populate: { path: "product" } });
  },
  users: (parent, args, context, info) =>
    User.find({})
      .populate({
        path: "products",
        populate: { path: "user" },
      })
      .populate({ path: "carts", populate: { path: "product" } }),
  product: (parent, args, context, info) =>
    Product.findById(args.id).populate({
      path: "user",
      populate: { path: "products" },
    }),
  productSearch: async (parent, args, context, info) => {
    const cursor = Product.find({
      description: { $regex: args.description }
    }).populate({
      path: "user",
      populate: { path: "products" },
    });
    if (args.price) cursor.find({price:args.price})
    return cursor;
  },
  products: (parent, args, context, info) =>
    Product.find()
      .populate({
        path: "user",
        populate: { path: "products" },
      })
      .sort({ createdAt: "desc" }),
};

export default Query;
