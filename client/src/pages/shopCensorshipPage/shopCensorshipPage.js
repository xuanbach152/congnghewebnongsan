import { memo, useEffect, useState } from 'react'
import './shopCensorshipPage.scss'
import Pagination from 'layouts/pagination/pagination'
import { default as axiosInstance } from 'utils/api'
import { useTokenVerification } from 'utils/tokenVerification'
import { shopStatusEnum } from 'utils/enums'

const ShopCensorshipPage = () => {
  const [shops, setShops] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const isVerified = useTokenVerification()

  const fetchShops = async (page) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(
        `/shop?page=${page}`
      )
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

  console.log(shops);

  useEffect(() => {
    if (!isVerified) return

    fetchShops(currentPage)
  }, [isVerified, currentPage])

  const handlCensorshipShop = async (shopId, status) => {
    await axiosInstance.patch(
      `/shop/censorship/${shopId}`,
      { status }
    )
    fetchShops(currentPage);
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
                  <div className="shop">
                    <div className="shop-image">
                      <img src={shop.imgUrl} alt={shop.name} />
                    </div>
                    <div className="shop-info">
                      <div className="shop-name">{shop.name}</div>
                      <div className="shop-address">{shop.address}</div>
                    </div>
                    {shop.status !== 'PENDING' ? (
                      <div className={`shop-status ${shop.status}`}>
                        {shopStatusEnum[shop.status]}
                      </div>
                    ) : (
                      <div className="btn-censorship">
                        <button onClick={() => handlCensorshipShop(shop._id, 'ACCEPTED')}>Chấp nhận</button>
                        <button onClick={() => handlCensorshipShop(shop._id, 'REJECTED')}>Từ chối</button>
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
    </>
  )
}

export default memo(ShopCensorshipPage)
