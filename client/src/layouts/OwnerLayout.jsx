import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Owner/Sidebar";
import Header from "../components/layouts/Owner/Header";
import Footer from "../components/layouts/Owner/Footer";

const OwnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default OwnerLayout;
