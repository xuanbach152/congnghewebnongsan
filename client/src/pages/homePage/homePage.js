import { memo, use, useEffect, useState } from 'react'
import './homePage.scss'
import { Link, useNavigate } from 'react-router-dom'
import routers from 'utils/routers'
import { default as axiosInstance } from 'utils/api'
import ArrowPagination from 'layouts/arrowPagination/arrowPagination'
import { FaStar } from 'react-icons/fa'
import { formatter } from 'utils/formatter'
import { itemTypes } from 'utils/enums'

const HomePage = ({
  searchQuery,
  type,
  minPrice,
  maxPrice,
  setIsShowFilter,
  isLoggedIn,
  toggleAuthModal,
}) => {
  const [shops, setShops] = useState([])
  const [shopTotalPages, setShopTotalPages] = useState(1)
  const [shopCurrentPage, setShopCurrentPage] = useState(1)
  const [shopLoading, setShopLoading] = useState(false)

  const [items, setItems] = useState([])
  const [itemTotalPages, setItemTotalPages] = useState(1)
  const [itemCurrentPage, setItemCurrentPage] = useState(1)
  const [itemLoading, setItemLoading] = useState(false)
  const navigate = useNavigate()
  setIsShowFilter(true)

  useEffect(() => {
    const fetchShops = async () => {
      setShopLoading(true)
      try {
        const url =
          searchQuery === ''
            ? `/shop/accepted?page=${shopCurrentPage}`
            : `/shop/search?searchText=${searchQuery}`
        const response = await axiosInstance.get(url)
        if (searchQuery === '') {
          const { shops, totalPages } = response.data.data
          setShopTotalPages(totalPages)
          setShops(shops)
        } else {
          setShops(response.data.data)
        }
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
  }, [searchQuery, shopCurrentPage])

  useEffect(() => {
    setItemCurrentPage(1)
  }, [minPrice, maxPrice, type, searchQuery])

  useEffect(() => {
    const fetchItems = async () => {
      console.log(type, minPrice, maxPrice)
      setItemLoading(true)
      try {
        let url = `/item/filter?page=${itemCurrentPage}`
        if (type) url += `&type=${type}`
        if (minPrice !== null && minPrice !== undefined)
          url += `&minPrice=${minPrice}`
        if (maxPrice !== null && maxPrice !== undefined)
          url += `&maxPrice=${maxPrice}`
        if (
          searchQuery !== null &&
          searchQuery !== undefined &&
          searchQuery !== ''
        ) {
          url += `&searchText=${searchQuery}`
        }
        const response = await axiosInstance.get(url)
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
  }, [itemCurrentPage, maxPrice, minPrice, searchQuery, type])

  const handleShopClick = (shopId) => {
    if (!isLoggedIn) {
      toggleAuthModal()
      return
    }
    navigate(routers.getShopDetailPath(shopId))
  }

  const handleItemClick = (itemId) => {
    if (!isLoggedIn) {
      toggleAuthModal()
      return
    }
    navigate(routers.getItemDetailPath(itemId))
  }

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
                      <div
                        key={item._id}
                        to={routers.getItemDetailPath(item._id)}
                        onClick={() => handleItemClick(item._id)}
                        style={{ cursor: 'pointer' }}
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
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p>Không có sản phẩm phù hợp</p>
            )}
          </div>
          <div className="divider"></div>
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
                      <div
                        key={shop._id}
                        to={routers.getShopDetailPath(shop._id)}
                        onClick={() => handleShopClick(shop._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="shop">
                          <div className="shop-image">
                            <img src={shop.imgUrl} alt={shop.name} />
                          </div>
                          <div className="shop-info">
                            <div className="shop-name">{shop.name}</div>
                            <div className="shop-address">
                              Địa chỉ: {shop.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p>Không có cửa hàng phù hợp</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(HomePage)
