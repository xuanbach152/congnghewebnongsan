import { memo, useEffect, useState } from 'react'
import './itemCreationPage.scss'
import { Link, useNavigate, useParams } from 'react-router-dom'
import routers from 'utils/routers'
import { FaAngleRight } from 'react-icons/fa'
import axios from 'axios'
import axiosInstance from 'utils/api'

const ItemCreationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    type: '',
    quantity: '',
    description: '',
    image: '',
  })
  const { shopId } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

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

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>
  }

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
    console.log(formData);
    try {
      await axiosInstance.post(
        'http://localhost:3000/item',
        { ...formData, shopId },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      navigate(routers.getMyShopPath(shopId));
    } catch (error) {
      console.error('Lỗi khi đăng ký cửa hàng:', error)
      alert(error.response?.data?.message || 'Đăng ký thất bại')
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
            <Link to={routers.getMyShopPath(shopId)} className="nav-my-shop">
              {shop.name}
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
                <label htmlFor="name">Tên sản phẩm</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
                <label htmlFor="type">Số lượng bán</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Nhập số lượng bán"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Mô tả sản phẩm</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Ảnh sản phẩm</label>
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
                  Thêm mới
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
