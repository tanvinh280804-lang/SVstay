import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, PlusCircle, LogOut, ChevronDown, BadgeCheck } from "lucide-react";
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

  const displayName = ownerInfo?.full_name || ownerInfo?.fullName || "Chủ trọ";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E2E8E4] bg-white px-4 shadow-sm md:px-6">
      {/* Nút toggle Sidebar & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#526159] transition hover:bg-[#F7F7F3] hover:text-[#174C3C]"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sm text-[#707974]">
          <span className="font-semibold text-[#174C3C]">Chủ trọ</span>
          <span className="text-[#C4CDC7]">/</span>
          <strong className="font-semibold text-[#19211D]">Quản lý phòng trọ</strong>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Nút đăng phòng nhanh */}
        <Link
          to="/owner/rooms/create"
          className="hidden items-center gap-1.5 rounded-xl bg-[#174C3C] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0F382C] sm:inline-flex sm:text-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Đăng phòng mới</span>
        </Link>

        {/* Khối Profile của Chủ trọ */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 border-l border-[#E2E8E4] pl-2 text-left transition hover:opacity-85 md:pl-3"
          >
            {ownerInfo?.avatar ? (
              <img
                src={ownerInfo.avatar}
                alt={displayName}
                className="h-9 w-9 shrink-0 rounded-full border-2 border-[#174C3C]/20 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#174C3C]/20 bg-[#ECEEE7] text-sm font-bold text-[#174C3C]">
                {getInitials(displayName)}
              </div>
            )}

            <div className="hidden flex-col text-left sm:flex">
              <strong className="text-sm font-semibold leading-tight text-[#19211D]">
                {displayName}
              </strong>
              <span className="text-xs font-medium leading-tight text-[#174C3C]">
                Chủ nhà xác thực
              </span>
            </div>

            <ChevronDown
              className={`hidden h-4 w-4 text-[#7B857F] transition-transform duration-200 sm:block ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-[#E2E8E4] bg-white py-2 shadow-xl">
              <div className="border-b border-[#EEF1ED] px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-medium text-[#707974]">
                  <BadgeCheck size={13} className="text-[#EA580C]" />
                  Tài khoản Chủ trọ
                </p>
                <p className="mt-0.5 truncate text-sm font-bold text-[#19211D]">{displayName}</p>
                {ownerInfo?.email && (
                  <p className="mt-0.5 truncate text-xs text-[#4F5A54]">{ownerInfo.email}</p>
                )}
                {(ownerInfo?.phone_number || ownerInfo?.phoneNumber) && (
                  <p className="mt-0.5 truncate text-xs text-[#707974]">
                    SĐT: {ownerInfo.phone_number || ownerInfo.phoneNumber}
                  </p>
                )}
              </div>

              <Link
                to="/owner/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-[#34443C] transition hover:bg-[#FAFAF6] hover:text-[#174C3C]"
              >
                Hồ sơ cá nhân
              </Link>

              <div className="pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[#B91C1C] transition hover:bg-[#FEF2F2]"
                >
                  <LogOut className="h-4 w-4" />
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
