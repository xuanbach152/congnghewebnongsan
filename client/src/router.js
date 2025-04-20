import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import ProfilePage from './pages/profilePage/profilePage'
import routers from './utils/routers'
import ShopManagementPage from 'pages/shopManagementPage/shopManagementPage'
import ItemCreationPage from 'pages/itemCreationPage/itemCreationPage'
import ShopRegistrationPage from 'pages/shopRegistrationPage/shopRegistrationPage'
import ItemPage from 'pages/itemPage/itemPage'
import ItemDetailPage from 'pages/itemDetailPage/itemDetailPage'
import ShopDetailPage from 'pages/shopDetailPage/shopDetailPage'

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
    }
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
