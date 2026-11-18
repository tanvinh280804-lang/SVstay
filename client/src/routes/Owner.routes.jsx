import { Navigate, Route } from "react-router-dom";
import OwnerLayout from "../layouts/OwnerLayout";
import OwnerLogin from "../pages/Auth/OwnerLogin";
import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import RoomList from "../pages/Owner/RoomList";
import RoomForm from "../pages/Owner/RoomForm";
import OwnerProfile from "../pages/Owner/OwnerProfile";
import { OwnerGuestRoute, OwnerPrivateRoute } from "../utils/guards/owner.guard";

const OwnerRoutes = (
  <>
    <Route element={<OwnerGuestRoute />}>
      <Route path="/owner/login" element={<OwnerLogin />} />
    </Route>
    <Route element={<OwnerPrivateRoute />}>
      <Route path="/owner" element={<OwnerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="profile" element={<OwnerProfile />} />
        <Route path="rooms" element={<RoomList />} />
        <Route path="rooms/create" element={<RoomForm />} />
        <Route path="rooms/edit/:roomId" element={<RoomForm />} />
      </Route>
    </Route>
  </>
);

export default OwnerRoutes;
