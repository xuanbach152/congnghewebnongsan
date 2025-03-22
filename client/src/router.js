import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/customer/homePage";
import ProfilePage from "./pages/customer/profilePage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/customer/theme/masterLayout";

const renderCostumerRouter = () => {
    const customerRouters = [ 
        {
            path: ROUTERS.USER.HOME,
            component: <HomePage/>,
        },
        {
            path: ROUTERS.USER.PROFILE,
            component: <ProfilePage/>,
        },
    ];

    return (
        <MasterLayout>
            <Routes>
                {customerRouters.map((route, index) => (
                    <Route key={index} path={route.path} element={route.component} />
                ))}
            </Routes>
        </MasterLayout>
    );
}  


const RouterCustom = () => {
  return renderCostumerRouter();
};

export default RouterCustom;