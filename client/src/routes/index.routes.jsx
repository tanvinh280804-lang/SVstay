import { Routes, Route, Navigate } from "react-router-dom";

import AdminRoutes from "./Admin.routes";
// import CustomerRoutes from "./Customer.routes";
// import OwnerRoutes from "./Owner.routes";

function IndexRoutes() {
  return (
    <Routes>
      {AdminRoutes}

      {/* {CustomerRoutes}

      {OwnerRoutes} */}

      {/* Route không tồn tại */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default IndexRoutes;