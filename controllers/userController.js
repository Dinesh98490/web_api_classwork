const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "User exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt/complexity
    const newUser = new User({
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ success: true, msg: "User registred" });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  //validations
  if (!email || !password) {
    return res.status(400).json({ Success: false, message: "Missing field" });
  }
  try {
    const getUser = await User.findOne({ email: email });
    if (!getUser) {
      return res
        .status(400)
        .json({ Success: false, message: "User not found" });
    }
    //check for password
    const passwordCheck = await bcrypt.compare(password, getUser.password);
    if (!passwordCheck) {
      return res
        .status(400)
        .json({ Success: false, message: "Inavlid Credentails" });
    }

    //jwt
    const payload = {
      _id: getUser._id,
      email: getUser.email,
      firstName: getUser.firstName,
      lastName: getUser.lastName,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });
    return res.status(200).json({
      succes: true,
      message: "Login Successfull",
      data: getUser,
      token: token,
    });
  } catch (errr) {
    return res.status(500).json({ Success: false, message: "Server Error" });
  }
};
