import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import e from "express";

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
export const generateAcessToken = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, userName: user.userName, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return accessToken;
};

export const generateRefreshToken = (user) => {
  // Tạo refresh token
  const refreshToken = jwt.sign(
    { id: user.id, userName: user.userName, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
  return refreshToken;
};

//Xác thực role
export const verifyRole = (roles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role; // Vai trò của người dùng (được gắn từ token)

      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next(); // Cho phép tiếp tục nếu vai trò hợp lệ
    } catch (error) {
      res.status(500).json({ message: "Error verifying role", error });
    }
  };
};

//Có thể xóa không
export const canDelete = (req, res, next) => {
  try {
    const userId = req.user.id; // ID của người dùng hiện tại từ token
    const userRole = req.user.role; // Vai trò của người dùng hiện tại từ token
    const targetUserId = req.params.id; // ID của người dùng cần xóa

    // Kiểm tra nếu người dùng là chính họ hoặc là admin
    if (userId === targetUserId || userRole === "ADMIN") {
      return next(); // Cho phép tiếp tục nếu hợp lệ
    }

    return res
      .status(403)
      .json({ message: "Bạn không có quyền xóa thông tin này" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xác thực quyền xóa", error });
  }
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

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET); // Sử dụng JWT_REFRESH_SECRET
  } catch (error) {
    throw new Error("Refresh Token không hợp lệ hoặc đã hết hạn");
  }
};
