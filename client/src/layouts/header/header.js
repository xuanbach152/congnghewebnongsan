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
import { login, register, default as axiosInstance } from 'utils/api';

const MainHeader = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartErrors, setCartErrors] = useState({});
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterPromotion, setFilterPromotion] = useState(false);
  const [filterTrend, setFilterTrend] = useState(false);
  const [filterSth, setFilterSth] = useState(false)
  const [user, setUser] = useState(null);

  const userId = user?.userId;

  const logout  = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsLoggedIn(false);
    setCartItems([]);
    setCartTotal(0);
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      if (isLogin) {
        const result = await login(email, password);
        console.log('Login result:', result); // Log kết quả để debug
        if (result.code === 200) {
          localStorage.setItem('accessToken', result.data.accessToken);
          localStorage.setItem('refreshToken', result.data.refreshToken);
          setUser(result.user);
          setIsLoggedIn(true);
          setIsAuthModalOpen(false);
        } else {
          alert(result.message || 'Đăng nhập thất bại! Vui lòng thử lại!');
        }
      } else {
        const confirmPassword = e.target.confirmPassword.value;
        if (password !== confirmPassword) {
          alert('Mật khẩu không khớp!');
          return;
        }
        const result = await register({email, password});
        console.log('Register result:', result); // Log kết quả để debug
        if (result.code === 200) {
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
        } else {
          alert(result.message || 'Đăng ký thất bại! Vui lòng thử lại!');
        }
      }
    } catch (error) {
      console.error('Auth error details: ', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleAssistantClick = () => {
    console.log('Gọi trợ lý ảo...');
  };

  const fetchCartData = async () => {
    if (!userId) return;
    setCartLoading(true);
    try {
      const response = await axiosInstance.get(`/cart/${userId}`);
      const result = await response.data;
      if (result.code === 200) {
        const items = result.data.items || [];
        setCartItems(items);
        calculateTotal(items);
      } else {
        setCartErrors({fetch: result.message || 'Không thể tải giỏ hàng'});
      }
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error.response?.data || error.message);
      setCartErrors({fetch: 'Lỗi kết nối server'});
    } finally {
      setCartLoading(false);
    }
  }  

  const calculateTotal = (items) => {
    const total = items.reduce((sum,item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
  };

  const handleAddToCart = async (product) => {
    if (!userId) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      setIsAuthModalOpen(true);
      return;
    }
    setCartLoading(true);
    setCartErrors({});
    try {
      // Kiểm tra giỏ hàng hiện tại
      let cartResponse;
      try {
        cartResponse = await axiosInstance.get(`/cart/${userId}`);
      } catch (error) {
        // Nếu không tìm thấy giỏ hàng (404), tạo mới
        if (error.response?.status === 404) {
          cartResponse = { data: { code: 404, data: null } };
        } else {
          throw error; // Ném lỗi nếu không phải 404
        }
      }

      console.log('Cart response:', cartResponse.data); // Log để debug

      const cart = cartResponse.data;
      const newItem = { productId: product.id, price: product.price, quantity: 1 };

      if (cart.code === 200 && cart.data) {
        // Cập nhật giỏ hàng nếu đã tồn tại
        const updatedItems = cart.data.items || [];
        const existingItemIndex = updatedItems.findIndex(
          (item) => item.productId === product.id
        );
        if (existingItemIndex !== -1) {
          updatedItems[existingItemIndex].quantity += 1;
        } else {
          updatedItems.push(newItem);
        }

        const response = await axiosInstance.put(`/cart/${userId}`, {
          items: updatedItems,
        });

        const result = response.data;
        console.log('Update cart response:', result);
        if (result.code === 200) {
          setCartItems(updatedItems);
          calculateTotal(updatedItems);
        } else {
          setCartErrors({
            submit: result.message || 'Không thể cập nhật giỏ hàng',
          });
        }
      } else {
        // Tạo giỏ hàng mới nếu chưa tồn tại
        const response = await axiosInstance.post(`/cart/${userId}`, {
          items: [newItem],
        });

        const result = response.data;
        console.log('Create cart response:', result);
        if (result.code === 200) {
          setCartItems([newItem]);
          calculateTotal([newItem]);
        } else {
          setCartErrors({
            submit: result.message || 'Không thể tạo giỏ hàng mới',
          });
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error.response?.data || error.message);
      setCartErrors({
        submit:
          error.response?.data?.message ||
          'Lỗi kết nối server khi thêm sản phẩm vào giỏ hàng',
      });
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
        logout();
      }
    }
  }, [userId]);

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setIsProfileOpen(false);
    setCartItems([]);
    setCartTotal(0);
  };

  const testAddToCart = () => {
    const product = { id: "67e2bdb31762e4f8f670d8bf", price: 100 };
    handleAddToCart(product);
  }

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
                  <span>{isAuthModalOpen ? 'Đóng' : 'Tài khoản'}</span>
                  {isLoggedIn && <AiOutlineDown className="dropdown-arrow" />}
                  {isLoggedIn && isDropdownOpen && (
                    <div className="user_dropdown">
                      <ul>
                        <li onClick={() => setIsProfileOpen(!isProfileOpen)}>
                          <Link to={routers.PROFILE}>Thông tin cá nhân</Link>
                        </li>
                        <li><Link to={routers.SHOP_MANAGEMENT}>Quản lý cửa hàng</Link></li>
                        <li><Link to="#">Cài đặt</Link></li>
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
              <div className="header_cart_price">
                {cartLoading ? (<span>Đang tải...</span>) : (<span>{formatter(cartTotal)}</span>)}
              </div>
              <ul>
                <li>
                  <Link to={'#'}>
                    <AiOutlineShoppingCart />
                    <span>{cartItems.length}</span>
                  </Link>
                </li>
              </ul>
              {/* Thêm nút test */}
              <button onClick={testAddToCart} style={{ marginTop: '10px' }}>
                Test Add to Cart
              </button>
              {cartErrors.fetch && <span className="error">{cartErrors.fetch}</span>}
              {cartErrors.submit && <span className="error">{cartErrors.submit}</span>}
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
              <input name="email" type="text" placeholder="Email hoặc số điện thoại" required />
              <input name="password" type="password" placeholder="Mật khẩu" required />
              {!isLogin && <input name="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" required />}
              
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