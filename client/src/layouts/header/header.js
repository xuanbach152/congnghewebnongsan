import './header.scss';
import { memo, useState } from 'react';
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

const MainHeader = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterPromotion, setFilterPromotion] = useState(false);
  const [filterTrend, setFilterTrend] = useState(false);
  const [filterSth, setFilterSth] = useState(false)

  const handleAssistantClick = () => {
    console.log('Gọi trợ lý ảo...');
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
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
                  <span>{isAuthModalOpen ? 'Đóng' : 'Tài khoản'}</span>
                  {isLoggedIn && <AiOutlineDown className="dropdown-arrow" />}
                  {isLoggedIn && isDropdownOpen && (
                    <div className="user_dropdown">
                      <ul>
                        <li><Link to="/profile">Thông tin cá nhân</Link></li>
                        <li><Link to="/dashboard">Quản lý cửa hàng</Link></li>
                        <li><Link to="/settings">Cài đặt</Link></li>
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
                <span>{formatter(1001230)}</span>
              </div>
              <ul>
                <li>
                  <Link to={'#'}>
                    <AiOutlineShoppingCart />
                    <span>5</span>
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
            <form onSubmit={(e) => e.preventDefault()} className="auth_form">
              <input type="text" placeholder="Email hoặc số điện thoại" required />
              <input type="password" placeholder="Mật khẩu" required />
              {!isLogin && <input type="password" placeholder="Xác nhận mật khẩu" required />}
              
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