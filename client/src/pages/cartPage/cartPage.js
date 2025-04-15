import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/api';
import './cartPage.scss';
import { memo } from 'react';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // Lưu danh sách itemId được chọn

  // Lấy giỏ hàng của người dùng
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cart/getcart');
      setCart(response.data.data);
      setError(null);
      setSelectedItems(response.data.data.cartItems.map(item => item.itemId._id));
    } catch (err) {
      if (err.response?.data?.message === 'Cart not found') {
        setCart({ cartItems: [], _id: null }); // Giỏ hàng rỗng
        setSelectedItems([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch cart');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateCartItem = async (itemId, quantity) => {
    if (quantity < 1) return; // Ngăn số lượng < 1
    try {
      const response = await axiosInstance.put('/cart/update', {
        cartId: cart._id,
        itemId,
        quantity,
      });
      setCart(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart item');
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeCartItem = async (itemId) => {
    try {
      const response = await axiosInstance.delete('/cart/remove', {
        data: { cartId: cart._id, itemId },
      });
      setCart(response.data.data);
      setSelectedItems(selectedItems.filter(id => id !== itemId)); // Bỏ chọn item đã xóa
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove cart item');
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      const response = await axiosInstance.delete('/cart/clear', {
        data: { cartId: cart._id },
      });
      setCart(response.data.data);
      setSelectedItems([]); // Xóa danh sách chọn
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  // Toggle chọn/bỏ chọn sản phẩm
  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Chọn hoặc bỏ chọn tất cả sản phẩm
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.cartItems.length) {
      setSelectedItems([]); // Bỏ chọn tất cả
    } else {
      setSelectedItems(cart.cartItems.map(item => item.itemId._id)); // Chọn tất cả
    }
  };

  // Tính tổng tiền của các sản phẩm được chọn
  const calculateSelectedTotal = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems
      .filter(item => selectedItems.includes(item.itemId._id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Tải giỏ hàng khi component được mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if(!token) {
      setError('Vui lòng đăng nhập để xem giỏ hàng');
      return;
    }
    fetchCart();
  }, []);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cart || !cart.cartItems?.length) return <div className="empty">Giỏ hàng rỗng</div>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <input
          type="checkbox"
          checked={selectedItems.length === cart.cartItems.length && cart.cartItems.length > 0}
          onChange={toggleSelectAll}
        />
        <span>Sản phẩm</span>
        <span>Đơn giá</span>
        <span>Số lượng</span>
        <span>Thành tiền</span>
        <span>Thao tác</span>
      </div>
      <div className="cart-items">
        {cart.cartItems.map((item) => (
          <div key={item.itemId._id} className="cart-item">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.itemId._id)}
              onChange={() => toggleSelectItem(item.itemId._id)}
            />
            <div className="item-info">
              <img
                src={item.itemId.imgUrl}
                alt={item.itemId.name}
                className="item-image"
              />
              <span className="item-name">{item.itemId.name}</span>
            </div>
            <span className="item-price">{item.price.toLocaleString()} VNĐ</span>
            <div className="quantity-control">
              <button
                onClick={() => updateCartItem(item.itemId._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateCartItem(item.itemId._id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <span className="item-total">
              {(item.price * item.quantity).toLocaleString()} VNĐ
            </span>
            <button
              className="remove-button"
              onClick={() => removeCartItem(item.itemId._id)}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="footer-left">
          <input
            type="checkbox"
            checked={selectedItems.length === cart.cartItems.length && cart.cartItems.length > 0}
            onChange={toggleSelectAll}
          />
          <span>Chọn tất cả ({cart.cartItems.length})</span>
          <button className="clear-cart" onClick={clearCart}>
            Xóa tất cả
          </button>
        </div>
        <div className="footer-right">
          <span>
            Tổng thanh toán ({selectedItems.length} sản phẩm):{' '}
            <strong>{calculateSelectedTotal().toLocaleString()} VNĐ</strong>
          </span>
          <button className="checkout-button" disabled={selectedItems.length === 0}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CartPage);