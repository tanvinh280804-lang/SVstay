import { Outlet } from "react-router-dom";
import { Globe } from "lucide-react";
import Header from "../components/layouts/Customer/Header";
import Footer from "../components/layouts/Customer/Footer";

const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F0] text-[#19211D]">
      <div className="hidden w-full border-b border-white/10 bg-[#113A2E] px-4 py-2 text-xs text-white/90 sm:block">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between">
          <span className="text-white/80">• Cam kết 100% không phát sinh phí môi giới</span>
          <span className="flex items-center gap-1 text-white/80">
            <Globe size={14} />
            Tiếng Việt
          </span>
        </div>
      </div>

      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLayout;
