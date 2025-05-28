const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    stuid: {
      type: String,
      required: true,
      unique: true,
    },
    stu_name: {
      type: String,
    },
    stu_email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", StudentSchema);
