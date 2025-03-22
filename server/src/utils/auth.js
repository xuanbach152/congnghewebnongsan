import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Hàm hash mật khẩu khi đăng ký
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Hàm kiểm tra mật khẩu khi đăng nhập
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Hàm tạo JWT token
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Middleware xác thực token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, vui lòng đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu user vào req để sử dụng trong các API khác
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};
