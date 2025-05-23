import { memo, useEffect, useState } from 'react';
import './shopUpsertPage.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import routers from 'utils/routers';
import { FaAngleRight } from 'react-icons/fa';
import axiosInstance from 'utils/api';
import axios from 'axios';
import { getLocationSuggestions } from 'utils/mapquestApi';

const ShopUpsertPage = ({ setIsShowFilter }) => {
  const { mode, shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    image: null,
    longitude: '',
    latitude: '',
  });
  const [loading, setLoading] = useState(true)
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationValue, setLocationValue] = useState('');
  setIsShowFilter(false)

  const navigate = useNavigate();

  useEffect(() => {
    if (!shopId) return;
    const fetchShop = async () => {
      try {
        const { data } = await axiosInstance.get(`/shop/${shopId}`);
        const shopData = data.data;
        setShop(shopData);
        setFormData({
          name: shopData.name,
          address: shopData.address,
          description: shopData.description,
        });
        setLocationValue(shopData.address);
        setPreview(shopData.imgUrl);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  if (loading && mode === 'update') {
    return <div className="loading">Đang tải dữ liệu...</div>
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setLocationValue(value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = mode === 'create' ? '/shop' : `/shop/${shopId}`;
    const method = mode === 'create' ? 'post' : 'patch';
    try {
      await axiosInstance[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(routers.SHOP_MANAGEMENT);
    } catch (error) {
      console.error('Error during shop registration:', error);
      alert(error.response?.data?.message || 'Lỗi gọi api shop');
    }
  };

  const handleLocationChange = async (event) => {
    const query = event.target.value;
    setLocationValue(query);
    const response = await getLocationSuggestions(query);
    setLocationSuggestions(response?.data?.results || []);
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: suggestion.displayString,
      longitude: suggestion.place.geometry.coordinates[0],
      latitude: suggestion.place.geometry.coordinates[1],
    }));
    setLocationValue(suggestion.displayString);
    setLocationSuggestions([]);
  };

  return (
    <div className="shop-registration">
      <div className="container">
        <div className="navigation">
          <Link to={routers.SHOP_MANAGEMENT} className="nav-shop-management">
            Quản lý cửa hàng
          </Link>
          {mode === 'update' ? (
            <>
              <FaAngleRight className="nav-icon" />
              <Link to={routers.getMyShopPath(shopId, 'shopInfo')} className="nav-my-shop">
                {shop.name}
              </Link>
            </>
          ) : null}
          <FaAngleRight className="nav-icon" />
          <Link className="nav-shop-registration">{mode === 'create' ? 'Đăng ký cửa hàng' : 'Cập nhật thông tin cửa hàng'}</Link>
        </div>
        <div className="shop-registration-form">
          <div className="title-text">Thông tin cửa hàng</div>

          <form onSubmit={handleSubmit} className="form-register">
            <div className="form-group">
              <label htmlFor="name">Tên cửa hàng</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={shop?.name || "Nhập tên cửa hàng"}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={locationValue}
                onChange={handleInputChange}
                onInput={handleLocationChange}
                placeholder={shop?.address || "Nhập địa chỉ"}
                required
              />
              <ul className="suggestions-list">
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.displayString}
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={shop?.description || "Nhập mô tả"}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Ảnh đại diện</label>
              <label htmlFor="image" className="upload-box">
                {preview ? <img src={preview || null} alt="Preview" className="upload-preview" /> : "+"}
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
                {mode === 'create' ? 'Đăng ký' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(ShopUpsertPage);
