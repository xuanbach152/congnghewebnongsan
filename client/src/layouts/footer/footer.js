import { memo } from 'react'
import './footer.scss'

const Footer = () => {
  return (
    <div className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h5>Về website</h5>
            <ul className="no-bullet-list">
              <li>Giới thiệu về nền tảng</li>
              <li>Điều khoản sử dụng</li>
              <li>Chính sách bảo mật thông tin</li>
            </ul>
          </div>
          <div className="col">
            <h5>Hỗ trợ khách hàng</h5>
            <ul className="no-bullet-list">
              <li>Hướng dẫn</li>
              <li>Chăm sóc</li>
            </ul>
          </div>
          <div className="col">
            <h5>Chính sách</h5>
            <ul className="no-bullet-list">
              <li>Thanh toán</li>
              <li>Vận chuyển</li>
            </ul>
          </div>
          <div className="col">
            <h5>Kết nối với chúng tôi</h5>
            <ul className="no-bullet-list">
              <li>Facebook</li>
              <li>Zalo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Footer)
