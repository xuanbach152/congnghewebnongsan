import { memo, useEffect, useState } from 'react';
import './shopUpsertPage.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import routers from 'utils/routers';
import { FaAngleRight } from 'react-icons/fa';
import axiosInstance from 'utils/api';
import axios from 'axios';

const ShopUpsertPage = () => {
  const { mode, shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {
    if (!shopId) return;
    const fetchShop = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/shop/${shopId}`);
        const shopData = data.data;
        setShop(shopData);
        setFormData({
          name: shopData.name,
          address: shopData.address,
          description: shopData.description,
        });
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

    const url = mode === 'create' ? 'http://localhost:3000/shop' : `http://localhost:3000/shop/${shopId}`;
    const method = mode === 'create' ? 'post' : 'patch';
    console.log(formData);
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
          <Link className="nav-shop-registration">{ mode === 'create' ? 'Đăng ký cửa hàng' : 'Cập nhật thông tin cửa hàng' }</Link>
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
                value={formData.address}
                onChange={handleInputChange}
                placeholder={shop?.address || "Nhập địa chỉ"}
                required
              />
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
