const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  try {
    //Get token from header

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ Success: false, message: "Authentication required" });
    }
    const token = authHeader.split(" ")[1]; //get token after Bearer prefix
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Token mismatch" });
    }

    //after user to request for further use
    req.user = user;
    next(); // continue to next functions
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "authentications Failed" });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Admin rpivilage required" });
  }
};

//task to creata a new middleware isStudent
// check if user role is stuent or admin
// create two user, one noraml, one student
// apply the middlewares in all the get routes of studentRoute
