const Product = require("../../models/Product");

exports.createProduct = async (req, res) => {
  const { name, price, categoryId, userId } = req.body;

  try {
    const product = new Product({
      name,
      price,
      categoryId,
      sellerId: userId,
    });
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    let filter = {};
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("categoryId", "name") // 1.key, 2.product
      .populate("sellerId", "firstName email")
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Data fetched",
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit), // ceil rounds number
      }, // paginations metadata
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
