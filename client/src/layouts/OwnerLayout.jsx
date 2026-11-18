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
    <div
      className="flex min-h-screen bg-[#F5F5F0] text-[#19211D]"
      style={{ fontFamily: '"Be Vietnam Pro", Inter, system-ui, sans-serif' }}
    >
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default OwnerLayout;
