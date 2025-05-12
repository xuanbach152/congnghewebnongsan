import { memo, useEffect, useState } from 'react'
import './shopDetailPage.scss'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { FaStar } from 'react-icons/fa'
import axiosInstance from 'utils/api'
import Pagination from 'layouts/pagination/pagination'
import routers from 'utils/routers'
import { formatter } from 'utils/formatter'
import { itemTypes } from 'utils/enums'

const ShopDetailPage = () => {
  const { shopId } = useParams()
  const [shop, setShop] = useState(null)
  const [items, setItems] = useState([])
  const [itemTotalPages, setItemTotalPages] = useState(5)
  const [itemCurrentPage, setItemCurrentPage] = useState(1)
  const [itemLoading, setItemLoading] = useState(false)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/shop/${shopId}`)
      .then((response) => {
        setShop(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching shop data:', error)
      })
  }, [shopId])

  useEffect(() => {
    const fetchItems = async () => {
      setItemLoading(true)
      try {
        const response = await axiosInstance.get(
          `http://localhost:3000/item/shop/${shopId}/?page=${itemCurrentPage}`
        )
        const { items, totalPages } = response.data.data
        setItemTotalPages(totalPages)
        setItems(items)
      } catch (error) {
        console.error(
          'Error fetching item data:',
          error.response?.data || error.message
        )
      } finally {
        setItemLoading(false)
      }
    }

    fetchItems()
  }, [itemCurrentPage, shopId])

  return (
    <div className="shop-information-management">
      <div className="container">
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
                    <strong>Tên cửa hàng: </strong> {shop.name}
                  </div>
                  <div className="shop-address">
                    <strong>Địa chỉ: </strong>
                    {shop.address}
                  </div>
                  <div className="shop-phone">
                    <strong>Số điện thoại: </strong>
                    {shop.phone || '0987654321'}
                  </div>
                  <div className="shop-rate">
                    <strong>Đánh giá:</strong> {shop.rate}
                    <FaStar
                      color="gold"
                      size={14}
                      style={{ marginTop: '2px' }}
                    />
                  </div>
                  <div>
                    <strong>Mô tả: </strong>
                    {shop.description || 'Không có mô tả'}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="divider"></div>

          <div className="item-list">
            <div className="item-list-title">
              <div className="title-text">Sản phẩm trong cửa hàng</div>
            </div>
            {itemLoading ? (
              <p>Đang tải dữ liệu...</p>
            ) : items.length > 0 ? (
              <>
                <div className="item-grid-wrapper">
                  <div className="item-grid">
                    {items.map((item) => (
                      <Link
                        key={item._id}
                        to={routers.getItemDetailPath(item._id)}
                      >
                        <div className="item">
                          <div className="item-image">
                            <img src={item.imgUrl} alt={item.name} />
                          </div>
                          <div className="item-info">
                            <div className="item-name">{item.name}</div>
                            <div className="item-price">
                              Đơn giá: {formatter(item.price)}
                            </div>
                            <div className="item-type">
                              Loại hàng: {itemTypes[item.type]}
                            </div>
                            <div className="item-rate">
                              Đánh giá: {item.rate}
                              <FaStar
                                color="gold"
                                size={14}
                                style={{ marginTop: '1px' }}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Pagination
                    totalPages={itemTotalPages}
                    currentPage={itemCurrentPage}
                    onPageChange={setItemCurrentPage}
                  />
                </div>
              </>
            ) : (
              <p>Hiện chưa có sản phẩm nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ShopDetailPage)
