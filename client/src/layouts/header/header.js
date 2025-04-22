import './header.scss';
import { memo, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
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
import { formatter } from 'utils/formatter';
import routers from 'utils/routers';
import axiosInstance from 'utils/api';

const MainHeader = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartErrors, setError] = useState({});
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterPromotion, setFilterPromotion] = useState(false);
  const [filterTrend, setFilterTrend] = useState(false);
  const [filterSth, setFilterSth] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (userName, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { userName, password });
      return response.data; 
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng nhập' };
    }
  };

  const register = async (userName, password, phone) => {
    try {
      const response = await axiosInstance.post('/auth/register', { userName, password, phone });
      const { user , cart } = response.data;
      return { user , cart }; 
    } catch (error) {
      throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng ký' };
    }
  };

  const logout = async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsLoggedIn(false);
      alert(response.data.message || 'Đăng xuất thành công!');
    } catch (error) {
      console.error('Logout error:', error);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất!';
      alert(errorMsg);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const userName = e.target.userName.value;
    const password = e.target.password.value;
    try {
      if (isLogin) {
        if (!userName || !password) {
          alert('Vui lòng điền đầy đủ userName và password!');
          return;
        }
        const result = await login(userName, password);
        localStorage.setItem('accessToken', result.accessToken);
        setUser(result.user);
        setIsLoggedIn(true);
        await fetchCartData();
        setIsAuthModalOpen(false);
      } else {
        const confirmPassword = e.target.confirmPassword.value;
        const phone = e.target.phone.value;

        if (!userName || !password || !confirmPassword || !phone) {
          alert('Vui lòng điền đầy đủ các trường: userName, password, confirmPassword, phone!');
          return;
        }
        if (password !== confirmPassword) {
          alert('Mật khẩu không khớp!');
          return;
        }
        const result = await register(userName, password, phone);
        console.log('Register result:', result);
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Auth error details: ', error);
      const errorMsg = error.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      alert(errorMsg);  
    }
  };

  const handleAssistantClick = () => {
    console.log('Gọi trợ lý ảo...');
  };

  const fetchCartData = async () => {
    try {
      setCartLoading(true);
      const response = await axiosInstance.get('/cart/getcart');
      setCart(response.data.data);
      setError(null);
      setSelectedItems(response.data.data.cartItems.map(item => item.itemId._id));
    } catch (err) {
      if (err.response?.data?.message === 'Cart not found') {
        setCart({ cartItems: [], _id: null });
        setSelectedItems([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Không thể tải giỏ hàng');
      }
    } finally {
      setCartLoading(false);
    }
  }; 

  const cartItemCount = () => {
    return cart?.cartItems?.length || 0;
  };

  const cartTotal = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems
      .filter(item => selectedItems.includes(item.itemId._id))
      .reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + price * quantity;
      }, 0);
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
        logout();
      }
    }
  }, []);

  // const addToCart = async (productId, quantity = 1) => {
  //   if (!user) {
  //     alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
  //     return;
  //   }

  //   try {
  //     const response = await axiosInstance.post('/cart/add', {
  //       userId: user._id,
  //       itemId: productId,
  //       quantity,
  //     });
  //     alert('Sản phẩm đã được thêm vào giỏ hàng!');
  //     fetchCartData(); // Cập nhật lại giỏ hàng sau khi thêm
  //   } catch (error) {
  //     console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error.response?.data || error.message);
  //     alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!');
  //   }
  // };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleLogout = async() => {
    await logout();
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsProfileOpen(false);
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
                <li onClick={() => (isLoggedIn ? setIsDropdownOpen(!isDropdownOpen) : toggleAuthModal())}>
                  <AiOutlineUser />
                  <span>{isLoggedIn && user ? user.userName : 'Tài khoản'}</span>
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
        {/* ?...? */}
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
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Tìm kiếm sản phẩm hoặc cửa hàng..." />
                  <button type="submit">Tìm kiếm</button>
                </form>
                <div className="header_assistant_button" onClick={handleAssistantClick}>
                  <AiOutlineRocket />
                  <span>Trợ lý AI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="header_cart">
              {/* <div className="test_add_to_cart">
                <button onClick={() => addToCart('67e2bdb31762e4f8f670d8c0', 2)}>Thêm sản phẩm test</button>
              </div> */}
              <div className="header_cart_price">
                {cartLoading ? (<span>Đang tải...</span>) : (<span>{formatter(cartTotal())}</span>)}
              </div>
              <ul>
                <li>
                  <Link to={routers.CART}>
                    <AiOutlineShoppingCart />
                    <span>{cartItemCount()}</span>
                  </Link>
                </li>
              </ul>
             </div>
          </div>
        </div>
        {/* ?...? */}
        <div className="row">
          <div className="filter_section">
            {/* Filter Location */}
            <div className="filter_group">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">Tất cả khu vực</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP.HCM</option>
                <option value="danang">Đà Nẵng</option>
                <option value="nearby">Gần tôi</option>
              </select>
            </div>

            {/* Filter Category */}
            <div className="filter_group">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="vegetables">Rau củ</option>
                <option value="fruits">Trái cây</option>
                <option value="organic">Hữu cơ</option>
                <option value="processed">Thực phẩm chế biến</option>
              </select>
            </div>

            {/* Filter Price */}
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

            {/* Filter Promotion */}
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

            {/* Filter Trend */}
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

            {/* Filter ??? */}
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
              <input name="userName" type="text" placeholder="Email hoặc số điện thoại" required />
              <input name="password" type="password" placeholder="Mật khẩu" required />
              {!isLogin && (
                <>
                  <input name="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" required/>
                  <input name="phone" type="text" placeholder="Số điện thoại" required/>
                </>
              )}
              {/* Nút Submit */}
              <button type="submit" className="auth_submit_button">
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </button>

              {/* Phân cách */}
              <div className="auth_separator">
                <span>Hoặc tiếp tục với</span>
              </div>

              {/* Các nút mạng xã hội */}
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
                  <AiOutlineInstagram/> Instagram
                </button>
              </div>
            </form>

            {/* Chuyển chế độ */}
            <p onClick={switchAuthMode} className="switch_mode">
              {isLogin ? 'Chưa có tài khoản ? Đăng ký ngay' : 'Đã có tài khoản ? Đăng nhập'}
            </p>

            {/* Nút đóng */}
            <button className="close_button" onClick={toggleAuthModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(MainHeader);