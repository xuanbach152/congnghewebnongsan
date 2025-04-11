import { memo, useState } from 'react'
import './itemCreationPage.scss'
import { Link } from 'react-router-dom'
import routers from 'utils/routers'
import { FaAngleRight } from 'react-icons/fa'

const ItemCreationPage = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    type: '',
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
      <div className="item-creation">
        <div className="container">
          <div className="navigation">
            <Link to={routers.SHOP_MANAGEMENT} className="nav-shop-management">
              Quản lý cửa hàng
            </Link>
            <FaAngleRight className="nav-icon" />
            <Link to={routers.SHOP_REGISTRATION} className="nav-item-creation">
              Thêm sản phẩm mới
            </Link>
          </div>
          <div className="item-creation-form">
            <div className="title-text">Thông tin sản phẩm</div>

            <form onSubmit={handleSubmit} className="form-register">
              <div className="form-group">
                <label htmlFor="itemName">Tên sản phẩm</label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Giá sản phẩm</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Loại sản phẩm</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Nhập loại sản phẩm"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Ảnh sản phẩm</label>
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

export default memo(ItemCreationPage)
