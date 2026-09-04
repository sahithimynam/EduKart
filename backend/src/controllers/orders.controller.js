import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export async function createOrder(req, res, next) {
  try {
    const {
      items = [],
      shippingAddress = {},
      paymentMethod = "UPI",
      discount = 0
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty. Please add items before checkout." });
    }

    // Retrieve database products to ensure valid IDs & truthful server-side pricing
    const productIds = items.map(i => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(dbProducts.map(p => [String(p._id), p]));

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const p = productMap.get(String(item.productId));
      if (!p) {
        return res.status(400).json({ message: `Product not found or unavailable: ${item.title || item.productId}` });
      }
      const qty = Math.max(1, Number(item.qty || 1));
      const lineTotal = p.price * qty;
      subtotal += lineTotal;

      orderItems.push({
        product: p._id,
        title: p.title,
        img: p.img,
        price: p.price,
        qty
      });

      // Optionally decrement stock
      if (p.stock >= qty) {
        p.stock -= qty;
        await p.save();
      }
    }

    const discountAmount = Math.max(0, Math.min(Number(discount) || 0, subtotal));
    const shippingFee = subtotal > 499 ? 0 : 49;
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    const user = await User.findById(req.user._id);

    // Default address fallback from user profile if not provided
    const finalAddress = {
      fullName: shippingAddress.fullName?.trim() || user.name || "Student",
      address: shippingAddress.address?.trim() || user.address || "Main Campus Road",
      city: shippingAddress.city?.trim() || user.city || "Bangalore",
      pincode: shippingAddress.pincode?.trim() || user.pincode || "560001",
      phone: shippingAddress.phone?.trim() || user.phone || "+91 9876543210"
    };

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      subtotal,
      discount: discountAmount,
      shippingFee,
      total: grandTotal,
      status: "PLACED",
      shippingAddress: finalAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "COMPLETED"
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order
    });
  } catch (err) {
    next(err);
  }
}

export async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure only the order's owner or an admin can view it
    if (String(order.user._id) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

// Admin handlers
export async function allOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${allowed.join(", ")}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    next(err);
  }
}
