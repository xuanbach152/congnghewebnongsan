import './header.scss'
import { memo, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  AiOutlineFacebook,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlinePhone,
  AiOutlineRocket,
  AiOutlineDown,
  AiOutlineInstagram,
  AiOutlineGoogle,
  AiOutlineBell,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import routers from 'utils/routers';
import axiosInstance from 'utils/api';
import { itemTypes, provinces } from 'utils/enums';
import { toast } from 'react-toastify';

const MainHeader = ({ setSearchQuery, distinctItemQuantity, totalPaymentAmount }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterPromotion, setFilterPromotion] = useState(false);
  const [filterTrend, setFilterTrend] = useState(false);
  const [filterSth, setFilterSth] = useState(false);
  const [user, setUser] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setItemQuantity(distinctItemQuantity);
  }, [distinctItemQuantity]);

  useEffect(() => {
    setPaymentAmount(totalPaymentAmount);
  }, [totalPaymentAmount]);

  const login = async (userName, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        userName,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng nhập' };
    }
  };

  const register = async (userName, password, phone) => {
    try {
      const response = await axiosInstance.post('/auth/register', { userName, password, phone });
      const { user, cart } = response.data;
      return { user, cart };
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng ký' };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất!';
      toast.error(errorMsg);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const userName = e.target.userName.value;
    const password = e.target.password.value;
    try {
      if (isLogin) {
        if (!userName || !password) {
          setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu');
          return;
        }
        const result = await login(userName, password);
        localStorage.setItem('accessToken', result.accessToken);
        setUser(result.user);
        setIsLoggedIn(true);
        await fetchCartData();
        setIsAuthModalOpen(false);
        window.location.reload();
      } else {
        const confirmPassword = e.target.confirmPassword.value;
        const phone = e.target.phone.value;

        if (!userName || !password || !confirmPassword || !phone) {
          setError('Vui lòng điền đầy đủ các thông tin');
          return;
        }
        if (password !== confirmPassword) {
          setError('Mật khẩu không khớp!');
          return;
        }
        await register(userName, password, phone);
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Auth error details: ', error);
      setError('Tài khoản hoặc mật khẩu không đúng.');
    }
  };

  const handleAssistantClick = () => {
    console.log('Gọi trợ lý ảo...');
  };

  const fetchCartData = async () => {
    try {
      setCartLoading(true);
      const response = await axiosInstance.get('/cart/getcart');
      setItemQuantity(response.data.data.distinctItemQuantity);
      setPaymentAmount(response.data.data.totalPaymentAmount);
      setSelectedItems(response.data.data.shopGroup.flatMap(group => group.cartItems.map(item => item._id || item.itemId._id)));
    } catch (err) {
      if (err.response?.data?.message === 'Cart not found') {
        setSelectedItems([]);
      }
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setIsLoggedIn(true);
        fetchCartData();
      } catch (error) {
        console.error('Lỗi khi giải mã token:', error.message);
      }
    }
  }, []);

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
    if (isAuthModalOpen) {
      setError('');
    }
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsProfileOpen(false);
    setItemQuantity(0);
    setPaymentAmount(0);
    toast.success('Đăng xuất thành công');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    setSearchQuery(query);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 header_top_left">
              <ul>
                <li>Chào mừng bạn</li>
                <li>
                  <AiOutlinePhone />
                  <span> Hotline 0909 090 090</span>
                </li>
              </ul>
            </div>
            <div className="col-6 header_top_right">
              <ul>
                <li>
                  <div className="notice">
                    <Link to={'#'}>
                      <AiOutlineBell />
                      <span>5</span>
                    </Link>
                  </div>
                </li>
                <li
                  onClick={() =>
                    isLoggedIn
                      ? setIsDropdownOpen(!isDropdownOpen)
                      : toggleAuthModal()
                  }
                >
                  <AiOutlineUser />
                  <span>{isLoggedIn && user?.userName ? user.userName : 'Tài khoản'}</span>
                  {isLoggedIn && <AiOutlineDown className="dropdown-arrow" />}
                  {isLoggedIn && isDropdownOpen && (
                    <div className="user_dropdown">
                      <ul>
                        <li onClick={() => setIsProfileOpen(!isProfileOpen)}>
                          <Link to={routers.PROFILE}>Thông tin cá nhân</Link>
                        </li>
                        <li><Link to={routers.SHOP_MANAGEMENT}>Quản lý cửa hàng</Link></li>
                        <li><Link to={routers.ORDER_HISTORY}>Lịch sử mua hàng</Link></li>
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
              <Link to="/">
                <h1>Nông sản Việt</h1>
              </Link>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="header_search_container">
              <div className="header_search_form">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm sản phẩm hoặc cửa hàng..."
                  />
                  <button type="submit">Tìm kiếm</button>
                </form>
                <div
                  className="header_assistant_button"
                  onClick={handleAssistantClick}
                >
                  <AiOutlineRocket />
                  <span>Trợ lý AI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="header_cart">
              <div className="header_cart_price">
                {cartLoading ? (<span>Đang tải...</span>) : (<span>{paymentAmount}</span>)}
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
            <div className="filter_group">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">Tất cả khu vực</option>
                {Object.entries(provinces).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter_group">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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
                onChange={(e) => setFilterPrice(e.target.value)}
              >
                <option value="all">Tất cả giá</option>
                <option value="under50k">Dưới 50k</option>
                <option value="50k-100k">50k - 100k</option>
                <option value="100k-200k">100k - 200k</option>
                <option value="above200k">Trên 200k</option>
              </select>
            </div>

            <div className="filter_group">
              <label>
                <input
                  type="checkbox"
                  checked={filterPromotion}
                  onChange={(e) => setFilterPromotion(e.target.checked)}
                />
                Có khuyến mãi
              </label>
            </div>

            <div className="filter_group">
              <label>
                <input
                  type="checkbox"
                  checked={filterTrend}
                  onChange={(e) => setFilterTrend(e.target.checked)}
                />
                Thịnh hành
              </label>
            </div>

            <div className="filter_group">
              <label>
                <input
                  type="checkbox"
                  checked={filterSth}
                  onChange={(e) => setFilterSth(e.target.checked)}
                />
                Sth
              </label>
            </div>
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
   </>
)}

export default memo(MainHeader)
