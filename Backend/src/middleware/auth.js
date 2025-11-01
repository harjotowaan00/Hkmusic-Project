import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "MY_SECRET");
    req.user = decoded;
    next();
  } catch (error) {
    res.json({ success: false, message: "Unauthorized" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.json({ success: false, message: "Admin Access Denied" });
  next();
};
