import { memo, useEffect, useState } from 'react'
import './homePage.scss'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'
import { default as axiosInstance } from 'utils/api'
import ArrowPagination from 'layouts/arrowPagination/arrowPagination'

const HomePage = () => {
  const [shops, setShops] = useState([])
  const [shopTotalPages, setShopTotalPages] = useState(5)
  const [shopCurrentPage, setShopCurrentPage] = useState(1)
  const [shopLoading, setShopLoading] = useState(false)

  const [items, setItems] = useState([])
  const [itemTotalPages, setItemTotalPages] = useState(5)
  const [itemCurrentPage, setItemCurrentPage] = useState(1)
  const [itemLoading, setItemLoading] = useState(false)

  useEffect(() => {
    const fetchShops = async () => {
      setShopLoading(true)
      try {
        const response = await axiosInstance.get(
          `http://localhost:3000/shop?page=${shopCurrentPage}`
        )
        const { shops, totalPages } = response.data.data
        setShopTotalPages(totalPages)
        setShops(shops)
      } catch (error) {
        console.error(
          'Error fetching shop data:',
          error.response?.data || error.message
        )
      } finally {
        setShopLoading(false)
      }
    }

    fetchShops()
  }, [shopCurrentPage])

  useEffect(() => {
    const fetchItems = async () => {
      setItemLoading(true)
      try {
        const response = await axiosInstance.get(
          `http://localhost:3000/item?page=${itemCurrentPage}`
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
  }, [itemCurrentPage])

  return (
    <>
      <div className="homePage">
        <div className="container">
          <div className="item-list">
            <div className="item-list-title">
              <div className="title-text">Sản phẩm nổi bật</div>
            </div>
            {itemLoading ? (
              <p>Đang tải dữ liệu...</p>
            ) : items.length > 0 ? (
              <>
                <div className="item-grid-wrapper">
                  <ArrowPagination
                    totalPages={itemTotalPages}
                    currentPage={itemCurrentPage}
                    onPageChange={setItemCurrentPage}
                  />
                  <div className="item-grid">
                    {items.map((item) => (
                      <Link key={item._id} to={routers.ITEM}>
                        <div className="item">
                          <div className="item-image">
                            <img src={item.imgUrl} alt={item.name} />
                          </div>
                          <div className="item-info">
                            <div className="item-name">{item.name}</div>
                            <div className="item-description">{item.description}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p>Hiện chưa có sản phẩm nào</p>
            )}
          </div>
          <div class="divider"></div>
          <div className="shop-list">
            <div className="shop-list-title">
              <div className="title-text">Cửa hàng nổi bật</div>
            </div>
            {shopLoading ? (
              <p>Đang tải dữ liệu...</p>
            ) : shops.length > 0 ? (
              <>
                <div className="shop-grid-wrapper">
                  <ArrowPagination
                    totalPages={shopTotalPages}
                    currentPage={shopCurrentPage}
                    onPageChange={setShopCurrentPage}
                  />
                  <div className="shop-grid">
                    {shops.map((shop) => (
                      <Link key={shop._id} to={routers.getShopPath(shop._id)}>
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
                  </div>
                </div>
              </>
            ) : (
              <p>Hiện chưa có cửa hàng đăng ký</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(HomePage)
