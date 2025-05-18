import { memo, useEffect, useState } from 'react'
import './shopManagementPage.scss'
import Pagination from 'layouts/pagination/pagination'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'
import { default as axiosInstance } from 'utils/api'
import { useTokenVerification } from 'utils/tokenVerification'

const ShopManagementPage = () => {
  const [shops, setShops] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const isVerified = useTokenVerification();

  const fetchShops = async (page) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `http://localhost:3000/shop/user?page=${page}`
      )
      const { shops, totalPages } = response.data.data;
      setTotalPages(totalPages)
      setShops(shops)
    } catch (error) {
      console.error(
        'Error fetching shop data:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isVerified) return;

    fetchShops(currentPage);
  }, [isVerified, currentPage]);

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
              <Link
                to={routers.getShopUpsertPath('create')}
                className="btn-create-shop"
              >
                +
              </Link>
              <span className="btn-text">Đăng ký cửa hàng</span>
            </div>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : shops.length > 0 ? (
              <>
                {shops.map((shop) => (
                  <Link
                    key={shop._id}
                    to={routers.getMyShopPath(shop._id, 'shopInfo')}
                  >
                    <div className="shop">
                      <div className="shop-image">
                        <img src={shop.imgUrl} alt={shop.name} />
                      </div>
                      <div className="shop-info">
                        <div className="shop-name">{shop.name}</div>
                        <div className="shop-address">{shop.address}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
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
