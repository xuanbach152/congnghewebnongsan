import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import ProfilePage from './pages/profilePage/profilePage'
import routers from './utils/routers'
import MasterLayout from './layouts/masterLayout/masterLayout'

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
