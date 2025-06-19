const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")

exports.registerUser = async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;

  //validations
  if(!username || !email || !firstName || !lastName || !password){
    return res.status(403).json(
      {
        "success":false,
        "message":"Please fill all the fields" // chnage msg to message
      }
    )

  }

  

  try {
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User exists" });
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

    return res.status(201).json({ success: true, message: "User registred" });
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
        .json({ Success: false, message: "Invalid Credentails" });
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




const transporter = nodemailer.createTransport(
  {
    service:"gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS

    }
  }
)

exports.sendResetLink = async (req, res) => {
  const {email} = req.body

  try{
    const user = await User.findOne({email})
    if(!user) return res.status(404).json({succes:false, message:"User not found"})
    const token = jwt.sign({id:user._id}, process.env.SECRET, {expiresIn:"15m"})
    const resetUrl = process.env.CLIENT_URL + "/reset/password/" + token
    const mailOptions = {
      from: `"Sajilo Style" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `<p> Reset your password.. ${resetUrl}</p>`

    }
    transporter.sendMail(mailOptions, (err, info) =>{

      if(err) {
        console.log(err)
        return res.status(403).json({succes:false, message:"Failed"})
      }
      if(info) console.log(info)
      return res.status(200).json({succes:true, message:"success"})

    })
  }catch(err){
    return res.status(500).json({succes:false, message:"server error"})
  }
}


exports.resetPassword = async (req, res) => {
  const {token} = req.params
  const {password} =  req.body

  try{
    const decoded = jwt.verify(token, process.env.SECRET)
    const hased = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(decoded.id, {password: hased})
    return res.status(200).json({succes:true, message:"password updated"})

  }catch(err){
    return res.status(500).json({succes:false, message:"server error/Token invalid"})
  }
}