import { memo, useEffect, useState } from 'react'
import './shopDetailPage.scss'
import { Link, useParams } from 'react-router-dom'
import routers from 'utils/routers'
import axios from 'axios'
import { FaAngleRight, FaBox, FaEdit } from 'react-icons/fa'

const ShopDetailPage = () => {
  const { shopId } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/shop/${shopId}`)
      .then((response) => {
        setShop(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching shop data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [shopId])

  return (
    <div className="shop-information-management">
      <div className="container">
        <div className="navigation">
          <Link to={routers.SHOP_MANAGEMENT} className="nav-shop-management">
            Quản lý cửa hàng
          </Link>
          <FaAngleRight className="nav-icon" />
          <Link className="nav-shop-information">Thông tin cửa hàng</Link>
        </div>

        <div className="shop-information">
          <div className="shop-information-title">
            <div className="title-text">Thông tin cửa hàng</div>
          </div>

          {shop && (
            <>
              <div className="shop-detail">
                {shop.imgUrl && (
                  <div className="shop-image">
                    <img src={shop.imgUrl} alt={shop.name || 'Cửa hàng'} />
                  </div>
                )}

                <div className="shop-content">
                  <div>
                    <strong>Tên cửa hàng:</strong> {shop.name}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong> {shop.address}
                  </div>
                  <div>
                    <strong>Mô tả:</strong>{' '}
                    {shop.description || 'Không có mô tả'}
                  </div>
                </div>
              </div>

              <div className="shop-actions">
                <Link
                  to={`/shop-management/${shop.id}/edit`}
                  className="btn btn-edit"
                >
                  <FaEdit /> Chỉnh sửa
                </Link>
                <Link to={`/item`} className="btn btn-view">
                  <FaBox /> Xem sản phẩm
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ShopDetailPage)
