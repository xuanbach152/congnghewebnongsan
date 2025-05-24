import { memo, useEffect, useState } from 'react'
import './shopCensorshipPage.scss'
import Pagination from 'layouts/pagination/pagination'
import { default as axiosInstance } from 'utils/api'
import { useTokenVerification } from 'utils/tokenVerification'
import { shopStatusEnum } from 'utils/enums'

const ShopCensorshipPage = ({ setIsShowFilter }) => {
  const [shops, setShops] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedShop, setSelectedShop] = useState(null)
  const [nextStatus, setNextStatus] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  setIsShowFilter(false)

  const isVerified = useTokenVerification()

  const fetchShops = async (page) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/shop?page=${page}`)
      const { shops, totalPages } = response.data.data
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

  console.log(shops)

  useEffect(() => {
    if (!isVerified) return

    fetchShops(currentPage)
  }, [isVerified, currentPage])

  const handlCensorshipShop = async (shopId, status) => {
    await axiosInstance.patch(`/shop/censorship/${shopId}`, { status })
    fetchShops(currentPage)
  }

  const handleOpenPopup = (shop, status) => {
    setSelectedShop(shop)
    setNextStatus(status)
    setReason('')
    setError('')
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedShop(null)
    setNextStatus('')
    setReason('')
    setError('')
  }

  const handleConfirm = async () => {
    if (
      selectedShop.status === 'ACCEPTED' &&
      nextStatus === 'BANNED' &&
      !reason.trim()
    ) {
      setError('Vui lòng nhập lý do cấm cửa hàng!')
      return
    }
    try {
      await axiosInstance.patch(`/shop/${selectedShop._id}`, {
        status: nextStatus,
        reason: reason.trim(),
      })
      fetchShops(currentPage)
      handleClosePopup()
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  return (
    <>
      <div className="shop-censorship">
        <div className="container">
          <div className="shop-list">
            <div className="shop-list-title">
              <div className="title-text">Danh sách cửa hàng kiểm duyệt</div>
            </div>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : shops.length > 0 ? (
              <>
                {shops.map((shop) => (
                  <div
                    className="shop"
                    key={shop._id}
                    style={{
                      cursor: shop.status !== 'PENDING' ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (shop.status === 'ACCEPTED')
                        handleOpenPopup(shop, 'BANNED')
                      else if (shop.status === 'BANNED')
                        handleOpenPopup(shop, 'ACCEPTED')
                    }}
                  >
                    <div className="shop-image">
                      <img src={shop.imgUrl} alt={shop.name} />
                    </div>
                    <div className="shop-info">
                      <div className="shop-name">{shop.name}</div>
                      <div className="shop-address">{shop.address}</div>
                    </div>
                    {shop.status === 'PENDING' ? (
                      <div className="btn-censorship">
                        <button
                          onClick={() =>
                            handlCensorshipShop(shop._id, 'ACCEPTED')
                          }
                        >
                          Chấp nhận
                        </button>
                        <button
                          onClick={() =>
                            handlCensorshipShop(shop._id, 'REJECTED')
                          }
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <div className={`shop-status ${shop.status}`}>
                        {shopStatusEnum[shop.status]}
                      </div>
                    )}
                  </div>
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
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>
              {nextStatus === 'BANNED'
                ? 'Xác nhận cấm cửa hàng'
                : 'Xác nhận mở cấm cửa hàng'}
            </h3>
            <p>
              Bạn có chắc chắn muốn {nextStatus === 'BANNED' ? 'cấm' : 'mở cấm'}{' '}
              cửa hàng <b>{selectedShop.name}</b>?
            </p>
            {selectedShop.status === 'ACCEPTED' && nextStatus === 'BANNED' && (
              <div>
                <label>
                  Lý do cấm cửa hàng:
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </label>
              </div>
            )}
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                gap: 8,
                justifyContent: 'flex-end',
              }}
            >
              <button onClick={handleClosePopup}>Hủy</button>
              <button
                onClick={handleConfirm}
                style={{ background: '#27ae60', color: '#fff' }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default memo(ShopCensorshipPage)
