import { memo, useState } from 'react'
import './shopRegistrationPage.scss'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'
import { FaAngleRight } from 'react-icons/fa'
import axiosInstance from 'utils/api'

const ShopRegistrationPage = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    image: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const form = new FormData()
      form.append('name', formData.shopName);
      form.append('address', formData.address);
      form.append('image', formData.image);
      for (let [key, value] of form.entries()) {
        console.log(`${key}:`, value);
      }
      
      console.log(formData.shopName);
      console.log(form);
      const response = await axiosInstance.post('http://localhost:3000/shop', form);
    } catch (error) {
      console.error('Lỗi khi đăng ký cửa hàng:', error)
      alert(error.response?.data?.message || 'Đăng ký thất bại')
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
            <Link className="nav-shop-registration">Đăng ký cửa hàng</Link>
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
                <label htmlFor="image">Ảnh đại diện</label>
                <input
                  type="file"
                  id="image"
                  name="image"
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
