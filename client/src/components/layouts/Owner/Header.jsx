import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, PlusCircle, LogOut, ChevronDown, User, Building } from "lucide-react";
import { toast } from "react-toastify";
import {
  getCurrentOwner,
  ownerLogout,
  isOwnerAuthenticated,
  OWNER_PROFILE_CHANGE_EVENT,
} from "../../../services/Auth/OwnerLogin.service";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const refreshOwner = () => setOwnerInfo(isOwnerAuthenticated() ? getCurrentOwner() : null);
    refreshOwner();
    window.addEventListener(OWNER_PROFILE_CHANGE_EVENT, refreshOwner);
    window.addEventListener("storage", refreshOwner);
    return () => {
      window.removeEventListener(OWNER_PROFILE_CHANGE_EVENT, refreshOwner);
      window.removeEventListener("storage", refreshOwner);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    ownerLogout();
    toast.info("Đã đăng xuất khỏi tài khoản Chủ trọ.");
    navigate("/owner/login");
  };

  const getInitials = (name) => {
    if (!name) return "CT";
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
          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-blue-600">Chủ trọ</span>
          <span className="text-slate-300">/</span>
          <strong className="font-semibold text-slate-800">Quản lý phòng trọ</strong>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Nút đăng phòng nhanh */}
        <Link
          to="/owner/rooms/create"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng phòng mới</span>
        </Link>

        {/* Khối Profile của Chủ trọ */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-2 md:pl-3 border-l border-slate-200 hover:opacity-85 transition cursor-pointer text-left"
          >
            {ownerInfo?.avatar ? (
              <img
                src={ownerInfo.avatar}
                alt={ownerInfo.full_name || ownerInfo.fullName || "Chủ trọ"}
                className="w-9 h-9 rounded-full object-cover border border-blue-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200 shrink-0">
                {getInitials(ownerInfo?.full_name || ownerInfo?.fullName)}
              </div>
            )}

            <div className="hidden sm:flex flex-col text-left">
              <strong className="text-sm font-semibold text-slate-800 leading-tight">
                {ownerInfo?.full_name || ownerInfo?.fullName || "Chủ trọ"}
              </strong>
              <span className="text-xs text-blue-600 font-medium leading-tight">
                Chủ nhà xác thực
              </span>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden sm:block ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Tài khoản Chủ trọ</p>
                <p className="text-sm font-bold text-slate-800 truncate mt-0.5">
                  {ownerInfo?.full_name || ownerInfo?.fullName || "Chủ trọ"}
                </p>
                {ownerInfo?.email && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {ownerInfo.email}
                  </p>
                )}
                {(ownerInfo?.phone_number || ownerInfo?.phoneNumber) && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    SĐT: {ownerInfo.phone_number || ownerInfo.phoneNumber}
                  </p>
                )}
              </div>

              <Link to="/owner/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Hồ sơ cá nhân
              </Link>

              <div className="pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
