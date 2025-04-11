import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import ProfilePage from './pages/profilePage/profilePage'
import routers from './utils/routers'
import ShopManagementPage from 'pages/shopManagementPage/shopManagementPage'
import ItemCreationPage from 'pages/itemCreationPage/itemCreationPage'
import ShopRegistrationPage from 'pages/shopRegistrationPage/shopRegistrationPage'

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
      component: <ShopManagementPage />
    },
    {
      path: routers.SHOP_REGISTRATION,
      component: <ShopRegistrationPage />
    },
    {
      path: routers.ITEM_CREATION,
      component: <ItemCreationPage />
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
