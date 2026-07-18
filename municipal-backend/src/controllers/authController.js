import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.json({ token: generateToken(user._id) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  //  Normalize email
  const emailLower = email.toLowerCase();

  // Find user
  const user = await User.findOne({ email: emailLower });
  

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Compare hashed password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Success
  res.json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
