import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { title: "Quản lý phòng trọ", icon: Building2, path: "/owner/rooms" },
  { title: "Đăng phòng mới", icon: PlusCircle, path: "/owner/rooms/create" },
  { title: "Tổng quan", icon: LayoutDashboard, path: "/owner/dashboard", end: true },
];

const Sidebar = ({ collapsed, toggleSidebar }) => {
  return (
    <aside
      className={`bg-slate-900 text-slate-200 flex flex-col shrink-0 min-h-screen transition-all duration-300 border-r border-slate-800 sticky top-0 h-screen select-none z-30 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Logo */}
      <div className={`h-16 flex items-center px-4 border-b border-slate-800 gap-3 justify-between ${collapsed ? "justify-center" : ""}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-lg text-white tracking-wide truncate">
                SV<span className="text-blue-500">stay</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                Dành cho Chủ trọ
              </span>
            </div>
          )}
        </div>

        {!collapsed && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
            title="Thu gọn"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <p className={`px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 h-4 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && "QUẢN LÝ PHÒNG"}
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
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <span className="shrink-0 flex items-center justify-center w-6">
                <Icon className="w-5 h-5" />
              </span>

              {!collapsed && (
                <span className="truncate font-semibold">
                  {item.title}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <NavLink
            to="/"
            target="_blank"
            title={collapsed ? "Xem trang sinh viên" : ""}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <span className="shrink-0 flex items-center justify-center w-6">
              <ExternalLink className="w-5 h-5" />
            </span>
            {!collapsed && <span className="truncate">Xem trang khách</span>}
          </NavLink>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 text-center whitespace-nowrap">
        {!collapsed ? (
          <span>Cổng Chủ Trọ v1.0</span>
        ) : (
          <span>v1.0</span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
