import { memo, useState, useEffect } from 'react';
import axiosInstance from 'utils/api';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineCalendar, AiOutlinePicture, AiOutlineLock, AiOutlineBank, AiOutlineHome } from 'react-icons/ai';
import './profilePage.scss';

const ProfilePage = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    avatar: '',
    addresses: [],
    defaultAddress: '',
    bankInfo: { bankName: '', accountNumber: '' }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [newAddress, setNewAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Fetch user data
  const fetchUserData = async () => {
    if (!userId) {
      setErrors({ fetch: 'Không có ID người dùng' });
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      if (response.data.code === 200) {
        const data = response.data.data;
        setUserData({
          userName: data.userName || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          birthday: data.birthday || '',
          avatar: data.avatar || '',
          addresses: data.addresses || [],
          defaultAddress: data.defaultAddress || '',
          bankInfo: data.bankInfo || { bankName: '', accountNumber: '' }
        });
        setPreviewAvatar(data.avatar || '');
      } else {
        setErrors({ fetch: response.data.message || 'Không thể tải thông tin' });
      }
    } catch (err) {
      setErrors({ fetch: err.response?.data?.message || 'Lỗi kết nối server' });
    } finally {
      setLoading(false);
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const newErrors = {};
    if (!userData.userName.trim()) newErrors.userName = 'Tên người dùng không được để trống';
    if (!userData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Email không hợp lệ';
    if (userData.phone && !userData.phone.match(/^\d{10}$/)) newErrors.phone = 'Số điện thoại phải là 10 chữ số';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password change form
  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!passwordData.newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (passwordData.newPassword.length < 8) newErrors.newPassword = 'Mật khẩu mới phải dài ít nhất 8 ký tự';
    else if (!passwordData.newPassword.match(/[A-Z]/) || !passwordData.newPassword.match(/[0-9]/)) {
      newErrors.newPassword = 'Mật khẩu mới phải chứa ít nhất 1 chữ cái in hoa và 1 số';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate bank form
  const validateBankForm = () => {
    const newErrors = {};
    if (!userData.bankInfo.bankName) newErrors.bankName = 'Vui lòng chọn ngân hàng';
    if (!userData.bankInfo.accountNumber.match(/^\d{10,16}$/)) {
      newErrors.accountNumber = 'Số tài khoản phải từ 10-16 chữ số';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/users/${userId}`, userData);
      if (response.data.code === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        await fetchUserData();
      } else {
        setErrors({ submit: response.data.message || 'Cập nhật thất bại' });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật' });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/users/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.data.code === 200) {
        setSuccess(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setErrors({ submit: response.data.message || 'Đổi mật khẩu thất bại' });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  // Handle bank info submission
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    if (!validateBankForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/users/${userId}`, { bankInfo: userData.bankInfo });
      if (response.data.code === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        await fetchUserData();
      } else {
        setErrors({ submit: response.data.message || 'Liên kết ngân hàng thất bại' });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Có lỗi xảy ra khi liên kết ngân hàng' });
    } finally {
      setLoading(false);
    }
  };

  // Handle address submission
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      setErrors({ newAddress: 'Địa chỉ không được để trống' });
      return;
    }

    const updatedAddresses = [...userData.addresses, newAddress];
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/users/${userId}`, {
        addresses: updatedAddresses,
        defaultAddress: userData.defaultAddress || newAddress
      });
      if (response.data.code === 200) {
        setSuccess(true);
        setNewAddress('');
        setTimeout(() => setSuccess(false), 2000);
        await fetchUserData();
      } else {
        setErrors({ submit: response.data.message || 'Cập nhật địa chỉ thất bại' });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ' });
    } finally {
      setLoading(false);
    }
  };

  // Set default address
  const setDefaultAddress = async (address) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/api/users/${userId}`, { defaultAddress: address });
      if (response.data.code === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
        await fetchUserData();
      } else {
        setErrors({ submit: response.data.message || 'Cập nhật địa chỉ mặc định thất bại' });
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ mặc định' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      bankInfo: { ...userData.bankInfo, [name]: value }
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, avatar: reader.result });
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  return (
    <div className="profile_container">
      <div className="sidebar">
        <div className="sidebar_user">
          <img src={previewAvatar || 'default-avatar.png'} alt="Avatar" className="sidebar_avatar" />
          <span>{userData.userName || 'Người dùng'}</span>
        </div>
        <div className="menu_header">Tài Khoản Của Tôi</div>
        <ul className="sidebar_menu">
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            Hồ Sơ
          </li>
          <li className={activeTab === 'password' ? 'active' : ''} onClick={() => setActiveTab('password')}>
            Đổi Mật Khẩu
          </li>
          <li className={activeTab === 'bank' ? 'active' : ''} onClick={() => setActiveTab('bank')}>
            Ngân Hàng
          </li>
          <li className={activeTab === 'address' ? 'active' : ''} onClick={() => setActiveTab('address')}>
            Địa Chỉ
          </li>
        </ul>
      </div>

      <div className="profile_content">
        {activeTab === 'profile' && (
          <>
            <h2>Hồ Sơ Của Tôi</h2>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

            {loading && <div className="loading">Đang tải...</div>}
            {success && <div className="success_message">Cập nhật thành công!</div>}
            {errors.fetch && <div className="error_message">{errors.fetch}</div>}

            <div className="profile_main">
              <form onSubmit={handleProfileSubmit} className="profile_form">
                <div className="form_row">
                  <label>Tên đăng nhập</label>
                  <input
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.userName && <span className="error_message">{errors.userName}</span>}
                </div>

                <div className="form_row">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.email && <span className="error_message">{errors.email}</span>}
                </div>

                <div className="form_row">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.phone && <span className="error_message">{errors.phone}</span>}
                </div>

                <div className="form_row">
                  <label>Giới tính</label>
                  <div className="gender_options">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={userData.gender === 'Nam'}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      Nam
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={userData.gender === 'Nữ'}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      Nữ
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Khác"
                        checked={userData.gender === 'Khác'}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      Khác
                    </label>
                  </div>
                </div>

                <div className="form_row">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="birthday"
                    value={userData.birthday}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="submit_button" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
                {errors.submit && <span className="error_message">{errors.submit}</span>}
              </form>

              <div className="avatar_section">
                <img src={previewAvatar || 'default-avatar.png'} alt="Avatar" className="profile_avatar" />
                <label className="avatar_upload">
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={loading}
                    hidden
                  />
                </label>
                <p>Dung lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'password' && (
          <>
            <h2>Đổi Mật Khẩu</h2>
            <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>

            {loading && <div className="loading">Đang tải...</div>}
            {success && <div className="success_message">Đổi mật khẩu thành công!</div>}

            <form onSubmit={handlePasswordSubmit} className="profile_form">
              <div className="form_row">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {errors.currentPassword && <span className="error_message">{errors.currentPassword}</span>}
              </div>

              <div className="form_row">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {errors.newPassword && <span className="error_message">{errors.newPassword}</span>}
              </div>

              <div className="form_row">
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error_message">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="submit_button" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
              {errors.submit && <span className="error_message">{errors.submit}</span>}
            </form>
          </>
        )}

        {activeTab === 'bank' && (
          <>
            <h2>Ngân Hàng</h2>
            <p>Quản lý thông tin tài khoản ngân hàng để thanh toán</p>

            {loading && <div className="loading">Đang tải...</div>}
            {success && <div className="success_message">Liên kết ngân hàng thành công!</div>}

            <form onSubmit={handleBankSubmit} className="profile_form">
              <div className="form_row">
                <label>Tên ngân hàng</label>
                <select
                  name="bankName"
                  value={userData.bankInfo.bankName}
                  onChange={handleBankChange}
                  disabled={loading}
                >
                  <option value="">Chọn ngân hàng</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="MB Bank">MB Bank</option>
                  <option value="VP Bank">VP Bank</option>
                </select>
                {errors.bankName && <span className="error_message">{errors.bankName}</span>}
              </div>

              <div className="form_row">
                <label>Số tài khoản</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={userData.bankInfo.accountNumber}
                  onChange={handleBankChange}
                  disabled={loading}
                />
                {errors.accountNumber && <span className="error_message">{errors.accountNumber}</span>}
              </div>

              {userData.bankInfo.accountNumber && (
                <div className="form_row">
                  <label>Số tài khoản hiển thị</label>
                  <span>
                    **** **** **** {userData.bankInfo.accountNumber.slice(-4)}
                  </span>
                </div>
              )}

              <button type="submit" className="submit_button" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
              {errors.submit && <span className="error_message">{errors.submit}</span>}
            </form>
          </>
        )}

        {activeTab === 'address' && (
          <>
            <h2>Địa Chỉ</h2>
            <p>Quản lý địa chỉ giao hàng mặc định</p>

            {loading && <div className="loading">Đang tải...</div>}
            {success && <div className="success_message">Cập nhật địa chỉ thành công!</div>}

            <div className="address_list">
              {userData.addresses.map((address, index) => (
                <div key={index} className="address_item">
                  <span>{address}</span>
                  {address === userData.defaultAddress ? (
                    <span className="default_tag">Mặc định</span>
                  ) : (
                    <button
                      className="set_default_button"
                      onClick={() => setDefaultAddress(address)}
                      disabled={loading}
                    >
                      Đặt làm mặc định
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddressSubmit} className="profile_form">
              <div className="form_row">
                <label>Thêm địa chỉ mới</label>
                <textarea
                  name="newAddress"
                  value={newAddress}
                  onChange={(e) => {
                    setNewAddress(e.target.value);
                    setErrors({ ...errors, newAddress: '' });
                  }}
                  disabled={loading}
                />
                {errors.newAddress && <span className="error_message">{errors.newAddress}</span>}
              </div>

              <button type="submit" className="submit_button" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Thêm địa chỉ'}
              </button>
              {errors.submit && <span className="error_message">{errors.submit}</span>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(ProfilePage);