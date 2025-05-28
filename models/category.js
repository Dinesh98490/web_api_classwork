const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
  filepath: { type: String },
});

module.exports = mongoose.model("Category", CategorySchema);
