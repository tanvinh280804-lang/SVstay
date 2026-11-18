import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Building2,
  UserRound,
  Settings,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  {
    title: "Tổng quan & Thống kê",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    end: true,
  },
  { title: "Người dùng", icon: Users, path: "/admin/users" },
  { title: "Loại phòng", icon: Package, path: "/admin/room-types" },
  { title: "Phòng trọ", icon: Building2, path: "/admin/rooms" },
  { title: "Hồ sơ Admin", icon: UserRound, path: "/admin/profile" },
  { title: "Cài đặt", icon: Settings, path: "/admin/settings" },
];

const Sidebar = ({ collapsed, toggleSidebar }) => {
  return (
    <aside
      className={`sticky top-0 z-30 flex h-screen min-h-screen shrink-0 flex-col border-r border-[#E2E8E4] bg-[#F5F5F0] text-[#19211D] transition-all duration-300 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Logo */}
      <div
        className={`flex h-16 items-center justify-between gap-3 border-b border-[#E2E8E4] px-4 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#174C3C] text-white shadow-sm ring-1 ring-[#0F382C]">
            <ShieldCheck className="h-6 w-6" />
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="truncate text-lg font-extrabold tracking-wide text-[#174C3C]">
                SVstay
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#B45309]">
                <span className="h-1 w-1 rounded-full bg-[#EA580C]" />
                Khu vực Quản trị
              </span>
            </div>
          )}
        </div>

        {!collapsed && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#707974] transition hover:bg-[#ECEEE7] hover:text-[#174C3C]"
            title="Thu gọn"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
        <p
          className={`mb-2 h-4 px-3 text-[11px] font-bold uppercase tracking-wider text-[#8A948E] ${
            collapsed ? "text-center" : ""
          }`}
        >
          {!collapsed && "BẢNG ĐIỀU KHIỂN ADMIN"}
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              title={collapsed ? item.title : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#E7F0EB] text-[#174C3C] ring-1 ring-[#C7DBD0]"
                    : "text-[#526159] hover:bg-[#ECEEE7] hover:text-[#174C3C]"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex w-6 shrink-0 items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </span>
                  {!collapsed && (
                    <span className="flex flex-1 items-center gap-2 truncate font-semibold">
                      {isActive ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
                      ) : null}
                      {item.title}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="mt-4 border-t border-[#E2E8E4] pt-4">
          <NavLink
            to="/"
            target="_blank"
            title={collapsed ? "Xem trang sinh viên" : ""}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#526159] transition hover:bg-[#ECEEE7] hover:text-[#174C3C] ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <span className="flex w-6 shrink-0 items-center justify-center">
              <ExternalLink className="h-5 w-5" />
            </span>
            {!collapsed && <span className="truncate">Xem trang khách</span>}
          </NavLink>
        </div>
      </div>

      {/* Footer Info */}
      <div className="whitespace-nowrap border-t border-[#E2E8E4] p-4 text-center text-xs text-[#8A948E]">
        {!collapsed ? <span>SVstay Admin v1.0</span> : <span>v1.0</span>}
      </div>
    </aside>
  );
};

export default Sidebar;
