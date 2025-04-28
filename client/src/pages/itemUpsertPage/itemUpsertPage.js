import { memo, useEffect, useState } from 'react'
import './itemUpsertPage.scss'
import { Link, useNavigate, useParams } from 'react-router-dom'
import routers from 'utils/routers'
import { FaAngleRight } from 'react-icons/fa'
import axios from 'axios'
import axiosInstance from 'utils/api'
import { itemTypes } from 'utils/enums'

const ItemUpsertPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    type: '',
    quantity: '',
    description: '',
    image: '',
  })
  const { shopId, mode, itemId } = useParams()
  const [shop, setShop] = useState(null)
  const [item, setItem] = useState(null)
  const [loadingShop, setLoadingShop] = useState(true)
  const [loadingItem, setLoadingItem] = useState(true)
  const [preview, setPreview] = useState(null);

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
        setLoadingShop(false)
      })
  }, [shopId])

  useEffect(() => {
    if (!itemId) return;
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/item/${itemId}`);
        const itemData = data.data;
        setItem(itemData);
        setFormData({
          name: itemData.name,
          price: itemData.price,
          description: itemData.description,
          type: itemData.type,
          quantity: itemData.quantity,
        });
        setPreview(itemData.imgUrl);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoadingItem(false);
      }
    };
    fetchItem();
  }, [itemId]);

  if (loadingShop && mode === 'create') {
    return <div className="loading">Đang tải dữ liệu...</div>
  }

  if ((loadingShop || loadingItem) && mode === 'update') {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData);
    const url = mode === 'create' ? 'http://localhost:3000/item' : `http://localhost:3000/item/${itemId}`;
    const method = mode === 'create' ? 'post' : 'patch';
    try {
      await axiosInstance[method](
        url,
        { ...formData, shopId },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      navigate(routers.getMyShopPath(shopId, 'itemList'));
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi gọi api item')
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
            <Link to={routers.getMyShopPath(shopId, 'itemList')} className="nav-my-shop">
              {shop.name}
            </Link>
            <FaAngleRight className="nav-icon" />
            <Link to={routers.SHOP_REGISTRATION} className="nav-item-creation">
              {mode === 'create' ? 'Thêm sản phẩm mới' : 'Cập nhập thông tin sản phẩm'}
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
                  placeholder={item?.name || "Nhập tên sản phẩm"}
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
                  placeholder={item?.price || "Nhập giá"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Loại sản phẩm</label>
                <div className="select-container">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Chọn loại sản phẩm</option>
                    {Object.entries(itemTypes).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Số lượng bán</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder={item?.quantity || "Nhập số lượng bán"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả sản phẩm</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={item?.description || "Nhập mô tả"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Ảnh đại diện</label>
                <label htmlFor="image" className="upload-box">
                  {preview ? (
                    <img src={preview} alt="Preview" className="upload-preview" />
                  ) : (
                    "+"
                  )}
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="upload-input"
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn-submit">
                  {mode === 'create' ? 'Thêm mới' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ItemUpsertPage)
