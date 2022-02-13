import productModel from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({}, [
      "_id",
      "slug",
      "name",
      "price",
      "description",
    ]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


