import userService from "../services/user.service.js";
import CartService from "../services/cart.service.js";
import {
  hashPassword,
  generateAcessToken,
  generateRefreshToken,
  comparePassword,
  verifyToken,
  verifyRole,
  verifyRefreshToken,
} from "../services/auth.service.js";
import httpStatus from "http-status";
import Message from "../utils/message.js";
import userModel from "../models/user.model.js";
import distanceService from "../utils/distance.utils.js";


let refreshTokens = [];
export const register = async (req, res) => {
  try {
    const { userName, password, address, phone, email, gender } = req.body;

    if (!userName || !password || !phone) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message:
          "Vui lòng cung cấp đầy đủ thông tin (userName, password, address, phone, email, gender)",
      });
    }

    const existingUser = await userModel.findOne({ userName });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Tên đăng nhập đã tồn tại",
      });
    }

    const hashedPassword = await hashPassword(password);
    // const coordinates = await distanceService.geocodeAddress(address);
    // if (coordinates) {
    //   req.body.latitude = coordinates.latitude;
    //   req.body.longitude = coordinates.longitude;
    // }
    const newUser = await userService.createUser({
      ...req.body,
      password: hashedPassword,
    });

    await CartService.createCart({
      userId: newUser._id,
      shopGroup: [],
    });

    res.status(httpStatus.CREATED).json({
      message: "Đăng ký tài khoản thành công",
      user: newUser
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await userService.getUserByName(userName);
    if (!user) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid username or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Invalid username or password" });
    }

    const accessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    const { password: _, ...others } = user._doc;
    res.status(httpStatus.OK).json({ ...others, accessToken });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    // Xóa cookie chứa token
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    // Trả về phản hồi thành công
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đăng xuất", error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; //lấy từ cookie
    if (!refreshToken) {
      return res.status(403).json({ message: "Vui lòng đăng nhập" });
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken); //lọc ra token cũ
    const user = verifyRefreshToken(refreshToken);
    const accessToken = generateAcessToken(user);
    const newrefreshToken = generateRefreshToken(user);
    refreshTokens.push(newrefreshToken);
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi làm mới token", error });
  }
};
