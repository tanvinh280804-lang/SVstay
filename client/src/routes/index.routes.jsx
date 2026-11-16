import { Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "./Admin.routes";
import CustomerRoutes from "./Customer.Route";
import OwnerRoutes from "./Owner.routes";

function IndexRoutes() {
  return (
    <Routes>
      {/* Route dành cho Admin */}
      {AdminRoutes}

      {/* Route dành cho Customer */}
      {CustomerRoutes}

      {/* Route dành cho Owner */}
      {OwnerRoutes}

      {/* Route không tồn tại: chuyển về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default IndexRoutes;
