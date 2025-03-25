import './header.scss'
import { memo, useState } from 'react'
import {
  AiOutlineFacebook,
  AiOutlineUser,
  AiOutlineShoppingCart,
} from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { formatter } from 'utils/formatter'

const Header = () => {
  const [menu, setMenu] = useState([
    {
      name: 'Trang chủ',
      path: '',
    },
    {
      name: 'Cửa hàng',
      path: '',
    },
    {
      name: 'Sản phẩm',
      path: '',
      isShowSubmenu: false,
      child: [
        {
          name: 'Rau',
          path: '',
        },
        {
          name: 'Mì',
          path: '',
        },
      ],
    },
    {
      name: 'Bài viết',
      path: '',
    },
    {
      name: 'Liên hệ',
      path: '',
    },
    {
      name: 'Trang chủ',
      path: '',
    },
  ])

  return (
    <>
      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 header_top_left">
              <ul>
                <li>Welcome</li>
                <li>Contact</li>
                <li>Free Ship for {formatter(200000)}</li>
              </ul>
            </div>
            <div className="col-6 header_top_right">
              <ul>
                <li>
                  <Link to={''}>
                    <AiOutlineFacebook />
                  </Link>
                </li>
                <li>
                  <Link to={''}>
                    <AiOutlineUser />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3">
            <div className="header_logo">
              <h1>Nông sản Việt</h1>
            </div>
          </div>
          <div className="col-xl-6">
            <nav className="header_menu">
              <ul>
                {menu?.map((menu, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? 'active' : ''}>
                    <Link to={menu?.path}>{menu?.name}</Link>
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
                    <AiOutlineShoppingCart /> <span>5</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Header)
