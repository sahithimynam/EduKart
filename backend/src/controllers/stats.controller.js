import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export async function getAdminStats(req, res, next) {
  try {
    const [totalProducts, totalUsers, totalOrders, orders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email")
    ]);

    // Calculate total revenue from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "CANCELLED" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Status breakdown
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const statusMap = Object.fromEntries(statusCounts.map(s => [s._id, s.count]));

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      statusBreakdown: {
        PLACED: statusMap.PLACED || 0,
        CONFIRMED: statusMap.CONFIRMED || 0,
        SHIPPED: statusMap.SHIPPED || 0,
        DELIVERED: statusMap.DELIVERED || 0,
        CANCELLED: statusMap.CANCELLED || 0
      },
      recentOrders: orders
    });
  } catch (err) {
    next(err);
  }
}
