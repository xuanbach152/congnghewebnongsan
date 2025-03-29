import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage/homePage'
import ProfilePage from './pages/profilePage/profilePage'
import routers from './utils/routers'

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
      <Routes>
        {allRouters.map((route, index) => (
          <Route key={index} path={route.path} element={route.component} />
        ))}
      </Routes>
  )
}

export default renderRouter
