import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://congnghewebnongsan-2.onrender.com',
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const res = await axios.post(
          'https://congnghewebnongsan-2.onrender.com/auth/refresh-token',
          {},
          { withCredentials: true }
        )

        const newAccessToken = res.data.accessToken

        localStorage.setItem('accessToken', newAccessToken)

        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError)
        localStorage.removeItem('accessToken')
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
