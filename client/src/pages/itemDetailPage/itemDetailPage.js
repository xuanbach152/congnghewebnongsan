import { memo, useEffect, useState, useCallback } from 'react'
import './itemDetailPage.scss'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FaCartPlus,
  FaStar,
  FaCamera,
  FaUserCircle,
  FaReply,
} from 'react-icons/fa'
import { formatter } from 'utils/formatter'
import axiosInstance from 'utils/api'
import { itemTypes } from 'utils/enums'
import { toast } from 'react-toastify'
import axios from 'axios'
import routers from 'utils/routers'

const ItemDetailPage = ({ setDistinctItemQuantity, setTotalPaymentAmount }) => {
  const navigate = useNavigate()
  const { itemId } = useParams()
  const [item, setItem] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const [comments, setComments] = useState([])
  const [commentLoading, setCommentLoading] = useState(true)
  const [commentError, setCommentError] = useState(null)
  const [commentPage, setCommentPage] = useState(1)
  const [commentTotalPages, setCommentTotalPages] = useState(1)

  const [newComment, setNewComment] = useState('')
  const [commentImage, setCommentImage] = useState(null)
  const [commentPreview, setCommentPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [relatedItems, setRelatedItems] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(true)

  const fetchRelatedItems = useCallback(async () => {
    try {
      setRelatedLoading(true)
      const response = await axiosInstance.get(
        `/item/${itemId}/related?limit=4`
      )
      setRelatedItems(response.data.data || [])
    } catch (error) {
      console.error('Error fetching related items:', error)
    } finally {
      setRelatedLoading(false)
    }
  }, [itemId])

  // Hàm xử lý khi chọn ảnh

  const fetchComments = useCallback(async () => {
    try {
      setCommentLoading(true)

      const response = await axios.get(`http://localhost:3000/comment/item/${itemId}`, {
        params: { page: commentPage, limit: 3 },
      })

      const fetchedComments = response.data.data.comments || []

      // Cập nhật thông tin phân trang
      setCommentTotalPages(response.data.data.totalPages || 1)

      // Nếu currentPage từ API là null, sử dụng giá trị state hiện tại
      if (response.data.data.currentPage !== null) {
        setCommentPage(response.data.data.currentPage)
      }

      setComments(fetchedComments)
      setCommentError(null)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setCommentError('Không thể tải bình luận. Vui lòng thử lại sau.')
    } finally {
      setCommentLoading(false)
    }
  }, [itemId, commentPage])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Kiểm tra định dạng ảnh
      if (
        !['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'].includes(
          file.type
        )
      ) {
        setFormError('Định dạng ảnh không hợp lệ. Chấp nhận JPG, PNG.')
        return
      }

      setCommentImage(file)
      setCommentPreview(URL.createObjectURL(file))
      setFormError('')
    }
  }

  // Xóa ảnh đã chọn
  const removeImage = () => {
    if (commentPreview) {
      URL.revokeObjectURL(commentPreview)
    }
    setCommentImage(null)
    setCommentPreview('')
  }

  // Gửi bình luận
  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!newComment.trim()) {
      setFormError('Vui lòng nhập nội dung bình luận')
      return
    }

    try {
      setSubmitting(true)
      setFormError('')

      const formData = new FormData()
      formData.append('itemId', itemId)
      formData.append('content', newComment)


      if (commentImage) {
        formData.append('image', commentImage)
      }

      // Gửi request
      const response = await axiosInstance.post('/comment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })


      console.log('Bình luận thành công:', response.data)

      // Reset form
      setNewComment('')
      removeImage()

      // Refresh danh sách bình luận
      fetchComments()
    } catch (error) {
      console.error('Error submitting comment:', error)
      setFormError(
        error.response?.data?.message || 'Có lỗi xảy ra khi gửi bình luận'
      )
    } finally {
      setSubmitting(false)
    }
  }
  const handleNavigateToItem = (id) => {

    navigate(`/item/${id}`)
  }
  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1)
    setQuantity(value)
  }

  const handlePrevPage = () => {
    if (commentPage > 1) {
      setCommentPage(commentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (commentPage < commentTotalPages) {
      setCommentPage(commentPage + 1)
    }
  }
  const formatCommentDate = (dateString) => {
    const commentDate = new Date(dateString)
    const now = new Date()

    const diffMs = now - commentDate
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Hôm nay'
    } else if (diffDays === 1) {
      return 'Hôm qua'
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} tuần trước`
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} tháng trước`
    } else {
      return `${Math.floor(diffDays / 365)} năm trước`
    }
  }

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post(`http://localhost:3000/cart/add`, {
        itemId,
        quantity,
      })
      const response = await axiosInstance.get('/cart/getcart')
      setDistinctItemQuantity(response.data.data.distinctItemQuantity || 0)
      setTotalPaymentAmount(response.data.data.totalPaymentAmount || 0)
      toast.success('Thêm vào giỏ hàng thành công!')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    axiosInstance
      .get(`http://localhost:3000/item/${itemId}`)
      .then((response) => {
        setItem(response.data.data)
      })
      .catch((error) => {
        console.error('Error fetching item data:', error)
      })
    fetchComments()
    fetchRelatedItems()
  }, [itemId, commentPage, fetchComments, fetchRelatedItems])

  return (
    <div className="item-information-management">
      <div className="container">
        <div className="item-information">
          <div className="item-information-title">
            <div className="title-text">Thông tin sản phẩm</div>
          </div>

          {item && (
            <>
              <div className="item-container">
                <div className="item-detail-column">
                  <div className="item-detail">
                    {item.imgUrl && (
                      <div className="item-image">
                        <img src={item.imgUrl} alt={item.name || 'Cửa hàng'} />
                      </div>
                    )}

                    <div className="item-content">
                      <div className='item-in-shop'>
                        <strong>Cửa hàng: </strong>
                        <Link key={item.shopId._id} to={routers.getShopDetailPath(item.shopId._id)}>
                          <img src={item.shopId.imgUrl} alt={item.shopId.name} />
                          {item.shopId.name}
                        </Link>
                      </div>
                      <div>
                        <strong>Tên sản phẩm: </strong> {item.name}
                      </div>
                      <div className="item-price">
                        <strong>Đơn giá: </strong> {formatter(item.price)}
                      </div>
                      <div className="item-type">
                        <strong>Loại hàng: </strong> {itemTypes[item.type]}
                      </div>
                      <div className="item-rate">
                        <strong>Đánh giá:</strong> {item.rate}
                        <FaStar
                          color="gold"
                          size={14}
                          style={{ marginTop: '2px' }}
                        />
                      </div>
                      <div>
                        <strong>Mô tả: </strong>
                        {item.description || 'Không có mô tả'}
                      </div>
                      <div className="item-quantity">
                        <strong>Số lượng mua: </strong>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={handleQuantityChange}
                        />
                      </div>
                      <div className="item-total-price">
                        <strong>Tổng tiền: </strong>{' '}
                        {formatter(quantity * item.price)}
                      </div>
                      <div className="item-actions" onClick={handleAddToCart}>
                        <button className="btn add-to-cart">
                          <FaCartPlus /> Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="related-products">
                    <h3 className="related-title">Sản phẩm liên quan</h3>
                    <div className="related-items">
                      {relatedLoading ? (
                        <div className="related-loading">
                          Đang tải sản phẩm liên quan...
                        </div>
                      ) : relatedItems.length > 0 ? (
                        relatedItems.map((relatedItem) => (
                          <div
                            key={relatedItem._id}
                            className="related-item"
                            onClick={() =>
                              handleNavigateToItem(relatedItem._id)
                            }
                          >
                            <div className="related-img">
                              <img
                                src={
                                  relatedItem.imgUrl ||
                                  'https://via.placeholder.com/150'
                                }
                                alt={relatedItem.name}
                              />
                            </div>
                            <div className="related-info">
                              <div className="related-name">
                                {relatedItem.name}
                              </div>
                              <div className="related-price">
                                {formatter(relatedItem.price)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-related">
                          Không tìm thấy sản phẩm liên quan
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="comment-column">
                  <div className="comment-section">
                    <h3 className="section-title">Bình luận sản phẩm</h3>

                    {/* Danh sách bình luận */}
                    <div className="comments-list">
                      {commentLoading ? (
                        <div className="comment-loading">Đang tải bình luận...</div>
                      ) : commentError ? (
                        <div className="comment-error">{commentError}</div>
                      ) : (
                        <>
                          <div className="comment-scrollable">
                            {comments.length === 0 ? (
                              <div className="no-comments">
                                Chưa có bình luận nào cho sản phẩm này.
                              </div>
                            ) : (
                              comments.map((comment) => (
                                <div key={comment._id} className="comment-item">
                                  <div className="comment-header">
                                    <div className="user-info">
                                      {comment.userId?.imgUrl ? (
                                        <img
                                          src={comment.userId.imgUrl}
                                          alt="User"
                                          className="user-avatar"
                                        />
                                      ) : (
                                        <FaUserCircle className="default-avatar" />
                                      )}
                                      <div>
                                        <div className="username">
                                          {comment.userId?.userName ||
                                            (comment.userId?._id
                                              ? `Người dùng #${comment.userId._id.substring(0, 4)}`
                                              : 'Khách')}
                                        </div>
                                        <div className="comment-date">
                                          {formatCommentDate(comment.createdAt)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="comment-content">{comment.content}</div>

                                  {comment.imgUrl && (
                                    <div className="comment-images">
                                      <img
                                        src={comment.imgUrl}
                                        alt="Hình ảnh bình luận"
                                        className="comment-image"
                                      />
                                    </div>
                                  )}

                                  {comment.reply && (
                                    <div className="shop-reply">
                                      <div className="reply-header">
                                        <FaReply /> Phản hồi từ shop
                                      </div>
                                      <div className="reply-content">{comment.reply.content}</div>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>

                          {(commentTotalPages > 1 || comments.length > 0) && (
                            <div className="pagination">
                              <button
                                className="page-btn"
                                onClick={handlePrevPage}
                                disabled={commentPage === 1}
                              >
                                Trước
                              </button>
                              <span className="page-info">
                                Trang {commentPage} / {commentTotalPages}
                              </span>
                              <button
                                className="page-btn"
                                onClick={handleNextPage}
                                disabled={commentPage === commentTotalPages}
                              >
                                Sau
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>


                    {/* Form thêm bình luận mới */}
                    <div className="comment-form">
                      <h3>Để lại bình luận của bạn</h3>

                      <form onSubmit={handleSubmitComment}>
                        <textarea
                          placeholder="Viết bình luận của bạn về sản phẩm này..."
                          className="comment-textarea"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={4}
                        />

                        {formError && (
                          <div className="form-error">{formError}</div>
                        )}

                        <div className="image-preview-container">
                          {commentPreview && (
                            <div className="image-preview">
                              <img src={commentPreview} alt="Preview" />
                              <button
                                type="button"
                                className="remove-image-btn"
                                onClick={removeImage}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="form-actions">
                          <label className="add-image-btn">
                            <FaCamera className="icon" />
                            <span>
                              {!commentPreview ? 'Thêm ảnh' : 'Thay đổi ảnh'}
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg,image/jfif"
                              onChange={handleImageChange}
                              style={{ display: 'none' }}
                              disabled={submitting}
                            />
                          </label>

                          <button
                            type="submit"
                            className="submit-btn"
                            disabled={submitting}
                          >
                            {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ItemDetailPage)
