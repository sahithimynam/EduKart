import Product from "../models/Product.js";

export async function listProducts(req, res, next) {
  try {
    const {
      q = "",
      category,
      minPrice,
      maxPrice,
      minRating,
      sort = "featured",
      page = 1,
      limit = 50
    } = req.query;

    const filter = {};

    if (q.trim()) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { desc: { $regex: q.trim(), $options: "i" } },
        { category: { $regex: q.trim(), $options: "i" } },
        { badge: { $regex: q.trim(), $options: "i" } }
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    const sortOption = {};
    switch (sort) {
      case "price-asc":
        sortOption.price = 1;
        break;
      case "price-desc":
        sortOption.price = -1;
        break;
      case "rating-desc":
        sortOption.rating = -1;
        break;
      case "title-asc":
        sortOption.title = 1;
        break;
      case "newest":
        sortOption.createdAt = -1;
        break;
      case "featured":
      default:
        sortOption.featured = -1;
        sortOption.rating = -1;
        break;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(Math.max(1, Number(limit) || 50), 100);
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount, categories] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
      Product.distinct("category")
    ]);

    res.json({
      products,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum) || 1,
      categories: ["All", ...categories]
    });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Also find related products in the same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json({ product, related });
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await Product.distinct("category");
    res.json(["All", ...categories]);
  } catch (err) {
    next(err);
  }
}

// Admin handlers
export async function createProduct(req, res, next) {
  try {
    const {
      title,
      desc,
      price,
      originalPrice,
      category,
      img,
      stock = 50,
      badge = "",
      highlights = [],
      featured = false
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Title, price, and category are required." });
    }

    const product = await Product.create({
      title: title.trim(),
      desc: desc?.trim() || "",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.3),
      category: category.trim(),
      img: img?.trim() || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      stock: Number(stock) || 0,
      badge: badge.trim(),
      highlights: Array.isArray(highlights) ? highlights : [],
      featured: Boolean(featured),
      rating: 4.8,
      reviewsCount: 1
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
}
