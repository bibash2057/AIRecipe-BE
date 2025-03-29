const Category = require("../models/Category");

exports.getAll = async (req, res) => {
  try {
    const allCategory = await Category.find({});
    res.status(200).json({
      data: allCategory,
      message: "Succfully get all category",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
