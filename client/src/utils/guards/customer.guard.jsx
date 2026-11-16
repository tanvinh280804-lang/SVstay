import { Navigate, Outlet } from "react-router-dom";
import { isCustomerAuthenticated } from "../../services/Auth/CustomerAuth.service";

export const CustomerGuestRoute = () => isCustomerAuthenticated()
  ? <Navigate to="/customer/account" replace />
  : <Outlet />;

export const CustomerPrivateRoute = () => isCustomerAuthenticated()
  ? <Outlet />
  : <Navigate to="/customer/login" replace />;
