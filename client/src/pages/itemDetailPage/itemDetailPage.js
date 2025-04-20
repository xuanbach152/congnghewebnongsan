import { memo, useEffect, useState } from 'react'
import './itemDetailPage.scss'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { FaCartPlus, FaStar } from 'react-icons/fa'

const ItemDetailPage = () => {
    const { itemId } = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios
            .get(`http://localhost:3000/item/${itemId}`)
            .then((response) => {
                setItem(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching item data:', error)
            })
            .finally(() => {
                setLoading(false)
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
                                    <div className="item-price"><strong>Đơn giá: </strong> {item.price}</div>
                                    <div className="item-type"><strong>Loại hàng: </strong> {item.type}</div>
                                    <div className="item-rate">
                                        <strong>Đánh giá:</strong> {item.rate}
                                        <FaStar
                                            color="gold"
                                            size={14}
                                            style={{ marginBottom: '4px' }}
                                        />
                                    </div>
                                    <div>
                                        <strong>Mô tả: </strong>
                                        {item.description || 'Không có mô tả'}
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
