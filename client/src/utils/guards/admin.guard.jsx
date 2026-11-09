import { Navigate, Outlet } from "react-router-dom";

// Kiểm tra đã đăng nhập hay chưa
const isAdminAuthenticated = () => {
    return !!localStorage.getItem("admin_token");
};

export const AdminGuestRoute = () => {
    return isAdminAuthenticated()
        ? <Navigate to="/admin/dashboard" replace />
        : <Outlet />;
};

export const AdminPrivateRoute = () => {
    return isAdminAuthenticated()
        ? <Outlet />
        : <Navigate to="/admin/login" replace />;
};