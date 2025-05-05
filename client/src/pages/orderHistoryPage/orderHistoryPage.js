import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/api';
import { memo } from 'react';
import './orderHistoryPage.scss';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
      }

      const response = await axiosInstance.get(`/order/history?page=${page}&limit=10&status=${statusFilter}`);
      console.log('Dữ liệu từ API /order/history:', response.data);
      const { orders, totalPages } = response.data.data || {};
      
      // Lọc bỏ các đơn hàng có trạng thái CANCELLED
      const filteredOrders = (orders || []).filter(order => order.paymentStatus !== 'CANCELLED');
      setOrders(filteredOrders);
      setTotalPages(totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi lấy lịch sử đơn hàng:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('accessToken');
      } else if (err.response?.status === 404) {
        setError('Không tìm thấy API /order/history. Vui lòng kiểm tra backend.');
      } else {
        setError(err.response?.data?.message || err.message || 'Không thể tải lịch sử mua hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      // Gọi API để hủy đơn hàng
      await axiosInstance.put(`/order/cancel/${orderId}`);

      // Cập nhật state orders bằng cách loại bỏ đơn hàng vừa hủy
      setOrders(orders.filter(order => order._id !== orderId));
      alert('Đơn hàng đã được hủy');
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const checkOrderTotal = (order) => {
    const calculatedTotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (calculatedTotal !== order.totalPrice) {
      console.warn(`Tổng tiền không khớp cho đơn hàng ${order._id}: ${calculatedTotal} !== ${order.totalPrice}`);
      return calculatedTotal;
    }
    return order.totalPrice;
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Vui lòng đăng nhập để xem lịch sử mua hàng');
      return;
    }
    fetchOrders();
  }, [page, statusFilter]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!orders.length) return <div className="empty">Bạn chưa có đơn hàng nào</div>;

  return (
    <div className="order-history-page">
      <div className="header-section">
        <h2>Lịch sử mua hàng</h2>
        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">Tất cả</option>
            <option value="PENDING">Đang xử lý</option>
            <option value="COMPLETED">Đã giao</option>
          </select>
        </div>
      </div>
      <div className="orders">
        {orders.map((order) => (
          <div key={order._id} className="order">
            <div className="order-header">
              <span>Mã đơn hàng: {order._id}</span>
              <span>Cửa hàng: {order.shopId?.name || 'Không xác định'}</span>
              <span>Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</span>
              <span className="status">Trạng thái: {order.paymentStatus}</span>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img
                    src={item.itemId?.imgUrl || 'https://via.placeholder.com/60'}
                    alt={item.name || 'Sản phẩm'}
                    className="item-image"
                  />
                  <span className="item-name">{item.name || 'Sản phẩm không xác định'}</span>
                  <span className="item-price">{(item.price || 0).toLocaleString()} VNĐ</span>
                  <div className="item-quantity">
                    Số lượng: <span>{item.quantity}</span>
                  </div>
                  <span className="item-total">
                    {(item.price * item.quantity || 0).toLocaleString()} VNĐ
                  </span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <div className="order-summary">
                <span>Phí giao hàng: {(order.totalDeliveryFee || 0).toLocaleString()} VNĐ</span>
                <span>Tổng tiền hàng: {(checkOrderTotal(order) || 0).toLocaleString()} VNĐ</span>
                <span>
                  Tổng thanh toán: <strong>{(order.totalPaymentAmount || 0).toLocaleString()} VNĐ</strong>
                </span>
              </div>
              {order.paymentStatus === 'PENDING' && (
                <button
                  className="cancel-order"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                      cancelOrder(order._id);
                    }
                  }}
                >
                  Hủy đơn
                </button>
              )}
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