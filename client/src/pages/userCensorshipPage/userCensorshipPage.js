import { memo, useEffect, useState } from 'react'
import './userCensorshipPage.scss'
import Pagination from 'layouts/pagination/pagination'
import { default as axiosInstance } from 'utils/api'
import { useTokenVerification } from 'utils/tokenVerification'
import { userStatusEnum } from 'utils/enums'

const UserCensorshipPage = ({ setIsShowFilter }) => {
  const [users, setUsers] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [nextStatus, setNextStatus] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  setIsShowFilter(false)

  const isVerified = useTokenVerification()

  const fetchUsers = async (page) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/user?page=${page}`)
      const { users, totalPages } = response.data.data
      setTotalPages(totalPages)
      setUsers(users)
    } catch (error) {
      console.error(
        'Error fetching user data:',
        error.response?.data || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isVerified) return
    fetchUsers(currentPage)
  }, [isVerified, currentPage])

  const handleOpenPopup = (user, status) => {
    setSelectedUser(user)
    setNextStatus(status)
    setReason('')
    setError('')
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedUser(null)
    setNextStatus('')
    setReason('')
    setError('')
  }

  const handleConfirm = async () => {
    if (
      selectedUser.status === 'ACTIVE' &&
      nextStatus === 'BANNED' &&
      !reason.trim()
    ) {
      setError('Vui lòng nhập lý do khóa tài khoản!')
      return
    }
    try {
      await axiosInstance.patch(`/user/${selectedUser._id}`, {
        status: nextStatus,
        reason: reason.trim(),
      })
      fetchUsers(currentPage)
      handleClosePopup()
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại!')
    }
  }

  return (
    <>
      <div className="user-censorship">
        <div className="container">
          <div className="user-list">
            <div className="user-list-title">
              <div className="title-text">Danh sách người dùng trang web</div>
            </div>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : users.length > 0 ? (
              <>
                {users.map((user) => (
                  <div
                    className="user"
                    key={user._id}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      handleOpenPopup(
                        user,
                        user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE'
                      )
                    }
                  >
                    <div className="user-image">
                      <img
                        src={
                          user.imgUrl ||
                          'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                        }
                        alt={user.userName}
                      />
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.userName}</div>
                      <div className="user-address">{user.address}</div>
                    </div>
                    <div className={`user-status ${user.status}`}>
                      {userStatusEnum[user.status]}
                    </div>
                    {/* Xóa phần user-action button */}
                  </div>
                ))}
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <p>Hiện chưa có người dùng nào</p>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>
              {nextStatus === 'BANNED'
                ? 'Xác nhận khóa tài khoản'
                : 'Xác nhận mở khóa tài khoản'}
            </h3>
            <p>
              Bạn có chắc chắn muốn{' '}
              {nextStatus === 'BANNED' ? 'khóa' : 'mở khóa'} tài khoản{' '}
              <b>{selectedUser.userName}</b>?
            </p>
            {selectedUser.status === 'ACTIVE' && nextStatus === 'BANNED' && (
              <div>
                <label>
                  Lý do khóa tài khoản:
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

export default memo(UserCensorshipPage)
