import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Package, Settings, ShieldCheck } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin", end: true },
  { title: "Người dùng", icon: Users, path: "/admin/users" },
  { title: "Loại phòng", icon: Package, path: "/admin/room-types" },
  { title: "Phòng trọ", icon: Package, path: "/admin/rooms" },
  { title: "Cài đặt", icon: Settings, path: "/admin/settings" },
];

const Sidebar = ({ collapsed }) => {
  return (
    <aside
      className={`bg-slate-900 text-slate-200 flex flex-col shrink-0 min-h-screen transition-all duration-300 border-r border-slate-800 sticky top-0 h-screen select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Logo */}
      <div className={`h-16 flex items-center px-4 border-b border-slate-800 gap-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
          <ShieldCheck className="w-6 h-6" />
        </div>

        {!collapsed && (
          <span className="font-bold text-lg text-white tracking-wide truncate">
            Admin Panel
          </span>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <p className={`px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 h-4 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && "MENU"}
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <span className="shrink-0 flex items-center justify-center w-6">
                <Icon className="w-5 h-5" />
              </span>

              {!collapsed && (
                <span className="truncate">
                  {item.title}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 text-center whitespace-nowrap">
        {!collapsed ? (
          <span>Admin Dashboard v1.0</span>
        ) : (
          <span>v1.0</span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
