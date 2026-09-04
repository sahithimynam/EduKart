import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "edukart_super_secret_jwt_key_2025_learning_store";

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, address, city, pincode, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered. Please sign in." });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      address: address?.trim() || "",
      city: city?.trim() || "",
      pincode: pincode?.trim() || "",
      phone: phone?.trim() || "",
      role: "user"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        phone: user.phone,
        wishlist: user.wishlist
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function demoLogin(req, res, next) {
  try {
    const { role = "user" } = req.body;
    const targetEmail = role === "admin" ? "admin@edukart.com" : "student@edukart.com";

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      // Auto-create demo user if not present
      const hash = await bcrypt.hash(role === "admin" ? "admin123" : "student123", 10);
      user = await User.create({
        name: role === "admin" ? "Edukart Admin" : "Demo Student",
        email: targetEmail,
        password: hash,
        role: role === "admin" ? "admin" : "user",
        address: "742 Evergreen Terrace, Edu City",
        city: "Tech City",
        pincode: "560001",
        phone: "+91 98765 43210"
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: `Logged in as ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        phone: user.phone,
        wishlist: user.wishlist
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    address: req.user.address,
    city: req.user.city,
    pincode: req.user.pincode,
    phone: req.user.phone,
    wishlist: req.user.wishlist
  });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, address, city, pincode, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name.trim();
    if (address !== undefined) user.address = address.trim();
    if (city !== undefined) user.city = city.trim();
    if (pincode !== undefined) user.pincode = pincode.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        phone: user.phone
      }
    });
  } catch (err) {
    next(err);
  }
}
