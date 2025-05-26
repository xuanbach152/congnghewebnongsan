import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/api';
import { toast } from 'react-toastify';
import './checkoutPage.scss';
import { getLocationSuggestions } from 'utils/mapquestApi';

const CheckoutItem = ({ item }) => (
  <div className="checkout-item">
    <div className="item-info">
      {item.imgUrl && (
        <img src={item.imgUrl} alt={item.name} className="item-image" />
      )}
      <span className="item-name">{' '}{item.name}</span>
    </div>
    <span className="item-price">{item.price.toLocaleString()} VNĐ</span>
    <span className="item-quantity">x{item.quantity}</span>
    <span className="item-total">
      {(item.price * item.quantity).toLocaleString()} VNĐ
    </span>
  </div>
);

const ShopGroup = ({ group, deliveryFee }) => (
  <div className="shop-section">
    <h3 style={{ cursor: 'pointer', color: '#0dac02' }}>
      {group.shopName || `Shop ${group.shopId}`}
    </h3>
    {group.cartItems.map(item => (
      <CheckoutItem key={item.id} item={item} />
    ))}
    <div className="shop-subtotal">
      <span>Tạm tính: {group.subtotal.toLocaleString()} VNĐ</span>
      <span>Phí vận chuyển: {(deliveryFee || 0).toLocaleString()} VNĐ</span>
      <span>Tổng cộng: {(group.subtotal + (deliveryFee || 0)).toLocaleString()} VNĐ</span>
    </div>
  </div>
);

