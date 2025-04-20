import './profilePage.scss';
import { memo, useState, useEffect } from 'react';
import axiosInstance from 'utils/api';
import { AiOutlineCheck, AiOutlineExclamationCircle, AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineHome } from 'react-icons/ai';

const ProfilePage = ({ userId }) => {
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation rules
  const validateForm = () => {
    const newErrors = {}
    if (!userData.userName.trim())
      newErrors.userName = 'Tên người dùng không được để trống'
    if (!userData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
      newErrors.email = 'Email không hợp lệ'
    if (!userData.phone.match(/^\d{10}$/))
      newErrors.phone = 'Số điện thoại phải là 10 chữ số'
    if (!userData.address.trim())
      newErrors.address = 'Địa chỉ không được để trống'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fetch user data
  const fetchUserData = async () => {
    if (!userId) {
      setErrors({ fetch: 'Không có ID người dùng' })
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const result = await response.json()
      if (result.code === 200) {
        setUserData({
          userName: result.data.userName || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          address: result.data.address || '',
        })
      } else {
        setErrors({ fetch: result.message || 'Không thể tải thông tin' })
      }
    } catch (err) {
      setErrors({ fetch: 'Lỗi kết nối server' })
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const result = await response.json()
      if (result.code === 200) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 2000)
      } else {
        setErrors({ submit: result.message || 'Cập nhật thất bại' })
      }
    } catch (err) {
      setErrors({ submit: 'Có lỗi xảy ra khi cập nhật' })
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  useEffect(() => {
    if (userId) fetchUserData()
  }, [userId])

  return (
    <div className="container profile_page_container">
      <div className="profile_content">
        <div className="profile_header">
          <h2>Cập nhật thông tin cá nhân</h2>
        </div>

        {loading && (
          <div className="loading_container">
            <div className="loading_spinner"></div>
            <span>Đang tải...</span>
          </div>
        )}
        {success && (
          <div className="success_message">
            <AiOutlineCheck /> Cập nhật thành công!
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile_form">
          {/* UserName */}
          <div className="form_group">
            <label>
              Tên người dùng <span className="required">*</span>
            </label>
            <div className="input_wrapper">
              <AiOutlineUser className="input_icon" />
              <input
                type="text"
                name="userName"
                value={userData.userName}
                onChange={handleChange}
                placeholder="Nhập tên người dùng"
                disabled={loading}
              />
            </div>
            {errors.userName && (
              <span className="error_message">
                <AiOutlineExclamationCircle /> {errors.userName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form_group">
            <label>
              Email <span className="required">*</span>
            </label>
            <div className="input_wrapper">
              <AiOutlineMail className="input_icon" />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span className="error_message">
                <AiOutlineExclamationCircle /> {errors.email}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="form_group">
            <label>
              Số điện thoại <span className="required">*</span>
            </label>
            <div className="input_wrapper">
              <AiOutlinePhone className="input_icon" />
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <span className="error_message">
                <AiOutlineExclamationCircle /> {errors.phone}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="form_group">
            <label>
              Địa chỉ <span className="required">*</span>
            </label>
            <div className="input_wrapper">
              <AiOutlineHome className="input_icon" />
              <textarea
                name="address"
                value={userData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                disabled={loading}
              />
            </div>
            {errors.address && (
              <span className="error_message">
                <AiOutlineExclamationCircle /> {errors.address}
              </span>
            )}
          </div>

          {/* sth */}
          <div className="form_group">
            <label>
              Sth <span className="required"></span>
            </label>
            <div className="input_wrapper">
              <textarea
                name="sth"
                value={userData.sth}
                onChange={handleChange}
                placeholder="Nhập sth"
                disabled={loading}
              />
            </div>
            {errors.sth && (
              <span className="error_message">
                <AiOutlineExclamationCircle /> {errors.sth}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit_button" disabled={loading}>
            {loading ? (
              <span className="button_loading">
                <span className="spinner"></span> Đang cập nhật...
              </span>
            ) : (
              'Cập nhật thông tin'
            )}
          </button>

          {errors.submit && (
            <span className="error_message submit_error">
              <AiOutlineExclamationCircle /> {errors.submit}
            </span>
          )}
        </form>
      </div>
    </div>
  )
}

export default memo(ProfilePage)
