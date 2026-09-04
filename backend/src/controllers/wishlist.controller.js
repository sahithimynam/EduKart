import User from "../models/User.js";

export async function getWishlist(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user?.wishlist || []);
  } catch (err) {
    next(err);
  }
}

export async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.wishlist.some(id => String(id) === String(productId))) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate("wishlist");
    res.status(201).json(user.wishlist);
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(id => String(id) !== String(productId));
    await user.save();

    await user.populate("wishlist");
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
}
