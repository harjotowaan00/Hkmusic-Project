import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hashedPass,
      role: "user" // default user
    });

    res.json({ success: true, message: "Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Registration Failed" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User Not Found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login Failed" });
  }
};
