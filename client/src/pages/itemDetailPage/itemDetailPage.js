import { memo, useEffect, useState } from 'react'
import './itemDetailPage.scss'
import { useParams } from 'react-router-dom'
import { FaCartPlus, FaStar } from 'react-icons/fa'
import { formatter } from 'utils/formatter'
import axiosInstance from 'utils/api'
import { itemTypes } from 'utils/enums'

const ItemDetailPage = ({ setDistinctItemQuantity, setTotalPaymentAmount }) => {
    const { itemId } = useParams()
    const [item, setItem] = useState(null)
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    useEffect(() => {
        axiosInstance
            .get(`http://localhost:3000/item/${itemId}`)
            .then((response) => {
                setItem(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching item data:', error)
            })
    }, [itemId])

    const handleAddToCart = async () => {
        try {
            await axiosInstance.post((`http://localhost:3000/cart/add`), {
                itemId, quantity
            })
            const response = await axiosInstance.get('/cart/getcart');
            setDistinctItemQuantity(response.data.data.distinctItemQuantity || 0);
            setTotalPaymentAmount(response.data.data.totalPaymentAmount || 0)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="item-information-management">
            <div className="container">

                <div className="item-information">
                    <div className="item-information-title">
                        <div className="title-text">Thông tin sản phẩm</div>
                    </div>

                    {item && (
                        <>
                            <div className="item-detail">
                                {item.imgUrl && (
                                    <div className="item-image">
                                        <img src={item.imgUrl} alt={item.name || 'Cửa hàng'} />
                                    </div>
                                )}

                                <div className="item-content">
                                    <div>
                                        <strong>Tên sản phẩm: </strong> {item.name}
                                    </div>
                                    <div className="item-price"><strong>Đơn giá: </strong> {formatter(item.price)}</div>
                                    <div className="item-type"><strong>Loại hàng: </strong> {itemTypes[item.type]}</div>
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
                                        <strong>Tổng tiền: </strong> {formatter(quantity * item.price)}
                                    </div>
                                    <div className="item-actions" onClick={handleAddToCart}>
                                        <button
                                            className="btn add-to-cart"
                                        >
                                            <FaCartPlus /> Thêm vào giỏ hàng
                                        </button>
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
