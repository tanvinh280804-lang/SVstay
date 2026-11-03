import { Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";

const AdminRoutes = (
  <>
    <Route path="/admin" element={<AdminLayout />}>
      {/* Dashboard */}
      <Route index element={<Dashboard />} />

      {/* Quản lý người dùng */}
      <Route
        path="users"
        element={
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-800">Quản lý người dùng</h1>
            <p className="text-sm text-slate-500 mt-1">Danh sách và thông tin người dùng trong hệ thống.</p>
          </div>
        }
      />

      {/* Quản lý sản phẩm */}
      <Route
        path="products"
        element={
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-800">Quản lý sản phẩm</h1>
            <p className="text-sm text-slate-500 mt-1">Danh sách và quản lý các sản phẩm, phòng nghỉ.</p>
          </div>
        }
      />

      {/* Quản lý đơn hàng */}
      <Route
        path="orders"
        element={
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h1 className="text-xl font-bold text-slate-800">Quản lý đơn hàng</h1>
            <p className="text-sm text-slate-500 mt-1">Danh sách và trạng thái các đơn đặt phòng/đặt hàng.</p>
          </div>
        }
      />

      {/* Cài đặt */}
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
  </>
);

export default AdminRoutes;
