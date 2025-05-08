import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/api';
import { toast } from 'react-toastify';
import './checkoutPage.scss';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems = [], cartId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const calculateTotal = () =>
    selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      const paymentMethodMap = {
        cod: 'CASH',
        bank: 'BANK_TRANSFER'
      };

      const deliveryType = 'EXPRESS';

      await axiosInstance.post('/order', {
        deliveryAddress: address,
        paymentMethod: paymentMethodMap[paymentMethod],
        deliveryType: deliveryType
      });

      if (cartId && selectedItems.length > 0) {
        await axiosInstance.delete('/cart/remove', {
          data: { cartId, items: selectedItems.map(item => item.itemId._id) }
        }).catch(err => {
          console.error('Error removing cart items:', err.response?.data || err.message);
          toast.warn('Không thể xóa giỏ hàng, nhưng đơn hàng đã được tạo.', {
            position: "top-center",
            autoClose: 3000,
          });
        });
      }

      toast.success('Đặt hàng thành công! Chuyển hướng đến Lịch sử đơn hàng...', {
        position: "top-center",
        autoClose: 2000,
      });

      navigate('/order/history');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.', {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedItems.length) {
    toast.info('Không có sản phẩm nào được chọn', {
      position: "top-center",
      autoClose: 3000,
    });
    return <div className="empty">Không có sản phẩm nào được chọn</div>;
  }

  return (
    <div className="checkout-page">
      <h2>Thanh toán</h2>

      <div className="section">
        <h3>Địa chỉ giao hàng</h3>
        <textarea
          className="address-input"
          placeholder="Nhập địa chỉ giao hàng..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
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
            value="bank"
            checked={paymentMethod === 'bank'}
            onChange={() => setPaymentMethod('bank')}
          />
          Chuyển khoản ngân hàng
        </label>
      </div>

      <div className="checkout-items">
        {selectedItems.map((item) => (
          <div key={item.itemId._id} className="checkout-item">
            {item.itemId.imgUrl ? (
              <img src={item.itemId.imgUrl} alt={item.itemId.name} className="item-image" />
            ) : null}
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
        <button onClick={handleCheckout} disabled={loading || !address.trim()}>
          {loading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;