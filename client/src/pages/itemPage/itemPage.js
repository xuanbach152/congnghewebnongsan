import { memo, useEffect, useState } from 'react'
import './itemPage.scss'
import Pagination from 'layouts/pagination/pagination'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'
import { default as axiosInstance } from 'utils/api'
import { FaAngleRight, FaStar } from 'react-icons/fa'
import { itemTypes } from 'utils/enums'

const ItemPage = () => {
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get(
          `http://localhost:3000/item?page=${currentPage}`
        )
        const { items, totalPages } = response.data.data
        setTotalPages(totalPages)
        setItems(items)
        console.log(items)
      } catch (error) {
        console.error(
          'Error fetching item data:',
          error.response?.data || error.message
        )
      }
    }

    fetchItems()
  }, [currentPage])

  return (
    <>
      <div className="item-management">
        <div className="container">
          <div className="navigation">
            <Link to={routers.SHOP_MANAGEMENT} className="nav-item">
              Quản lý cửa hàng
            </Link>
            <FaAngleRight className="nav-icon" />
            <Link to={routers.ITEM} className="nav-item-management">
              Danh sách sản phẩm
            </Link>
          </div>
          <div className="item-list">
            <div className="item-list-title">
              <div className="title-text">
                Danh sách sản phẩm của của hàng X
              </div>
              <Link to={routers.ITEM_CREATION} className="btn-create-item">
                +
              </Link>
              <span className="btn-text">Thêm sản phẩm mới</span>
            </div>
            {items.length > 0 ? (
              <>
                {items.map((item) => (
                  <Link to={routers.ITEM_CREATION}>
                    <div key={item.id} className="item">
                      <div className="item-image">
                        <img src={item.imgUrl} alt={item.name} />
                      </div>
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">Đơn giá: {item.price}</div>
                        <div className="item-type">Loại hàng: {itemTypes[item.type]}</div>
                        <div className="item-rate">
                          Đánh giá: {item.rate}
                          <FaStar
                            color="gold"
                            size={14}
                            style={{ marginTop: '2px' }}
                          />
                        </div>
                        <div className="item-quantity">
                          Số lượng: {item.quantity}{' '}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />{' '}
              </>
            ) : (
              <p>Hiện chưa có sản phẩm nào</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ItemPage)
