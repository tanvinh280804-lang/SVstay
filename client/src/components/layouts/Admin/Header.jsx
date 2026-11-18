
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
    <header className="h-16 bg-white border-b border-[#E2E8E4] px-4 md:px-7 flex items-center justify-between sticky top-0 z-20 shadow-sm">

      {/* Nút toggle Sidebar & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-5 min-w-0">

        <button
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#707974] hover:text-[#174C3C] hover:bg-[#E7F0EB] transition-all duration-200 cursor-pointer"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[13px] min-w-0">
          <span className="text-[#8A948E] font-medium">
            Admin
          </span>

          <span className="text-[#C4CDC7]">/</span>

          <strong className="font-semibold text-[#34443C] truncate">
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
      <div className="flex items-center gap-3 md:gap-5 shrink-0">

        {/* Nút thông báo */}
        {isAuthenticated && (
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#707974] hover:text-[#174C3C] hover:bg-[#E7F0EB] transition-all duration-200 cursor-pointer"
            aria-label="Thông báo"
          >
            <Bell className="w-[19px] h-[19px]" />

            <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-[#EA580C] rounded-full ring-2 ring-white"></span>
          </button>
        )}

        {/* Khối tài khoản: ĐÃ ĐĂNG NHẬP vs CHƯA ĐĂNG NHẬP */}
        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-3 border-l border-[#E2E8E4] hover:opacity-80 transition-opacity cursor-pointer text-left"
              aria-label="Admin Profile Menu"
            >

              {/* Avatar */}
              {adminInfo?.avatar_url && !imageError ? (
                <img
                  src={adminInfo.avatar_url}
                  alt={adminInfo.username || "Admin"}
                  onError={() => setImageError(true)}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#C7DBD0] shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#E7F0EB] text-[#174C3C] font-bold text-sm flex items-center justify-center border border-[#C7DBD0] shrink-0">
                  {getInitials(adminInfo?.username)}
                </div>
              )}

              {/* Tên và Vai trò */}
              <div className="hidden sm:flex flex-col text-left gap-0.5">

                <strong className="text-[13px] font-semibold text-[#34443C] leading-tight">
                  {adminInfo?.username || "Administrator"}
                </strong>

                <span className="text-[11px] text-[#174C3C] font-medium leading-tight">
                  {getRoleLabel(adminInfo?.role)}
                </span>

              </div>

              <ChevronDown
                className={`w-4 h-4 text-[#8A948E] transition-transform duration-200 hidden sm:block ${dropdownOpen ? "rotate-180" : ""
                  }`}
              />

            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-[#E2E8E4] py-2 z-50 animate-in fade-in duration-150">

                {/* Thông tin chi tiết */}
                <div className="px-4 py-3 border-b border-[#EEF1ED]">

                  <p className="text-[11px] text-[#8A948E] font-medium">
                    Tài khoản đang đăng nhập
                  </p>

                  <p className="text-sm font-bold text-[#19211D] truncate mt-1">
                    {adminInfo?.username || "Admin"}
                  </p>

                  {adminInfo?.email && (
                    <p className="text-xs text-[#707974] truncate mt-1">
                      {adminInfo.email}
                    </p>
                  )}

                  {adminInfo?.phone && (
                    <p className="text-xs text-[#8A948E] truncate mt-1">
                      SĐT: {adminInfo.phone}
                    </p>
                  )}

                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#E7F0EB] text-[#174C3C] border border-[#C7DBD0]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{getRoleLabel(adminInfo?.role)}</span>
                  </div>

                </div>

                {/* Các nút hành động */}
                <div className="pt-1.5">

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left text-[13px] text-[#526159] hover:bg-[#E7F0EB] hover:text-[#174C3C] flex items-center gap-3 transition-colors cursor-pointer font-medium"
                  >
                    <User className="w-4 h-4 text-[#8A948E]" />
                    <span>Hồ sơ cá nhân</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-[13px] text-[#B45309] hover:bg-[#FFF7ED] flex items-center gap-3 transition-colors cursor-pointer font-medium"
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
          <div className="pl-3 border-l border-[#E2E8E4]">

            <button
              onClick={() => navigate("/admin/login")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#174C3C] text-white hover:bg-[#0F382C] transition-all duration-200 shadow-sm shadow-sm cursor-pointer"
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
