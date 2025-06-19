const Category = require("../../models/category");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const filepath = req.file?.path;
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ category_name: name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = new Category({ category_name: name, filepath: filepath });
    await category.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully",
        category,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({data:categories, success: true, message: "Fetch"});
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: true, message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update category
exports.updateCategory = async (req, res) => {

  try {
    const filename = req.file?.path
    const data ={
      name: req.body.name
    }
    if(filename){
      data.filepath - filename
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      data,
      {new: true}
    );
   
    if (!updatedCategory)
      return res.status(404).json({ message: "Category not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Category updated",
        category: updatedCategory,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
