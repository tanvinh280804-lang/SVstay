import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Bell, LogIn, LogOut, User, Shield, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import {
  getCurrentAdmin,
  isAdminAuthenticated,
  adminLogout,
} from "../../../services/Auth/AdminLogin.service";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [adminInfo, setAdminInfo] = useState(() => getCurrentAdmin());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);

  // Kiểm tra token và load thông tin admin_info khi chuyển route
  useEffect(() => {
    const timer = setTimeout(() => {
      const isAuth = isAdminAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setAdminInfo(getCurrentAdmin());
        setImageError(false);
      } else {
        setAdminInfo(null);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    setAdminInfo(null);
    setDropdownOpen(false);
    toast.info("Đã đăng xuất khỏi tài khoản quản trị.");
    navigate("/admin/login");
  };

  // Xác định danh xưng vai trò (Role)
  const getRoleLabel = (role) => {
    if (role === 2 || role === "2" || role === "SUPERADMIN") return "Super Admin";
    if (role === 1 || role === "1" || role === "ADMIN") return "Admin";
    return "Quản trị viên";
  };

  // Lấy ký tự đại diện cho avatar nếu không có ảnh
  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Nút toggle Sidebar & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Admin</span>
          <span className="text-slate-300">/</span>
          <strong className="font-semibold text-slate-800">
            {location.pathname.includes("/admin/profile")
              ? "Hồ sơ"
              : location.pathname.includes("/admin/room-types")
              ? "Loại phòng"
              : location.pathname.includes("/admin/rooms")
              ? "Phòng trọ"
              : location.pathname.includes("/admin/users")
              ? "Người dùng"
              : location.pathname.includes("/admin/settings")
              ? "Cài đặt"
              : "Dashboard"}
          </strong>
        </div>
      </div>

      {/* Khu vực thông tin bên phải */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Nút thông báo */}
        {isAuthenticated && (
          <button
            className="relative w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>
        )}

        {/* Khối tài khoản: ĐÃ ĐĂNG NHẬP vs CHƯA ĐĂNG NHẬP */}
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-2 md:pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity cursor-pointer text-left"
              aria-label="Admin Profile Menu"
            >
              {/* Avatar: hiển thị avatar_url nếu có, fallback initials */}
              {adminInfo?.avatar_url && !imageError ? (
                <img
                  src={adminInfo.avatar_url}
                  alt={adminInfo.username || "Admin"}
                  onError={() => setImageError(true)}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-200 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200 shrink-0">
                  {getInitials(adminInfo?.username)}
                </div>
              )}

              {/* Tên và Vai trò */}
              <div className="hidden sm:flex flex-col text-left">
                <strong className="text-sm font-semibold text-slate-800 leading-tight">
                  {adminInfo?.username || "Administrator"}
                </strong>
                <span className="text-xs text-indigo-600 font-medium leading-tight">
                  {getRoleLabel(adminInfo?.role)}
                </span>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden sm:block ${dropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-150">
                {/* Thông tin chi tiết */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Tài khoản đang đăng nhập</p>
                  <p className="text-sm font-bold text-slate-800 truncate mt-0.5">
                    {adminInfo?.username || "Admin"}
                  </p>
                  {adminInfo?.email && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {adminInfo.email}
                    </p>
                  )}
                  {adminInfo?.phone && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      SĐT: {adminInfo.phone}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{getRoleLabel(adminInfo?.role)}</span>
                  </div>
                </div>

                {/* Các nút hành động */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin/profile");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Hồ sơ cá nhân</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Trạng thái CHƯA ĐĂNG NHẬP */
          <div className="pl-2 md:pl-3 border-l border-slate-200">
            <button
              onClick={() => navigate("/admin/login")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm shadow-blue-500/25 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
