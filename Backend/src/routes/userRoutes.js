import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"  // ✅ default role user
    });

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
       // ✅ send role to frontend
      user: { name: user.name, role: user.role, email: user.email }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;