const CheckoutPage = ({ setIsShowFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems = [], cartId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shopGroups, setShopGroups] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState({});
  const [userId, setUserId] = useState('');
  setIsShowFilter(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.id);
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  const normalizeItem = (item) => {
    if (!item || !item.itemId) {
      console.warn('Invalid item in CheckoutPage, skipping:', item);
      return null;
    }
    return {
      id: item._id || item.itemId._id || '',
      name: item.itemId.name || 'Unknown Item',
      price: item.price || 0,
      quantity: item.quantity || 1,
      imgUrl: item.itemId.imgUrl || '',
      shopId: item.itemId.shopId || '',
    };
  };

  useEffect(() => {
    const groupItemsByShop = async () => {
      setLoading(true);
      try {
        const normalizedItems = selectedItems
          .map(normalizeItem)
          .filter(item => item && item.shopId && item.id);

        const grouped = normalizedItems.reduce((acc, item) => {
          const shopId = item.shopId;
          if (!acc[shopId]) {
            acc[shopId] = {
              shopId,
              cartItems: [],
              shopName: '',
              subtotal: 0,
            };
          }
          acc[shopId].cartItems.push(item);
          acc[shopId].subtotal += item.price * item.quantity;
          return acc;
        }, {});

        const shopGroupsWithName = await Promise.all(
          Object.values(grouped).map(async (group) => {
            try {
              const shopResponse = await axiosInstance.get(`/shop/${group.shopId}`);
              console.log(`Shop ${group.shopId} response:`, shopResponse.data);
              return { ...group, shopName: shopResponse.data.data.name || `Shop ${group.shopId}` };
            } catch (err) {
              console.error(`Failed to fetch shop ${group.shopId}:`, err.response?.data || err.message);
              return { ...group, shopName: `Shop ${group.shopId}` };
            }
          })
        );

        setShopGroups(shopGroupsWithName);
      } catch (err) {
        toast.error('Không thể tải thông tin đơn hàng');
        console.error('Error in groupItemsByShop:', err.response?.data || err.message);
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    if (selectedItems.length > 0) {
      groupItemsByShop();
    }
  }, [selectedItems, navigate]);

  useEffect(() => {
    const fetchDeliveryFees = async () => {
      if (!address || !shopGroups.length) return;
      if (!userId) return;
      try {
        const fees = {};
        const response = await axiosInstance.post('/cart/calculate', { deliveryAddress: address });
        const shopGr = response.data.data.shopGroup || [];
        console.log('Delivery fees response:', shopGr);
        shopGr.forEach(group => {
          fees[group.shopId._id] = group.deliveryFee || 0;
        })
        setDeliveryFees(fees);
      } catch (err) {
        toast.error('Lỗi khi tính phí vận chuyển');
        console.error('Error in fetchDeliveryFees:', err.response?.data || err.message);
      }
    };

    fetchDeliveryFees();
  }, [userId, address, shopGroups.length]);

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocationValue(query);
    const response = await getLocationSuggestions(query);
    setLocationSuggestions(response?.data?.results || []);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocationValue(suggestion.displayString);
    setLocationSuggestions([]);
    setAddress({
      address: suggestion.displayString,
      longitude: suggestion.place.geometry?.coordinates[0],
      latitude: suggestion.place.geometry?.coordinates[1],
    });
  };

  const calculateSubtotal = useMemo(
    () => shopGroups.reduce((total, group) => total + group.subtotal, 0),
    [shopGroups]
  );

  const calculateTotalDeliveryFee = useMemo(
    () => Object.values(deliveryFees).reduce((sum, fee) => sum + fee, 0),
    [deliveryFees]
  );

  const calculateTotal = useMemo(
    () => calculateSubtotal + calculateTotalDeliveryFee,
    [calculateSubtotal, calculateTotalDeliveryFee]
  );

  const handleCheckout = async () => {
    if (!locationValue.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    if (!address || typeof address !== 'object' || !address.address || !address.longitude || !address.latitude) {
      toast.error('Vui lòng chọn một địa chỉ hợp lệ từ danh sách gợi ý');
      return;
    }

    try {
      setLoading(true);

      const paymentMethodMap = {
        cod: 'CASH',
        bank: 'BANK_TRANSFER',
      };
      const orderData = {
        deliveryAddress: address,
        paymentMethod: paymentMethodMap[paymentMethod],
        deliveryType: 'EXPRESS',
      };
      await axiosInstance.post('/order', orderData);


      if (cartId && selectedItems.length > 0) {
        await axiosInstance.delete('/cart/clear', {
          data: {
            cartId,
            items: selectedItems.map(item => item.itemId._id),
          },
        }).catch(err => {
          toast.warn('Không thể xóa giỏ hàng, nhưng đơn hàng đã được tạo.');
        });
      }

      toast.success('Đặt hàng thành công! Chuyển hướng đến Lịch sử đơn hàng...');
      window.location.href = '/order/history';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể đặt hàng');
      console.error('Error in handleCheckout:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Thanh toán</h2>

      <div className="section">
        <h3>Địa chỉ giao hàng</h3>
        <textarea
          className="address-input"
          placeholder="Nhập địa chỉ giao hàng..."
          value={locationValue}
          onChange={handleLocationChange}
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

      <div className="section">
        <h3>Phương thức thanh toán</h3>
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => setPaymentMethod('cod')}
          />
          Thanh toán khi nhận hàng (COD)
        </label>
        <label>
          <input
            type="radio"
            value="bank"
            checked={paymentMethod === 'bank'}
            onChange={() => setPaymentMethod('bank')}
          />
          Chuyển khoản ngân hàng
        </label>
      </div>

      <div className="checkout-items">
        <div className="checkout-header">
          <span>Sản phẩm</span>
          <span>Đơn giá</span>
          <span>Số lượng</span>
          <span>Thành tiền</span>
        </div>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : shopGroups.length === 0 ? (
          <div className="empty-message"></div>
        ) : (
          shopGroups.map(group => (
            <ShopGroup
              key={group.shopId}
              group={group}
              deliveryFee={deliveryFees[group.shopId]}
            />
          ))
        )}
      </div>

      <div className="checkout-footer">
        <div className="total-line">
          <div>
            Tổng sản phẩm ({selectedItems.length}):{' '}
            {calculateSubtotal.toLocaleString()} VNĐ
          </div>
          <div>
            Tổng phí vận chuyển: {calculateTotalDeliveryFee.toLocaleString()} VNĐ
          </div>
          <div>
            Tổng thanh toán:{' '}
            <strong>{calculateTotal.toLocaleString()} VNĐ</strong>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading || !locationValue.trim() || shopGroups.length === 0}
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;