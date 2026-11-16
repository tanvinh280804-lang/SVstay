import { Route } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Homepage from "../pages/Customer/Homepage";
import RoomBrowse from "../pages/Customer/RoomBrowse";
import RoomDetail from "../pages/Customer/RoomDetail";
import CustomerAuth from "../pages/Auth/CustomerAuth";
import CustomerAccount from "../pages/Customer/CustomerAccount";
import { CustomerGuestRoute, CustomerPrivateRoute } from "../utils/guards/customer.guard";

const CustomerRoutes = (
  <Route path="/" element={<CustomerLayout />}>
    <Route index element={<Homepage />} />
    <Route path="rooms" element={<RoomBrowse />} />
    <Route path="rooms/:idOrSlug" element={<RoomDetail />} />
    <Route element={<CustomerGuestRoute />}>
      <Route path="customer/login" element={<CustomerAuth />} />
      <Route path="customer/register" element={<CustomerAuth mode="register" />} />
    </Route>
    <Route element={<CustomerPrivateRoute />}>
      <Route path="customer/account" element={<CustomerAccount />} />
    </Route>
  </Route>
);

export default CustomerRoutes;
