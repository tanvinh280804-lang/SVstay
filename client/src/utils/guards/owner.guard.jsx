import { Navigate, Outlet } from "react-router-dom";
import { isOwnerAuthenticated } from "../../services/Auth/OwnerLogin.service";

export const OwnerGuestRoute = () => {
  return isOwnerAuthenticated()
    ? <Navigate to="/owner/rooms" replace />
    : <Outlet />;
};

export const OwnerPrivateRoute = () => {
  return isOwnerAuthenticated()
    ? <Outlet />
    : <Navigate to="/owner/login" replace />;
};

export default {
  OwnerGuestRoute,
  OwnerPrivateRoute,
};
