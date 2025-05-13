import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/api';
import './cartPage.scss';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cart/getcart');
      const cartData = response.data.data;

      // Lấy thông tin shop cho từng shopId trong shopGroup
      const updatedShopGroup = await Promise.all(
        cartData.shopGroup.map(async (group) => {
          const shopResponse = await axiosInstance.get(`/shop/${group.shopId}`);
          return {
            ...group,
            shopName: shopResponse.data.data.name,
          };
        })
      );

      // Cập nhật cart với thông tin shop 
      setCart({
        ...cartData,
        shopGroup: updatedShopGroup,
      });

      setError(null);
      setSelectedItems(updatedShopGroup.flatMap(group => group.cartItems.map(item => item._id || item.itemId._id)));
    } catch (err) {
      if (err.response?.data?.message === 'Cart not found') {
        setCart({ shopGroup: [], _id: null, totalPaymentAmount: 0 });
        setSelectedItems([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart((prevCart) => {
      const updatedShopGroup = prevCart.shopGroup.map((group) => ({
        ...group,
        cartItems: group.cartItems.map((item) =>
          item._id === itemId || item.itemId._id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        ).filter((item) => item.quantity > 0),
      })).filter((group) => group.cartItems.length > 0);
  
      return { ...prevCart, shopGroup: updatedShopGroup };
    });
  };
  

  const updateCartItem = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; 
    try {
      await axiosInstance.put('/cart/update', {
        cartId: cart._id,
        itemId,
        quantity: newQuantity,
      });
      setError(null);
      updateCartItemQuantity(itemId, newQuantity);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart item');
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      await axiosInstance.delete('/cart/remove', {
        data: { cartId: cart._id, itemId },
      });
      updateCartItemQuantity(itemId, 0);
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove cart item');
    }
  };

  const clearCart = async () => {
    try {
      const response = await axiosInstance.delete('/cart/clear', {
        data: { cartId: cart._id },
      });
      setCart(response.data.data);
      setSelectedItems([]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.shopGroup.flatMap(group => group.cartItems).length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.shopGroup.flatMap(group => group.cartItems.map(item => item._id || item.itemId._id)));
    }
  };

  const calculateSelectedTotal = () => {
    if (!cart?.shopGroup) return 0;
    return cart.shopGroup
      .flatMap(group => group.cartItems)
      .filter(item => selectedItems.includes(item._id || item.itemId._id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const itemsToCheckout = cart.shopGroup
      .flatMap(group => group.cartItems)
      .filter(item => selectedItems.includes(item._id || item.itemId._id));
    navigate('/checkout', { state: { selectedItems: itemsToCheckout, cartId: cart._id } });
  };

  const handleShopClick = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

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
  if (!cart || !cart.shopGroup?.length) return <div className="empty"></div>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <input
          type="checkbox"
          checked={selectedItems.length === cart.shopGroup.flatMap(group => group.cartItems).length && cart.shopGroup.length > 0}
          onChange={toggleSelectAll}
        />
        <span>Sản phẩm</span>
        <span>Đơn giá</span>
        <span>Số lượng</span>
        <span>Thành tiền</span>
        <span>Thao tác</span>
      </div>
      <div className="cart-items">
        {cart.shopGroup.map((shopGroup) => (
          <div key={shopGroup._id} className="shop-section">
            <h3 onClick={() => handleShopClick(shopGroup.shopId)} style={{ cursor: 'pointer', color: '#0dac02' }}>
              {shopGroup.shopName || `Shop ${shopGroup.shopId}`}
            </h3>
            {shopGroup.cartItems.map((item) => (
              <div key={item._id || item.itemId._id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id || item.itemId._id)}
                  onChange={() => toggleSelectItem(item._id || item.itemId._id)}
                />
                <div className="item-info">
                  <img
                    src={item.itemId?.imgUrl || ''}
                    alt={item.name}
                    className="item-image"
                  />
                  <span className="item-name">{item.name}</span>
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
        ))}
      </div>
      <div className="cart-footer">
        <div className="footer-left">
          <input
            type="checkbox"
            checked={selectedItems.length === cart.shopGroup.flatMap(group => group.cartItems).length && cart.shopGroup.length > 0}
            onChange={toggleSelectAll}
          />
          <span>Chọn tất cả ({cart.shopGroup.flatMap(group => group.cartItems).length})</span>
          <button className="clear-cart" onClick={clearCart}>
            Xóa tất cả
          </button>
        </div>
        <div className="footer-right">
          <span>
            Tổng thanh toán ({selectedItems.length} sản phẩm):{' '}
            <strong>{calculateSelectedTotal().toLocaleString()} VNĐ</strong>
          </span>
          <button className="checkout-button" onClick={handleCheckout} disabled={selectedItems.length === 0}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(CartPage);