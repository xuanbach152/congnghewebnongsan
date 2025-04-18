import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import ProfilePage from './pages/profilePage/profilePage'
import CartPage from './pages/cartPage/cartPage'
import routers from './utils/routers'
import MasterLayout from './layouts/masterLayout/masterLayout'
import CheckoutPage from 'pages/checkoutPage/checkoutPage'
import OrderHistoryPage from 'pages/orderHistoryPage/orderHistoryPage'

const renderRouter = () => {
  const allRouters = [
    {
      path: routers.HOME,
      component: <HomePage />,
    },
    {
      path: routers.PROFILE,
      component: <ProfilePage />,
    },
    {
      path: routers.CART,
      component: <CartPage />,
    },
    {
      path: routers.CHECKOUT,
      component: <CheckoutPage />,
    },
    {
      path: routers.ORDER_HISTORY,
      component: <OrderHistoryPage />,
    },
  ]

  return (
    <MasterLayout>
      <Routes>
        {allRouters.map((route, index) => (
          <Route key={index} path={route.path} element={route.component} />
        ))}
      </Routes>
    </MasterLayout>
  )
}

export default renderRouter
