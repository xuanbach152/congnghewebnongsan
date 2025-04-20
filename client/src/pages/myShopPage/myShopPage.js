import { memo, useEffect, useState } from 'react'
import './myShopPage.scss'
import { Link, useNavigate, useParams } from 'react-router-dom'
import routers from 'utils/routers'
import axios from 'axios'
import { FaAngleRight, FaEdit, FaTrash } from 'react-icons/fa'

const MyShopPage = () => {
  const { shopId } = useParams()
  const [shop, setShop] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('shopInfo')
  const navigate = useNavigate();

  const tabs = [
    { id: 'shopInfo', label: 'Thông tin cửa hàng' },
    { id: 'itemList', label: 'Danh mục sản phẩm' },
    { id: 'revenue', label: 'Thống kê doanh thu' },
  ]

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

  useEffect(() => {
    axios
      .get(`http://localhost:3000/item/shop/${shopId}`)
      .then((response) => {
        const { items } = response.data.data;
        setItems(items);
      })
      .catch((error) => {
        console.error('Error fetching items data:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [shopId])

  if (loading) {
    return <div className="loading">Đang tải thông tin cửa hàng...</div>
  }

  return (
    <div className="my-management">
      <div className="container">
        <div className="navigation">
          <Link to={routers.SHOP_MANAGEMENT} className="nav-shop-management">
            Quản lý cửa hàng
          </Link>
          <FaAngleRight className="nav-icon" />
          <Link className="nav-my-shop">{shop.name}</Link>
        </div>
        <div className="tab-wrapper">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''} ${index !== tabs.length - 1 ? 'border-right' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="tab-content-container">
          {activeTab === 'shopInfo' && (
            <div className="my-shop">
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
                  <div className="shop-actions">
                    <Link
                      to={`/shop-management/${shop.id}/edit`}
                      className="btn btn-edit"
                    >
                      <FaEdit /> Chỉnh sửa
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'itemList' && (
            <>
              <div className="btn-create-shop-wrapper">
                <Link to={routers.getItemCreationPath(shopId)} className="btn-create-shop">
                  +
                </Link>
                <span className="btn-text">Thêm mới sản phẩm</span>
              </div>
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Tên</th>
                      <th>Giá</th>
                      <th>Loại</th>
                      <th>Số lượng</th>
                      <th>Địa chỉ</th>
                      <th>Lựa chọn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} className="item-row">
                        <td>
                          <img src={item.imgUrl} alt={item.name} className="item-img" />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.type}</td>
                        <td>{item.quantity}</td>
                        <td>{item.address}</td>
                        <td>
                          <div className="action-icons">
                            <FaEdit
                              className="icon edit-icon"
                              title="Chỉnh sửa"
                            // onClick={() => navigate(`/item/${item._id}/edit`)}
                            />
                            <FaTrash
                              className="icon delete-icon"
                              title="Xóa"
                            // onClick={() => handleDelete(item._id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>



            </>
          )}
        </div>


      </div>
    </div>
  )
}

export default memo(MyShopPage)
