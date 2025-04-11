import { memo, useState } from 'react'
import './shopRegistrationPage.scss'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'
import { FaAngleRight } from 'react-icons/fa'

const ShopRegistrationPage = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    address: '',
    avatar: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        avatar: file,
      })
    }
  }

  return (
    <>
      <div className="shop-registration">
        <div className="container">
          <div className="navigation">
            <Link to={routers.SHOP_MANAGEMENT} className="nav-shop-management">
              Quản lý cửa hàng
            </Link>
            <FaAngleRight className="nav-icon" />
            <Link
              to={routers.SHOP_REGISTRATION}
              className="nav-shop-registration"
            >
              Đăng ký cửa hàng
            </Link>
          </div>
          <div className="shop-registration-form">
            <div className="title-text">Thông tin cửa hàng</div>

            <form onSubmit={handleSubmit} className="form-register">
              <div className="form-group">
                <label htmlFor="shopName">Tên cửa hàng</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên cửa hàng"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Ảnh đại diện</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  onChange={handleFileChange} 
                  accept="image/*" 
                  required
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn-submit">
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ShopRegistrationPage)
