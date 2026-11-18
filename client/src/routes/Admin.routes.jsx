import { Navigate, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import AdminLogin from "../pages/Auth/AdminLogin";
import Profile from "../pages/Admin/Profile";
import RoomTypes from "../pages/Admin/RoomTypes";
import Rooms from "../pages/Admin/Rooms";
import Users from "../pages/Admin/Users";

import { AdminGuestRoute, AdminPrivateRoute } from '../utils/guards/admin.guard.jsx'

const AdminRoutes = (
  <>
    <Route>
      <Route element={<AdminPrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:adminId" element={<Profile />} />

          <Route path="users" element={<Users />} />

          <Route path="room-types" element={<RoomTypes />} />

          <Route path="rooms" element={<Rooms />} />

          <Route
            path="settings"
            element={
              <div className="rounded-2xl border border-[#E2E8E4] bg-white p-6 shadow-sm">
                <h1 className="text-xl font-bold text-[#19211D]">Cài đặt hệ thống</h1>
                <p className="mt-1 text-sm text-[#707974]">Cấu hình tham số và tùy chọn hệ thống.</p>
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
