const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../../controllers/admin/categoryController");
const upload = require("../../middleweres/fileupload");

// POST - create category
router.post(
  "/",
  upload.single("image"),
  //applying multer middleware will give file metadata in
  // req.file or req.files on rest of the functions

  createCategory
);

// GET - get all categories
router.get("/", getCategories);

// GET - get single category
router.get("/:id", getCategoryById);

// PUT - update category
router.put("/:id", updateCategory);

// DELETE - delete category
router.delete("/:id", deleteCategory);

module.exports = router;
