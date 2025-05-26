import './header.scss'
import { memo, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  AiOutlineFacebook,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlinePhone,
  AiOutlineInstagram,
  AiOutlineGoogle,
  AiOutlineBell,
} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'
import axiosInstance from 'utils/api'
import { itemTypes, provinces } from 'utils/enums'
import { toast } from 'react-toastify'
import { FaCaretDown } from 'react-icons/fa'

const MainHeader = ({
  setSearchQuery,
  distinctItemQuantity,
  totalPaymentAmount,
  setType,
  setMinPrice,
  setMaxPrice,
  isShowFilter,
  isLoggedIn,
  setIsLoggedIn,
  isAuthModalOpen,
  setIsAuthModalOpen,
  toggleAuthModal,
}) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [cartLoading, setCartLoading] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [user, setUser] = useState(null)
  const [itemQuantity, setItemQuantity] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isBannedPopup, setIsBannedPopup] = useState(false)
  const [bannedReason, setBannedReason] = useState('')

  useEffect(() => {
    setItemQuantity(distinctItemQuantity)
  }, [distinctItemQuantity])

  useEffect(() => {
    setPaymentAmount(totalPaymentAmount)
  }, [totalPaymentAmount])

  const login = async (userName, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        userName,
        password,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const register = async (userName, password, phone) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        userName,
        password,
        phone,
      })
      const { user, cart } = response.data
      return { user, cart }
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng ký' }
    }
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
      localStorage.removeItem('accessToken')
      setUser(null)
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Logout error:', error)
      const errorMsg =
        error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất!'
      toast.error(errorMsg)
    }
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    const userName = e.target.userName.value
    const password = e.target.password.value
    try {
      if (isLogin) {
        if (!userName || !password) {
          setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu')
          return
        }
        const result = await login(userName, password)
        console.log('Login result:', result)
        if (result.status === 'BANNED') {
          setBannedReason(
            result.reason || 'Tài khoản đã bị khóa bởi quản trị viên.'
          )
          setIsBannedPopup(true)
          return
        }
        localStorage.setItem('accessToken', result.accessToken)
        localStorage.setItem('role', result.role)
        localStorage.setItem('userId', result._id)
        setUser(result)
        setIsLoggedIn(true)
        await fetchCartData()
        setIsAuthModalOpen(false)
        window.location.reload()
      } else {
        const phone = e.target.phone.value
        const confirmPassword = e.target.confirmPassword.value
        const newErrors = {}
        if (!userName || userName.length < 3) {
          newErrors.userName = 'Tên đăng nhập phải có ít nhất 3 ký tự'
        } else if (!userName.match(/^[a-zA-Z0-9_]+$/)) {
          newErrors.userName =
            'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
        }
        if (!password) {
          newErrors.password = 'Vui lòng nhập mật khẩu'
        } else if (password.length < 8) {
          newErrors.password = 'Mật khẩu phải dài ít nhất 8 ký tự'
        } else if (
          !password.match(/[A-Z]/) ||
          !password.match(/[0-9]/) ||
          !password.match(/[!@#$%^&*(),.?":{}|<>]/)
        ) {
          newErrors.password =
            'Mật khẩu phải chứa ít nhất 1 chữ cái in hoa, 1 số và 1 ký tự đặc biệt'
        }
        if (password !== confirmPassword) {
          newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp'
        }
        if (!phone) {
          newErrors.phone = 'Vui lòng nhập số điện thoại'
        } else if (!phone.match(/(03|05|07|08|09)+([0-9]{8})\b/)) {
          newErrors.phone =
            'Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09 và có 10 chữ số)'
        }
        if (Object.keys(newErrors).length > 0) {
          setError(Object.values(newErrors)[0])
          return
        }
        await register(userName, password, phone)
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
        setIsLogin(true)
        setError('')
      }
    } catch (error) {
      console.error('Auth error details: ', error)
      setError('Tài khoản hoặc mật khẩu không đúng.')
    }
  }

  const fetchCartData = async () => {
    try {
      setCartLoading(true)
      const response = await axiosInstance.get('/cart/getcart')
      setItemQuantity(response.data.data.distinctItemQuantity)
      setPaymentAmount(response.data.data.totalPaymentAmount)
      setSelectedItems(
        response.data.data.shopGroup.flatMap((group) =>
          group.cartItems.map((item) => item._id || item.itemId._id)
        )
      )
    } catch (err) {
      if (err.response?.data?.message === 'Cart not found') {
        setSelectedItems([])
      }
    } finally {
      setCartLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        setUser(decodedToken)
        setIsLoggedIn(true)
        fetchCartData()
      } catch (error) {
        console.error('Lỗi khi giải mã token:', error.message)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header_top_right li')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const switchAuthMode = () => {
    setIsLogin(!isLogin)
    setError('')
  }

  const handleLogout = async () => {
    await logout()
    setIsLoggedIn(false)
    setIsDropdownOpen(false)
    setIsProfileOpen(false)
    setItemQuantity(0)
    setPaymentAmount(0)
    window.location.href = '/'
    toast.success('Đăng xuất thành công')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 header_top_left">
              <ul>
                <li>Chào mừng bạn đến với VietFresh</li>
                <li>
                  <AiOutlinePhone />
                  <span> Hotline 0909 090 090</span>
                </li>
              </ul>
            </div>
            <div className="col-6 header_top_right">
              <ul>
                <li
                  onClick={() =>
                    isLoggedIn
                      ? setIsDropdownOpen(!isDropdownOpen)
                      : toggleAuthModal()
                  }
                >
                  <AiOutlineUser />
                  <span>
                    {isLoggedIn && user?.userName ? user.userName : 'Tài khoản'}
                  </span>
                  {isLoggedIn && <FaCaretDown className="dropdown-arrow" />}
                  {isLoggedIn && isDropdownOpen && (
                    <div className="user_dropdown">
                      <ul>
                        <li onClick={() => setIsProfileOpen(!isProfileOpen)}>
                          <Link to={routers.PROFILE}>Thông tin cá nhân</Link>
                        </li>
                        <li>
                          <Link to={routers.SHOP_MANAGEMENT}>
                            Quản lý cửa hàng
                          </Link>
                        </li>
                        <li>
                          <Link to={routers.ORDER_HISTORY}>
                            Lịch sử mua hàng
                          </Link>
                        </li>
                        {user.role === 'ADMIN' && (
                          <li>
                            <Link to={routers.SHOP_CENSORSHIP}>
                              Kiểm duyệt cửa hàng
                            </Link>
                          </li>
                        )}
                        {user.role === 'ADMIN' && (
                          <li>
                            <Link to={routers.USER_CENSORSHIP}>
                              Quản lý người dùng
                            </Link>
                          </li>
                        )}
                        <li onClick={handleLogout}>Đăng xuất</li>
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Section */}
      <div className="container">
        {/* Header content */}
        <div className="row">
          <div className="col-xl-3">
            <div className="header_logo">
              <Link
                to="/"
                onClick={() => {
                  setSearchQuery('')
                  setSearchInput('')
                  setType(null)
                  setMinPrice(null)
                  setMaxPrice(null)
                  setFilterCategory('all')
                  setFilterPrice('all')
                }}
              >
                <h1>
                  <span className="viet">Viet</span>
                  <span className="fresh">Fresh</span>
                </h1>
              </Link>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="header_search_container">
              {isShowFilter && (
                <>
                  <div className="header_search_form">
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm sản phẩm hoặc cửa hàng..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                      <button type="submit">Tìm kiếm</button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="col-xl-1">
            <div className="header_cart">
              <div className="header_cart_price">
                {cartLoading ? (
                  <span>Đang tải...</span>
                ) : (
                  <span>{paymentAmount}</span>
                )}
              </div>
              <ul>
                <li>
                  <Link to={routers.CART}>
                    <AiOutlineShoppingCart />
                    <span>{itemQuantity}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="filter_section">
            {/* Filters */}
            {isShowFilter && (
              <>
                <div className="filter_group">
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value)
                      if (e.target.value === 'all') {
                        setType(null)
                      } else setType(e.target.value)
                    }}
                  >
                    <option value="all">Tất cả danh mục</option>
                    {Object.entries(itemTypes).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter_group">
                  <select
                    value={filterPrice}
                    onChange={(e) => {
                      const value = e.target.value
                      setFilterPrice(value)
                      // Thiết lập min/max price theo từng option
                      if (value === 'all') {
                        setMinPrice(null)
                        setMaxPrice(null)
                      } else if (value === 'under50k') {
                        setMinPrice(0)
                        setMaxPrice(49999)
                      } else if (value === '50k-100k') {
                        setMinPrice(50000)
                        setMaxPrice(100000)
                      } else if (value === '100k-200k') {
                        setMinPrice(100000)
                        setMaxPrice(200000)
                      } else if (value === 'above200k') {
                        setMinPrice(200000)
                        setMaxPrice(null)
                      }
                    }}
                  >
                    <option value="all">Tất cả giá</option>
                    <option value="under50k">Dưới 50k</option>
                    <option value="50k-100k">50k - 100k</option>
                    <option value="100k-200k">100k - 200k</option>
                    <option value="above200k">Trên 200k</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="auth_modal">
          <div className="auth_content">
            <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
            <form onSubmit={handleAuthSubmit} className="auth_form">
              <input
                name="userName"
                type="text"
                placeholder="Tên đăng nhập"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                required
              />
              {!isLogin && (
                <>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    required
                  />
                  <input
                    name="phone"
                    type="text"
                    placeholder="Số điện thoại"
                    required
                  />
                </>
              )}
              {error && <div className="auth_error">{error}</div>}
              <button type="submit" className="auth_submit_button">
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </button>

              <div className="auth_separator">
                <span>Hoặc tiếp tục với</span>
              </div>

              <div className="auth_social_buttons">
                <button type="button" className="social_button google">
                  <AiOutlineGoogle />
                  <span className="google_text">
                    <span className="g1">G</span>
                    <span className="o1">o</span>
                    <span className="o2">o</span>
                    <span className="g2">g</span>
                    <span className="l">l</span>
                    <span className="e">e</span>
                  </span>
                </button>
                <button type="button" className="social_button facebook">
                  <AiOutlineFacebook /> Facebook
                </button>
                <button type="button" className="social_button instagram">
                  <AiOutlineInstagram /> Instagram
                </button>
              </div>
            </form>

            <p onClick={switchAuthMode} className="switch_mode">
              {isLogin
                ? 'Chưa có tài khoản ? Đăng ký ngay'
                : 'Đã có tài khoản ? Đăng nhập'}
            </p>

            <button className="close_button" onClick={toggleAuthModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
      {/* Banned Popup */}
      {isBannedPopup && (
        <div className="auth_modal banned_modal">
          <div className="auth_content">
            <h2>Tài khoản đã bị khóa</h2>
            <p>
              Lý do: {bannedReason}
            </p>
            <button
              className="auth_submit_button"
              onClick={() => setIsBannedPopup(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default memo(MainHeader)
