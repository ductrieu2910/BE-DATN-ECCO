import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import slugify from "slugify";

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, mainImage, variants } =
      req.body;
    const newProduct = new Product({
      name,
      category,
      price,
      description,
      mainImage,
      variants,
    });
    const savedProduct = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Tạo mới sản phẩm thành công",
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    if (updateData.name) {
      const newSlug = slugify(updateData.name, { lower: true, locale: "vi" });
      updateData.slug = newSlug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getListFromCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    const skip = (page - 1) * pageSize;
    const [total, products] = await Promise.all([
      Product.countDocuments({ category: category._id }),
      Product.find({ category: category._id })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
    ]);
    return res.status(200).json({
      success: true,
      pagination: {
        page: page,
        totalPage: Math.ceil(total / pageSize),
        totalItems: total,
        pageSize: pageSize,
      },
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
      error: error.message,
    });
  }
};

export const getProductHome = async (req, res) => {
  try {
    const { categories } = req.query;
    if (!categories || typeof categories !== "string")
      throw new Error("Không tìm thấy sản phẩm");
    const categorySlugs = categories
      .split(",")
      .filter((id) => id.trim() !== "");
    if (categorySlugs.length === 0) throw new Error("Không tìm thấy sản phẩm");
    const productsByCategory = await Promise.all(
      categorySlugs.map(async (slug) => {
        const category = await Category.findOne({ slug }).lean();
        const products = await Product.find({ category: category._id })
          .limit(8)
          .lean();
        return {
          category,
          products,
        };
      })
    );
    return res.status(200).json({
      success: true,
      data: productsByCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
      error: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const { search } = req.query;
    const skip = (page - 1) * pageSize;
    let filter = {};
    if (search) {
      filter = Object.assign(filter, {
        name: {
          $regex: search,
          $options: "i",
        },
      });
    }
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate({ path: "category", select: "name" })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
    ]);
    return res.status(200).json({
      success: true,
      pagination: {
        page: page,
        totalPage: Math.ceil(total / pageSize),
        pageSize: pageSize,
        totalItems: total,
      },
      data: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
      error: error.message,
    });
  }
};

export const getProductSearch = async (req, res) => {
  try {
    const { search } = req.query;
    const products = await Product.find({
      name: {
        $regex: search,
        $options: "i",
      },
    });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
      error: error.message,
    });
  }
};

export const getProductPageSearch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const { search } = req.query;
    const skip = (page - 1) * pageSize;
    let filter = {};
    if (search) {
      filter = Object.assign(filter, {
        name: {
          $regex: search,
          $options: "i",
        },
      });
    }
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate({ path: "category", select: "name" })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
    ]);
    return res.status(200).json({
      success: true,
      pagination: {
        page: page,
        totalPage: Math.ceil(total / pageSize),
        pageSize: pageSize,
        totalItems: total,
      },
      data: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
      error: error.message,
    });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.status(500).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: {},
      error: error.message,
    });
  }
};

export const getProductDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      slug,
    }).populate({ path: "category", select: "name slug" });
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: {},
      error: error.message,
    });
  }
};
