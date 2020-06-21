const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secret = "fjgfkjgfkjg;fjg;jkdsg;kfdjkgjdfkjg";

const createToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    secret
  );
  return token;
};

const verifyToken = async (token) => {
  try {
    const user = jwt.verify(token, secret);
    const completeUser = await User.findById(user.id).populate("address");
    return completeUser;
  } catch (e) {
    throw new Error("User not found", e);
  }
};

module.exports = {
  createToken,
  verifyToken,
};
