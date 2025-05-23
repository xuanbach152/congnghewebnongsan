import { memo, useEffect, useState } from 'react'
import './myShopPage.scss'
import { Link, useNavigate, useParams } from 'react-router-dom'
import routers from 'utils/routers'
import axios from 'axios'
import { FaAngleRight, FaEdit, FaTrash } from 'react-icons/fa'
import { itemTypes, paymentMethodTypeEnum } from 'utils/enums'
import axiosInstance from 'utils/api'
import { formatDateTimeVN } from 'utils/formatter'
import { useTokenVerification } from 'utils/tokenVerification'

const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const MyShopPage = ({ setIsShowFilter }) => {
  const { shopId, tab } = useParams()
  const [shop, setShop] = useState(null)
  const [items, setItems] = useState([])
  const [shoploading, setShopLoading] = useState(true)
  const [itemLoading, setItemLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(tab)
  const [startDate, setStartDate] = useState(getToday())
  const [endDate, setEndDate] = useState(getToday())
  const [isStatisticByOrder, setIsStatisticByOrder] = useState(true)
  const [itemStatistics, setItemStatistics] = useState([])
  const [orderStatistics, setOrderStatistics] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const isVerified = useTokenVerification()
  setIsShowFilter(false)

  const navigate = useNavigate()

  const tabs = [
    { id: 'shopInfo', label: 'Thông tin cửa hàng' },
    { id: 'itemList', label: 'Danh mục sản phẩm' },
    { id: 'revenue', label: 'Thống kê doanh thu' },
  ]
  console.log(shoploading)
  useEffect(() => {
    if (!isVerified) return
    const fetchShop = async () => {
      const response = await axiosInstance.get(`/shop/${shopId}`)
      setShop(response.data.data)
      setShopLoading(false)
    }
    fetchShop()
  }, [isVerified, shopId])

  useEffect(() => {
    if (!isVerified) return
    const fetchItem = async () => {
      const response = await axiosInstance.get(`/item/shop/${shopId}`)
      const { items } = response.data.data
      setItems(items)
      setItemLoading(false)
    }
    fetchItem()
  }, [isVerified, shopId])

  useEffect(() => {
    if (!isVerified) return
    const fetchItemStatistic = async () => {
      const response = await axiosInstance.get(
        `/shop/item-statistics/${shopId}?startDate=${startDate}&endDate=${endDate}`
      )
      const data = response.data.data
      setItemStatistics(data.products)
    }
    fetchItemStatistic()
  }, [shopId, startDate, endDate, isVerified])

  useEffect(() => {
    if (!isVerified) return
    const fetchOrderStatistic = async () => {
      const response = await axiosInstance.get(
        `/shop/order-statistics/${shopId}?startDate=${startDate}&endDate=${endDate}`
      )
      const data = response.data.data
      setOrderStatistics(data.orders)
      setTotalOrders(data.totalOrders)
      setTotalRevenue(data.totalRevenue)
    }
    fetchOrderStatistic()
  }, [shopId, startDate, endDate, isVerified])

  if (shoploading || itemLoading) {
    return <div className="loading"></div>
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
              onClick={() => {
                setActiveTab(tab.id)
                navigate(routers.getMyShopPath(shopId, tab.id))
              }}
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
                      to={routers.getShopUpsertPath('update', shop._id)}
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
              <div className="btn-create-item-wrapper">
                <Link
                  to={routers.getItemUpsertPath(shopId, 'create')}
                  className="btn-create-item"
                >
                  +
                </Link>
                <span className="btn-text">Thêm mới sản phẩm</span>
              </div>
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Loại</th>
                      <th>Số lượng</th>
                      <th>Lựa chọn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item._id}
                        className="item-row"
                        onClick={() =>
                          navigate(routers.getItemDetailPath(item._id))
                        }
                      >
                        <td>
                          <img
                            src={item.imgUrl}
                            alt={item.name}
                            className="item-img"
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{itemTypes[item.type]}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <div className="action-icons">
                            <FaEdit
                              className="icon edit-icon"
                              title="Chỉnh sửa"
                              onClick={(e) => {
                                e.stopPropagation() // Chặn sự kiện nổi bọt lên <tr>
                                navigate(
                                  routers.getItemUpsertPath(
                                    shopId,
                                    'update',
                                    item._id
                                  )
                                )
                              }}
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

          {activeTab === 'revenue' && (
            <>
              <div className="revenue-header">
                <div>
                  <label>Từ ngày:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Đến ngày:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="select-container">
                  <select
                    value={isStatisticByOrder}
                    onChange={(e) =>
                      setIsStatisticByOrder(e.target.value === 'true')
                    }
                  >
                    <option value="true"> Theo đơn hàng </option>
                    <option value="false"> Theo sản phẩm </option>
                  </select>
                </div>
              </div>
              <div className="revenue-info">
                <div>
                  <p>
                    {isStatisticByOrder
                      ? `Số đơn hàng: ${totalOrders}`
                      : `Số sản phẩm: ${itemStatistics.length}`}
                  </p>
                </div>
                <div>
                  <p>Tổng doanh thu: {totalRevenue}</p>
                </div>
              </div>
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>{isStatisticByOrder ? 'Mã đơn hàng' : 'Hình ảnh'}</th>
                      <th>
                        {isStatisticByOrder ? 'Ngày tạo' : 'Tên sản phẩm'}
                      </th>
                      <th>
                        {isStatisticByOrder ? 'Tên khách hàng' : 'Đơn giá'}
                      </th>
                      <th>
                        {isStatisticByOrder ? 'Địa chỉ khách hàng' : 'Loại'}
                      </th>
                      <th>{isStatisticByOrder ? 'Số tiền' : 'Số lượng bán'}</th>
                      <th>{isStatisticByOrder ? 'PTTT' : 'Số tiền'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isStatisticByOrder
                      ? itemStatistics.map((item) => (
                          <tr key={item.itemId} className="item-row">
                            <td>
                              <img
                                src={item.imgUrl}
                                alt={item.name}
                                className="item-img"
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{itemTypes[item.type]}</td>
                            <td>{item.quantitySold}</td>
                            <td>{item.revenue}</td>
                          </tr>
                        ))
                      : orderStatistics.map((order) => (
                          <tr key={order._id} className="item-row">
                            <td>{order.orderCode}</td>
                            <td>{formatDateTimeVN(order.orderDate)}</td>
                            <td>{order.userId.userName}</td>
                            <td>{order.userId.address}</td>
                            <td>{order.totalPaymentAmount}</td>
                            <td>
                              {paymentMethodTypeEnum[order.paymentMethod]}
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
