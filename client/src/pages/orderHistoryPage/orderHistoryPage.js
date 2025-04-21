import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/api';
import { memo } from 'react';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/order/history?page=${page}&limit=10`);
      setOrders(response.data.data.orders);
      setTotalPages(response.data.data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi lấy lịch sử đơn hàng:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Không thể tải lịch sử mua hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Vui lòng đăng nhập để xem lịch sử mua hàng');
      return;
    }
    fetchOrders();
  }, [page]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!orders.length) return <div className="empty">Bạn chưa có đơn hàng nào</div>;

  return (
    <div className="order-history-page">
      <h2>Lịch sử mua hàng</h2>
      <div className="orders">
        {orders.map((order) => (
          <div key={order._id} className="order">
            <div className="order-header">
              <span>Mã đơn hàng: {order._id}</span>
              <span>Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</span>
              <span>Trạng thái: {order.paymentStatus}</span>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img
                    src={item.itemId?.imgUrl || 'https://via.placeholder.com/60'}
                    alt={item.itemId?.name || 'Sản phẩm'}
                    className="item-image"
                  />
                  <span className="item-name">{item.itemId?.name || 'Sản phẩm không xác định'}</span>
                  <span className="item-price">{(item.price || 0).toLocaleString()} VNĐ</span>
                  <span className="item-quantity">Số lượng: {item.quantity}</span>
                  <span className="item-total">
                    {(item.price * item.quantity || 0).toLocaleString()} VNĐ
                  </span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span>
                Tổng tiền: <strong>{order.totalPrice.toLocaleString()} VNĐ</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span>Trang {page} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default memo(OrderHistoryPage);