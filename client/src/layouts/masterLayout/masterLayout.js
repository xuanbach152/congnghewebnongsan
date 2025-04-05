import { memo } from 'react'
import Header from '../header/header'
import Footer from '../footer/footer'
import './masterLayout.scss'
const MasterLayout = ({ children, ...props }) => {
  return ( 
    <div className="master-layout" {...props}>
      <Header />
      <div className="main-content">{children}</div>
      <Footer />
    </div>
  )
}

export default memo(MasterLayout)
