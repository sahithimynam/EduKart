import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "edukart_super_secret_jwt_key_2025_learning_store";

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Validates if an email matches the permitted college student pattern:
 * 23501a05xx@edukart.com where xx is:
 * - 1 to 99 (supports 01-99 and 1-99)
 * - A0 to A9, B0 to B9, C0 to C9, D0 to D9, E0 to E9, F0 to F9, G0 to G9, H0 to H9, I0 to I9
 * - J0 to J3
 */
export function isValidStudentEmail(email) {
  if (!email || typeof email !== "string") return false;
  const cleanEmail = email.toLowerCase().trim();
  const match = cleanEmail.match(/^23501a05([0-9a-z]{1,2})@edukart\.com$/);
  if (!match) return false;
  const suffix = match[1];

  // 1 to 99 (or 01 to 99)
  if (/^(0?[1-9]|[1-9][0-9])$/.test(suffix)) {
    return true;
  }

  // A0 to I9
  if (/^[a-i][0-9]$/.test(suffix)) {
    return true;
  }

  // J0 to J3
  if (/^j[0-3]$/.test(suffix)) {
    return true;
  }

  return false;
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

    const cleanEmail = email.toLowerCase().trim();

    // Check allowed email pattern
    if (!isValidStudentEmail(cleanEmail) && cleanEmail !== "admin@edukart.com") {
      return res.status(400).json({
        message: "Registration is restricted to college students with email format 23501a05xx@edukart.com (xx: 01-99, A0-A9, ... J3)."
      });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered. Please sign in." });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hash,
      address: address?.trim() || "",
      city: city?.trim() || "",
      pincode: pincode?.trim() || "",
      phone: phone?.trim() || "",
      role: cleanEmail === "admin@edukart.com" ? "admin" : "user"
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

    const cleanEmail = email.toLowerCase().trim();
    const isStudent = isValidStudentEmail(cleanEmail);
    const isAdmin = cleanEmail === "admin@edukart.com";

    if (!isStudent && !isAdmin) {
      return res.status(403).json({
        message: "Access restricted: Only college emails (23501a05xx@edukart.com where xx is 01-99, A0-A9, ... J3) or admin can log in."
      });
    }

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      if (isStudent && password === "student123") {
        // Automatically create account for student with default password student123
        const rollCode = cleanEmail.split("@")[0].toUpperCase();
        const hash = await bcrypt.hash("student123", 10);
        user = await User.create({
          name: `Student (${rollCode})`,
          email: cleanEmail,
          password: hash,
          role: "user",
          address: "Campus Hostel",
          city: "Campus",
          pincode: "500001",
          phone: "+91 98765 00000"
        });
      } else if (isStudent) {
        return res.status(401).json({ message: "Incorrect password. Default password is student123" });
      } else {
        return res.status(404).json({ message: "Admin account not found." });
      }
    } else {
      // User exists
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Also permit default password student123 for students
        if (isStudent && password === "student123") {
          // OK
        } else {
          return res.status(401).json({ message: "Incorrect password. Default password is student123" });
        }
      }
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
    const targetEmail = role === "admin" ? "admin@edukart.com" : "23501a0501@edukart.com";

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      const hash = await bcrypt.hash(role === "admin" ? "admin123" : "student123", 10);
      user = await User.create({
        name: role === "admin" ? "Edukart Admin" : "Student (23501A0501)",
        email: targetEmail,
        password: hash,
        role: role === "admin" ? "admin" : "user",
        address: "Campus Hostel, Room 101",
        city: "Campus",
        pincode: "500001",
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
