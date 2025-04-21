import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import ProfilePage from './pages/profilePage/profilePage'
import CartPage from './pages/cartPage/cartPage'
import routers from './utils/routers'
import CheckoutPage from 'pages/checkoutPage/checkoutPage'
import OrderHistoryPage from 'pages/orderHistoryPage/orderHistoryPage'
import ShopManagementPage from 'pages/shopManagementPage/shopManagementPage'
import ItemCreationPage from 'pages/itemCreationPage/itemCreationPage'
import ShopRegistrationPage from 'pages/shopRegistrationPage/shopRegistrationPage'
import ItemPage from 'pages/itemPage/itemPage'
import ItemDetailPage from 'pages/itemDetailPage/itemDetailPage'
import ShopDetailPage from 'pages/shopDetailPage/shopDetailPage'
import MyShopPage from 'pages/myShopPage/myShopPage'

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
    {
      path: routers.SHOP_MANAGEMENT,
      component: <ShopManagementPage />,
    },
    {
      path: routers.SHOP_REGISTRATION,
      component: <ShopRegistrationPage />,
    },
    {
      path: routers.ITEM_CREATION,
      component: <ItemCreationPage />,
    },
    {
      path: routers.ITEM,
      component: <ItemPage />,
    },
    {
      path: routers.SHOP_DETAIL,
      component: <ShopDetailPage />,
    },
    {
      path: routers.ITEM_DETAIL,
      component: <ItemDetailPage />,
    },
    {
      path: routers.MY_SHOP,
      component: <MyShopPage />,
    },
  ]

  return (
    <Routes>
      {allRouters.map((route, index) => (
        <Route key={index} path={route.path} element={route.component} />
      ))}
    </Routes>
  )
}

export default renderRouter
