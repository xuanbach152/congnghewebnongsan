import './header.scss';
import { memo, useState } from 'react';
import {
  AiOutlineFacebook,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlinePhone,
  AiOutlineRocket,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { formatter } from 'utils/formatter';

const MainHeader = () => {
  const [navItems] = useState([
    { label: 'Trang chủ', url: '' },
    { label: 'Cửa hàng', url: '' },
    { label: 'Sản phẩm', url: '' },
    { label: 'Bán chạy', url: '' },
    { label: '', url: '' },
  ]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleAssistantClick = () => {
    console.log('Gọi trợ lý ảo...');
  };

  const toggleAuthModal = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  };

  const switchAuthMode = () => {
    setIsLogin(!isLogin);
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
                  <Link to={''}>
                    <AiOutlineFacebook />
                  </Link>
                </li>
                <li onClick={toggleAuthModal}>
                  <AiOutlineUser />
                  <span>{isAuthModalOpen ? 'Đóng' : 'Tài khoản'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container">
        <div className="row">
          <div className="col-xl-3">
            <div className="header_logo">
              <h1>Nông sản Việt</h1>
            </div>
          </div>
          <div className="col-xl-6">
            <nav className="header_menu">
              <ul>
                {navItems?.map((item, index) => (
                  <li key={index} className={index === 0 ? 'active' : ''}>
                    <Link to={item.url}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
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
      </div>

      {/* Search Bar */}
      <div className="header_search_container">
        <div className="row">
          <div className="col-lg-9">
            <div className="header_search_bar">
              <div className="header_search_form">
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                  <button type="submit">Tìm kiếm</button>
                </form>
                <div className="header_assistant_button" onClick={handleAssistantClick}>
                  <AiOutlineRocket />
                  <span>Trợ lý AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="auth_modal">
          <div className="auth_content">
            <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Email hoặc số điện thoại" required />
              <input type="password" placeholder="Mật khẩu" required />
              {!isLogin && <input type="password" placeholder="Xác nhận mật khẩu" required />}
              <button type="submit">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
            </form>
            <p onClick={switchAuthMode} className="switch_mode">
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </p>
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