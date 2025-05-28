const Student = require("../models/Student");

const bycrypt = require("bycrypt");

exports.registerS = tudent = async (req, res) => {
  const { stuid, stu_name, stu_email } = req.body;
  try {
    const existingStudent = await Student.findOne({
      $or: [{ stuid, stu_email }],
    });
    if (existingStudent) {
      return res.status(400).json({ success: false, msg: "User exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt/complexity
    const newStudent = new Student({
      stuid: stuid,
      stu_email: stu_email,
      stu_name: stu_name,
    });
    await newStudent.save();

    return res.status(201).json({ success: true, msg: "Student registred" });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
