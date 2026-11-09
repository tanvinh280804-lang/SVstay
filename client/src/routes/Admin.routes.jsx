import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import AdminLogin from "../pages/Auth/AdminLogin";
import Profile from "../pages/Admin/Profile";
import RoomTypes from "../pages/Admin/RoomTypes";

import { AdminGuestRoute, AdminPrivateRoute } from '../utils/guards/admin.guard.jsx'

const AdminRoutes = (
  <>
    <Route>
      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:adminId" element={<Profile />} />

          <Route
            path="users"
            element={
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <h1 className="text-xl font-bold text-slate-800">Quản lý người dùng</h1>
                <p className="text-sm text-slate-500 mt-1">Danh sách và thông tin người dùng trong hệ thống.</p>
              </div>
            }
          />

          <Route path="room-types" element={<RoomTypes />} />

          <Route
            path="rooms"
            element={
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <h1 className="text-xl font-bold text-slate-800">Quản lý phòng trọ</h1>
                <p className="text-sm text-slate-500 mt-1">Danh sách và trạng thái các đơn đặt phòng/đặt hàng.</p>
              </div>
            }
          />

          <Route
            path="settings"
            element={
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <h1 className="text-xl font-bold text-slate-800">Cài đặt hệ thống</h1>
                <p className="text-sm text-slate-500 mt-1">Cấu hình tham số và tùy chọn hệ thống.</p>
              </div>
            }
          />
        </Route>
      </Route>

      {/* Login */}
      <Route element={<AdminGuestRoute />}>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>
    </Route>

  </>
);

export default AdminRoutes;
