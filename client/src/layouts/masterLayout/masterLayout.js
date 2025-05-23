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
      />
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  )
}

export default memo(MasterLayout)
