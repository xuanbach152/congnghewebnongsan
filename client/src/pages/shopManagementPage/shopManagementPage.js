import { memo, useState } from 'react'
import './shopManagementPage.scss'
import Pagination from 'layouts/pagination/pagination'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'

const ShopManagementPage = () => {
  const [shopList] = useState([
    { id: 1, name: 'Cửa hàng A' },
    { id: 2, name: 'Cửa hàng B' },
    { id: 3, name: 'Cửa hàng C' },
  ])
  const [totalPages, setTotalPages] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <>
      <div className="shop-management">
        <div className="container">
          <div className="navigation">
            <Link to={routers.SHOP_MANAGEMENT} className="nav-shop-management">
              Quản lý cửa hàng
            </Link>
          </div>
          <div className="shop-list">
            <div className="shop-list-title">
              <div className="title-text">Danh sách cửa hàng của bạn</div>
              <Link to={routers.SHOP_REGISTRATION} className="btn-create-shop">+</Link>
              <span className="btn-text">Đăng ký cửa hàng</span>
            </div>
            {shopList.length > 0 ? (
              <>
                {shopList.map((shop) => (
                  <div key={shop.id} className="shop-item">
                    {shop.name}
                  </div>
                ))}
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />{' '}
              </>
            ) : (
              <p>Hiện chưa đăng ký cửa hàng nào</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ShopManagementPage)
