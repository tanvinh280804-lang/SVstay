import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Customer/Header";
import Footer from "../components/layouts/Customer/Footer";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLayout;
