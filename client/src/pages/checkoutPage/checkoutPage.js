import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/api';
import './checkoutPage.scss';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems = [] } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' hoặc 'momo'

  const calculateTotal = () =>
    selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!selectedItems.length) {
      setError('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    if (!address) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    try {
      setLoading(true);
      const totalPrice = calculateTotal();
      const cardId = location.state?.cartId;
      await axiosInstance.post('/order/create', {
        items: selectedItems,
        address,
        paymentMethod,
        totalPrice,
      });

      // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
      for(const item of selectedItems) {
        await axiosInstance.delete('/cart/remove', {
          data: { cartId: cardId, itemId: item.itemId._id },
        });
      }
      
      alert('Đặt hàng thành công!');
      navigate('/order/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedItems.length) {
    return <div className="empty">Không có sản phẩm nào được chọn</div>;
  }

  return (
    <div className="checkout-page">
      <h2>Thanh toán</h2>
      {error && <div className="error">{error}</div>}

      <div className="section">
        <h3>Địa chỉ giao hàng</h3>
        <textarea
          className="address-input"
          placeholder="Nhập địa chỉ giao hàng..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
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
            value="momo"
            checked={paymentMethod === 'momo'}
            onChange={() => setPaymentMethod('momo')}
          />
          Chuyển khoản qua ngân hàng
        </label>
      </div>

      <div className="checkout-items">
        {selectedItems.map((item) => (
          <div key={item.itemId._id} className="checkout-item">
            <img src={item.itemId.imgUrl} alt={item.itemId.name} className="item-image" />
            <span className="item-name">{item.itemId.name}</span>
            <span className="item-quantity">x{item.quantity}</span>
            <span className="item-price">{(item.price * item.quantity).toLocaleString()} VNĐ</span>
          </div>
        ))}
      </div>

      <div className="checkout-footer">
        <div className="total-line">
          Tổng cộng ({selectedItems.length} sản phẩm):{' '}
          <strong>{calculateTotal().toLocaleString()} VNĐ</strong>
        </div>
        <button onClick={handleCheckout} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
