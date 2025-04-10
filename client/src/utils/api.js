// utils/api.js
import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // URL backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header của mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Hàm đăng nhập
export const login = async (userName, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { userName, password });
    console.log('Login response:', response.data); // Log response để debug
    return response.data; // Trả về dữ liệu từ server
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng nhập' };
  }
};

// Hàm đăng ký
export const register = async (userName, password) => {
  try {
    const response = await axiosInstance.post('/auth/register', { userName, password });
    console.log('Register response:', response.data); // Log response để debug
    return response.data; // Trả về dữ liệu từ server
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng ký' };
  }
};

export default axiosInstance;