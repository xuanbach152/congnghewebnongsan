import { memo, useState, useEffect } from 'react'
import axiosInstance from 'utils/api'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import './profilePage.scss'
import { toast } from 'react-toastify'

const ProfilePage = ({ setIsShowFilter }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [userId, setUserId] = useState(null)
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    avatar: '',
    address: '',
    bankInfo: { bankName: '', accountNumber: '' },
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [newAddress, setNewAddress] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [previewAvatar, setPreviewAvatar] = useState(null)
  const [isEditing, setIsEditing] = useState({
    profile: false,
    bank: false,
    address: false,
  })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  setIsShowFilter(false)

  // Fetch user data
  const fetchUserData = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/user/${userId}`)
      if (response.data.code === 200) {
        const data = response.data.data
        setUserData({
          userName: data.userName || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          birthday: data.birthday
            ? new Date(data.birthday).toISOString().split('T')[0]
            : '',
          avatar: data.avatar || data.imgUrl || '',
          address: data.address || '',
          bankInfo: {
            bankName: data.bankName || '',
            accountNumber: data.bankAccount || '',
          },
        })
        setPreviewAvatar(data.avatar || data.imgUrl || '')
        setErrors({})
      } else {
        toast.error(response.data.message || 'Không thể tải thông tin')
      }
    } catch (err) {
      toast.error(err.message || 'Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {}
    if (!userData.email) newErrors.email = 'Vui lòng nhập email'
    else if (!userData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = 'Email không hợp lệ'
    if (!userData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại'
    else if (!userData.phone.match(/^\d{10}$/))
      newErrors.phone = 'Số điện thoại phải là 10 chữ số'
    if (!userData.gender) newErrors.gender = 'Vui lòng chọn giới tính'
    if (!userData.birthday) newErrors.birthday = 'Vui lòng chọn ngày sinh'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate password change form
  const validatePasswordForm = () => {
    const newErrors = {}
    if (!passwordData.currentPassword)
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    if (!passwordData.newPassword)
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
    else if (passwordData.newPassword.length < 8)
      newErrors.newPassword = 'Mật khẩu mới phải dài ít nhất 8 ký tự'
    else if (
      !passwordData.newPassword.match(/[A-Z]/) ||
      !passwordData.newPassword.match(/[0-9]/)
    )
      newErrors.newPassword =
        'Mật khẩu mới phải chứa ít nhất 1 chữ cái in hoa và 1 số'
    if (passwordData.newPassword !== passwordData.confirmPassword)
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate bank form
  const validateBankForm = () => {
    const newErrors = {}
    if (!userData.bankInfo.bankName)
      newErrors.bankName = 'Vui lòng chọn ngân hàng'
    if (!userData.bankInfo.accountNumber)
      newErrors.accountNumber = 'Vui lòng nhập số tài khoản'
    else if (!userData.bankInfo.accountNumber.match(/^\d{10,16}$/))
      newErrors.accountNumber = 'Số tài khoản phải từ 10-16 chữ số'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate address form
  const validateAddressForm = () => {
    const newErrors = {}
    if (!newAddress.trim()) {
      newErrors.newAddress = 'Địa chỉ không được để trống'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!validateProfileForm()) return

    setLoading(true)
    try {
      const updateData = {
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        birthday: userData.birthday || null,
      }
      const response = await axiosInstance.patch(`/user/${userId}`, updateData)
      if (response.data.code === 200) {
        toast.success('Cập nhật hồ sơ thành công!')
        setIsEditing({ ...isEditing, profile: false })
        await fetchUserData()
      } else {
        toast.error(response.data.message || 'Cập nhật thất bại')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật')
    } finally {
      setLoading(false)
    }
  }

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!validatePasswordForm()) return

    setLoading(true)
    try {
      const response = await axiosInstance.patch(`/user/${userId}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      if (response.data.code === 200) {
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
        localStorage.removeItem('accessToken')
        setTimeout(() => {
          setSuccess(false)
          navigate('/')
        }, 2000)
      } else {
        toast.error(response.data.message || 'Đổi mật khẩu thất bại')
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
      )
    } finally {
      setLoading(false)
    }
  }

  // Handle bank info submission
  const handleBankSubmit = async (e) => {
    e.preventDefault()
    if (!validateBankForm()) return

    setLoading(true)
    try {
      const updateData = {
        bankName: userData.bankInfo.bankName,
        bankAccount: userData.bankInfo.accountNumber,
      }
      const response = await axiosInstance.patch(`/user/${userId}`, updateData)
      if (response.data.code === 200) {
        toast.success('Liên kết ngân hàng thành công!')
        setIsEditing({ ...isEditing, bank: false })
        await fetchUserData()
      } else {
        toast.error(response.data.message || 'Liên kết ngân hàng thất bại')
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Có lỗi xảy ra khi liên kết ngân hàng'
      )
    } finally {
      setLoading(false)
    }
  }

  // Handle address submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault()
    if (!validateAddressForm()) return

    setLoading(true)
    try {
      const updateData = {
        address: newAddress,
      }
      const response = await axiosInstance.patch(`/user/${userId}`, updateData)
      if (response.data.code === 200) {
        toast.success('Cập nhật địa chỉ thành công!')
        setNewAddress('')
        setIsEditing({ ...isEditing, address: false })
        await fetchUserData()
      } else {
        toast.error(response.data.message || 'Cập nhật địa chỉ thất bại')
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ'
      )
    } finally {
      setLoading(false)
    }
  }

  // Handle avatar change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Tạo preview trước khi upload
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewAvatar(reader.result) // Hiển thị preview ngay lập tức
      }
      reader.readAsDataURL(file)

      // Tạo FormData và upload
      const formData = new FormData()
      formData.append('image', file)

      setLoading(true)
      setUploadingAvatar(true)
      try {
        const response = await axiosInstance.patch(
          `/user/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        if (response.data.code === 200) {
          const imgUrl = response.data.data?.imgUrl || response.data.data
          setUserData({ ...userData, avatar: imgUrl })
          toast.success('Cập nhật ảnh đại diện thành công!')
          await fetchUserData()
        } else {
          toast.error(response.data.message || 'Tải ảnh lên thất bại')
          // Nếu thất bại, quay lại ảnh cũ
          setPreviewAvatar(userData.avatar)
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh lên'
        )
        // Nếu thất bại, quay lại ảnh cũ
        setPreviewAvatar(userData.avatar)
      } finally {
        setLoading(false)
        setUploadingAvatar(false)
      }
    }
  }
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleBankChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      bankInfo: { ...userData.bankInfo, [name]: value },
    })
    setErrors({ ...errors, [name]: '' })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({ ...passwordData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast.error('Vui lòng đăng nhập để truy cập trang này')
      navigate('/login')
      return
    }
    try {
      const decodedToken = jwtDecode(token)
      setUserId(decodedToken.id)
    } catch (err) {
      toast.error('Token không hợp lệ, vui lòng đăng nhập lại')
      localStorage.removeItem('accessToken')
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  return (
    <div className="profile_container">
      <div className="sidebar">
        <div className="sidebar_user">
          <img
            src={previewAvatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt="Avatar"
            className="sidebar_avatar"
          />
        </div>
        <div className="menu_header">Tài Khoản Của Tôi</div>
        <ul className="sidebar_menu">
          <li
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Hồ Sơ
          </li>
          <li
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            Đổi Mật Khẩu
          </li>
          <li
            className={activeTab === 'bank' ? 'active' : ''}
            onClick={() => setActiveTab('bank')}
          >
            Ngân Hàng
          </li>
          <li
            className={activeTab === 'address' ? 'active' : ''}
            onClick={() => setActiveTab('address')}
          >
            Địa Chỉ
          </li>
        </ul>
      </div>

      <div className="profile_content">
        {activeTab === 'profile' && (
          <>
            <h2>Hồ Sơ Của Tôi</h2>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

            {success && (
              <div className="success_message">Cập nhật thành công!</div>
            )}
            {errors.fetch && (
              <div className="error_message">{errors.fetch}</div>
            )}

            <div className="profile_main">
              <form onSubmit={handleProfileSubmit} className="profile_form">
                <div className="form_row">
                  <label>Tên đăng nhập</label>
                  <input
                    type="text"
                    name="userName"
                    value={userData.userName}
                    readOnly
                    className="readonly_input"
                    disabled={loading}
                  />
                  {errors.userName && (
                    <span className="error_message">{errors.userName}</span>
                  )}
                </div>

                <div className="form_row">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email || ''}
                    onChange={handleChange}
                    readOnly={!isEditing.profile}
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className="error_message">{errors.email}</span>
                  )}
                </div>

                <div className="form_row">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone || ''}
                    onChange={handleChange}
                    readOnly={!isEditing.profile}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <span className="error_message">{errors.phone}</span>
                  )}
                </div>

                <div className="form_row">
                  <label>Giới tính</label>
                  <div className="gender_options">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={userData.gender === 'Nam'}
                        onChange={handleChange}
                        disabled={loading || !isEditing.profile}
                      />
                      Nam
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={userData.gender === 'Nữ'}
                        onChange={handleChange}
                        disabled={loading || !isEditing.profile}
                      />
                      Nữ
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Khác"
                        checked={userData.gender === 'Khác'}
                        onChange={handleChange}
                        disabled={loading || !isEditing.profile}
                      />
                      Khác
                    </label>
                  </div>
                  {errors.gender && (
                    <span className="error_message">{errors.gender}</span>
                  )}
                </div>

                <div className="form_row">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="birthday"
                    value={userData.birthday || ''}
                    onChange={handleChange}
                    readOnly={!isEditing.profile}
                    disabled={loading}
                  />
                  {errors.birthday && (
                    <span className="error_message">{errors.birthday}</span>
                  )}
                </div>

                <div className="form_buttons">
                  <button
                    type="button"
                    className="edit_button"
                    onClick={() =>
                      setIsEditing({
                        ...isEditing,
                        profile: !isEditing.profile,
                      })
                    }
                    disabled={loading}
                  >
                    {isEditing.profile ? 'Hủy' : 'Sửa'}
                  </button>
                  {isEditing.profile && (
                    <button
                      type="submit"
                      className="submit_button"
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  )}
                </div>
                {errors.submit && (
                  <span className="error_message">{errors.submit}</span>
                )}
              </form>

              <div className="avatar_section">
                <h3>Ảnh đại diện</h3>
                <label htmlFor="avatar-upload" className="upload-box">
                  {previewAvatar ? (
                    <>
                      <img
                        src={previewAvatar}
                        alt="Avatar"
                        className="upload-preview"
                      />
                      {uploadingAvatar && (
                        <div className="upload-loading">Đang tải...</div>
                      )}
                    </>
                  ) : (
                    <div className="upload-placeholder">+</div>
                  )}
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={loading || !isEditing.profile}
                  className="upload-input"
                />
                {errors.avatar && (
                  <span className="error_message">{errors.avatar}</span>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'password' && (
          <>
            <h2>Đổi Mật Khẩu</h2>
            <p>
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
              khác
            </p>

            {success && (
              <div className="success_message">Đổi mật khẩu thành công!</div>
            )}

            <form onSubmit={handlePasswordSubmit} className="profile_form">
              <div className="form_row">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {errors.currentPassword && (
                  <span className="error_message">
                    {errors.currentPassword}
                  </span>
                )}
              </div>

              <div className="form_row">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {errors.newPassword && (
                  <span className="error_message">{errors.newPassword}</span>
                )}
              </div>

              <div className="form_row">
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <span className="error_message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
              <div className="form_buttons">
                <button
                  type="submit"
                  className="submit_button"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
              {errors.submit && (
                <span className="error_message">{errors.submit}</span>
              )}
            </form>
          </>
        )}

        {activeTab === 'bank' && (
          <>
            <h2>Ngân Hàng</h2>
            <p>Quản lý thông tin tài khoản ngân hàng để thanh toán</p>

            {success && (
              <div className="success_message">
                Liên kết ngân hàng thành công!
              </div>
            )}

            <form onSubmit={handleBankSubmit} className="profile_form">
              <div className="form_row">
                <label>Tên ngân hàng</label>
                <select
                  name="bankName"
                  value={userData.bankInfo.bankName || ''}
                  onChange={handleBankChange}
                  disabled={loading || !isEditing.bank}
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="MB Bank">MB Bank</option>
                  <option value="VP Bank">VP Bank</option>
                </select>
                {errors.bankName && (
                  <span className="error_message">{errors.bankName}</span>
                )}
              </div>

              <div className="form_row">
                <label>Số tài khoản</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={userData.bankInfo.accountNumber || ''}
                  onChange={handleBankChange}
                  readOnly={!isEditing.bank}
                  disabled={loading}
                />
                {errors.accountNumber && (
                  <span className="error_message">{errors.accountNumber}</span>
                )}
              </div>

              <div className="form_buttons">
                <button
                  type="button"
                  className="edit_button"
                  onClick={() =>
                    setIsEditing({ ...isEditing, bank: !isEditing.bank })
                  }
                  disabled={loading}
                >
                  {isEditing.bank ? 'Hủy' : 'Sửa'}
                </button>
                {isEditing.bank && (
                  <button
                    type="submit"
                    className="submit_button"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                  </button>
                )}
              </div>
              {errors.submit && (
                <span className="error_message">{errors.submit}</span>
              )}
            </form>
          </>
        )}

        {activeTab === 'address' && (
          <>
            <h2>Địa Chỉ</h2>
            <p>Quản lý địa chỉ giao hàng mặc định</p>

            {success && (
              <div className="success_message">
                Cập nhật địa chỉ thành công!
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="profile_form">
              <div className="form_row">
                <label>Địa chỉ giao hàng mặc định</label>
                <textarea
                  name="newAddress"
                  value={
                    isEditing.address ? newAddress : userData.address || ''
                  }
                  onChange={(e) => {
                    setNewAddress(e.target.value)
                    setErrors({ ...errors, newAddress: '' })
                  }}
                  readOnly={!isEditing.address}
                  disabled={loading}
                />
                {errors.newAddress && (
                  <span className="error_message">{errors.newAddress}</span>
                )}
              </div>

              <div className="form_buttons">
                <button
                  type="button"
                  className="edit_button"
                  onClick={() => {
                    setIsEditing({ ...isEditing, address: !isEditing.address })
                    if (!isEditing.address) setNewAddress(userData.address)
                  }}
                  disabled={loading}
                >
                  {isEditing.address ? 'Hủy' : 'Sửa'}
                </button>
                {isEditing.address && (
                  <button
                    type="submit"
                    className="submit_button"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                  </button>
                )}
              </div>
              {errors.submit && (
                <span className="error_message">{errors.submit}</span>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default memo(ProfilePage)
