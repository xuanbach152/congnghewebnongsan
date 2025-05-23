import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import ProfilePage from './pages/profilePage/profilePage'
import CartPage from './pages/cartPage/cartPage'
import routers from './utils/routers'
import CheckoutPage from 'pages/checkoutPage/checkoutPage'
import OrderHistoryPage from 'pages/orderHistoryPage/orderHistoryPage'
import ShopManagementPage from 'pages/shopManagementPage/shopManagementPage'
import ItemUpsertPage from 'pages/itemUpsertPage/itemUpsertPage'
import ShopUpsertPage from 'pages/shopUpsertPage/shopUpsertPage'
import ItemPage from 'pages/itemPage/itemPage'
import ItemDetailPage from 'pages/itemDetailPage/itemDetailPage'
import ShopDetailPage from 'pages/shopDetailPage/shopDetailPage'
import MyShopPage from 'pages/myShopPage/myShopPage'
import ShopCensorshipPage from 'pages/shopCensorshipPage/shopCensorshipPage'

const renderRouter = ({
  searchQuery,
  setDistinctItemQuantity,
  setTotalPaymentAmount,
  openChat,
  setShopChat,
  type,
  minPrice,
  maxPrice,
  setIsShowFilter,
}) => {
  const allRouters = [
    {
      path: routers.HOME,
      component: (
        <HomePage
          searchQuery={searchQuery}
          type={type}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setIsShowFilter={setIsShowFilter}
        />
      ),
    },
    {
      path: routers.PROFILE,
      component: <ProfilePage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.CART,
      component: (
        <CartPage
          setDistinctItemQuantity={setDistinctItemQuantity}
          setTotalPaymentAmount={setTotalPaymentAmount}
          setIsShowFilter={setIsShowFilter}
        />
      ),
    },
    {
      path: routers.CHECKOUT,
      component: <CheckoutPage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.ORDER_HISTORY,
      component: <OrderHistoryPage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.SHOP_MANAGEMENT,
      component: <ShopManagementPage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.SHOP_UPSERT,
      component: <ShopUpsertPage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.ITEM_UPSERT,
      component: <ItemUpsertPage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.ITEM,
      component: <ItemPage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.SHOP_DETAIL,
      component: (
        <ShopDetailPage
          openChat={openChat}
          setShopChat={setShopChat}
          setIsShowFilter={setIsShowFilter}
        />
      ),
    },
    {
      path: routers.ITEM_DETAIL,
      component: (
        <ItemDetailPage
          setDistinctItemQuantity={setDistinctItemQuantity}
          setTotalPaymentAmount={setTotalPaymentAmount}
          setIsShowFilter={setIsShowFilter}
        />
      ),
    },
    {
      path: routers.MY_SHOP,
      component: <MyShopPage setIsShowFilter={setIsShowFilter} />,
    },
    {
      path: routers.SHOP_CENSORSHIP,
      component: <ShopCensorshipPage setIsShowFilter={setIsShowFilter} />,
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
