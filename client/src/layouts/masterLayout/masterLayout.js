import { memo } from 'react'
import Header from '../header/header'
import Footer from '../footer/footer'
import './masterLayout.scss'
const MasterLayout = ({ children, setSearchQuery, ...props }) => {
  return (
    <div className="master-layout" {...props}>
      <Header setSearchQuery={setSearchQuery} />
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  )
}

export default memo(MasterLayout)
