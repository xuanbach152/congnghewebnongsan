import { memo } from 'react'
import Header from '../header/header'
import Footer from '../footer/footer'
import './masterLayout.scss'
const MasterLayout = ({
  children,
  setSearchQuery,
  distinctItemQuantity,
  totalPaymentAmount,
  setReloadChat,
  setType,
  setMinPrice,
  setMaxPrice,
  isShowFilter,
  isLoggedIn,
  setIsLoggedIn,
  isAuthModalOpen,
  setIsAuthModalOpen,
  toggleAuthModal,
  ...props
}) => {
  return (
    <div className="master-layout" {...props}>
      <Header
        setSearchQuery={setSearchQuery}
        distinctItemQuantity={distinctItemQuantity}
        totalPaymentAmount={totalPaymentAmount}
        setType={setType}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        isShowFilter={isShowFilter}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        toggleAuthModal={toggleAuthModal}
      />
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  )
}

export default memo(MasterLayout)
