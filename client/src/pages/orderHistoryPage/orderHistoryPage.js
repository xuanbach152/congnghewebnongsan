import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/api';
import { memo } from 'react';
import { toast } from 'react-toastify';
import './orderHistoryPage.scss';
import { useTokenVerification } from 'utils/tokenVerification';
import { orderDeliveryStatusEnum } from 'utils/enums';

const OrderHistoryPage = ({ setIsShowFilter }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPending, setShowPending] = useState(true); // Default: show PENDING orders
  const [showCompleted, setShowCompleted] = useState(true); // Default: show COMPLETED orders
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editFormData, setEditFormData] = useState({ deliveryAddress: '', paymentMethod: '' });
  const isVerified = useTokenVerification();
  setIsShowFilter(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOrders = async () => {
    if (!isVerified) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
      }

      const response = await axiosInstance.get(`/order/user?page=${page}&limit=5`);
      console.log('Dữ liệu từ API /order/user:', response.data);
      const { orders, totalPages } = response.data.data || {};
      
      setOrders(orders || []);
      setTotalPages(totalPages || 1);

    } catch (err) {
      console.error('Lỗi khi lấy lịch sử đơn hàng:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      if (err.response?.status === 401) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('accessToken');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!isVerified) return;
    try {
      await axiosInstance.put(`/order/cancel/${orderId}`);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, paymentStatus: 'CANCELLED' } : order
      ));
      toast.success('Đơn hàng đã được hủy');
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const confirmOrder = async (orderId) => {
    if (!isVerified) return;
    try {
      const response = await axiosInstance.put(`/order/confirm/${orderId}`);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, paymentStatus: 'COMPLETED' } : order
      ));
      toast.success('Đơn hàng đã được xác nhận hoàn tất');
    } catch (err) {
      console.error('Lỗi khi xác nhận đơn hàng:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Không thể xác nhận đơn hàng');
    }
  };

  const cancelEditing = () => {
    setEditingOrderId(null);
    setEditFormData({ deliveryAddress: '', paymentMethod: '' });
  };

  const updateOrder = async (orderId) => {
    if (!isVerified) return;
    try {
      if (!editFormData.deliveryAddress.trim()) {
        toast.error('Vui lòng nhập địa chỉ giao hàng');
        return;
      }

      const paymentMethodMap = {
        cod: 'CASH',
        bank: 'BANK_TRANSFER'
      };

      const updatedData = {
        deliveryAddress: editFormData.deliveryAddress,
        paymentMethod: paymentMethodMap[editFormData.paymentMethod],
      };

      const response = await axiosInstance.put(`/order/${orderId}`, updatedData);
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, ...updatedData } : order
      ));
      toast.success('Cập nhật đơn hàng thành công');
      setEditingOrderId(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật đơn hàng:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Không thể cập nhật đơn hàng');
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
    if (!isVerified) return;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem lịch sử mua hàng');
      return;
    }
    fetchOrders();
  }, [isVerified, page]);

  // Filter orders based on checkbox states, excluding CANCELLED orders
  const filteredOrders = orders.filter(order => {
    if (order.paymentStatus === 'CANCELLED') return true;
    if (showPending && order.paymentStatus === 'PENDING') return true;
    if (showCompleted && order.paymentStatus === 'COMPLETED') return true;
    return false;
  });

  if (loading || !orders) return null;

  return (
    <div className="order-history-page">
      <div className="header-section">
        <h2>Lịch sử mua hàng</h2>
        <div className="status-filter">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showPending}
              onChange={(e) => {
                setShowPending(e.target.checked);
                setPage(1);
              }}
            />
            Đang xử lý
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => {
                setShowCompleted(e.target.checked);
                setPage(1);
              }}
            />
            Đã giao
          </label>
        </div>
      </div>
      <div className="orders">
        {filteredOrders.length === 0 && !loading && (
          <div className="no-orders-message">
            Lịch sử mua hàng rỗng
          </div>
        )}
        {filteredOrders.map((order) => (
          <div key={order._id} className="order">
            <div className="order-header">
              <span>Mã đơn hàng: <b>{order.orderCode}</b></span>
              <span>Cửa hàng: <b>{order.shopId?.name || 'Không xác định'}</b></span>
              <span>Ngày đặt: {new Date(order.orderDate).toLocaleDateString()}</span>
              <span className={`status ${order.paymentStatus.toLowerCase()}`}>Trạng thái: {orderDeliveryStatusEnum[order.paymentStatus]}</span>
            </div>
            {editingOrderId === order._id ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Địa chỉ giao hàng:</label>
                  <textarea
                    value={editFormData.deliveryAddress}
                    onChange={(e) => setEditFormData({ ...editFormData, deliveryAddress: e.target.value })}
                    placeholder="Nhập địa chỉ giao hàng..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phương thức thanh toán:</label>
                  <label>
                    <input
                      type="radio"
                      value="cod"
                      checked={editFormData.paymentMethod === 'cod'}
                      onChange={() => setEditFormData({ ...editFormData, paymentMethod: 'cod' })}
                    />
                    Thanh toán khi nhận hàng (COD)
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="bank"
                      checked={editFormData.paymentMethod === 'bank'}
                      onChange={() => setEditFormData({ ...editFormData, paymentMethod: 'bank' })}
                    />
                    Chuyển khoản ngân hàng
                  </label>
                </div>
                <div className="form-actions">
                  <button onClick={() => updateOrder(order._id)} className="save-button">Lưu</button>
                  <button onClick={cancelEditing} className="cancel-edit-button">Hủy</button>
                </div>
              </div>
            ) : (
              <>
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      {item.itemId?.imgUrl ? (
                        <img src={item.itemId.imgUrl} alt={item.name || 'Sản phẩm'} className="item-image" />
                      ) : null}
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
                    <div className="order-actions">
                      <button
                        className="confirm-order"
                        onClick={() => {
                          if (window.confirm('Bạn có chắc đã nhận được đơn hàng này?')) {
                            confirmOrder(order._id);
                          }
                        }}
                      >
                        Đã nhận hàng
                      </button>
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
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default memo(OrderHistoryPage);