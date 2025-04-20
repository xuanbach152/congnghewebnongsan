import { memo, useEffect, useState } from 'react'
import './itemDetailPage.scss'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { FaCartPlus, FaStar } from 'react-icons/fa'
import { formatter } from 'utils/formatter'

const ItemDetailPage = () => {
    const { itemId } = useParams()
    const [item, setItem] = useState(null)
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    useEffect(() => {
        axios
            .get(`http://localhost:3000/item/${itemId}`)
            .then((response) => {
                setItem(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching item data:', error)
            })
    }, [itemId])

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
                                    <div className="item-type"><strong>Loại hàng: </strong> {item.type}</div>
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
                                    <div className="item-actions">
                                        <Link
                                            to={`/item-management/${item.id}/edit`}
                                            className="btn add-to-cart"
                                        >
                                            <FaCartPlus /> Thêm vào giỏ hàng
                                        </Link>
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
