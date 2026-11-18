import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Building2, UserRound, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import {
  CUSTOMER_AUTH_CHANGE_EVENT,
  customerLogout,
  getCurrentCustomer,
  isCustomerAuthenticated,
} from "../../../services/Auth/CustomerAuth.service";

const navLinks = [
  { title: "Trang chủ", path: "/" },
  { title: "Tìm phòng trọ", path: "/rooms" },
];

const getInitials = (name = "") => name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "KH";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [customer, setCustomer] = useState(() => isCustomerAuthenticated() ? getCurrentCustomer() : null);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const refreshCustomer = () => setCustomer(isCustomerAuthenticated() ? getCurrentCustomer() : null);
    const closeOnOutsideClick = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) setAccountMenuOpen(false);
    };
    window.addEventListener(CUSTOMER_AUTH_CHANGE_EVENT, refreshCustomer);
    window.addEventListener("storage", refreshCustomer);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      window.removeEventListener(CUSTOMER_AUTH_CHANGE_EVENT, refreshCustomer);
      window.removeEventListener("storage", refreshCustomer);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    customerLogout();
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    toast.success("Bạn đã đăng xuất tài khoản khách hàng.");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8E4] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#174C3C] text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Be Vietnam Pro'] text-xl font-bold leading-none tracking-tight text-[#174C3C]">SVstay</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#526159]">Phòng trọ sinh viên</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? "font-semibold text-[#174C3C]" : "text-[#4F5A54] hover:text-[#174C3C]"}`}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {customer ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                aria-expanded={accountMenuOpen}
                aria-label="Mở menu tài khoản khách hàng"
                className="flex items-center gap-2 rounded-full border border-[#D1DDD6] bg-white p-1.5 pr-2.5 text-[#34443C] shadow-sm transition hover:border-[#174C3C] hover:bg-[#F2F5F3]"
              >
                {customer.avatar ? <img src={customer.avatar} alt="Ảnh đại diện" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#174C3C] text-sm font-bold text-white">{getInitials(customer.full_name)}</span>}
                <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">{customer.full_name || "Tài khoản"}</span>
                <ChevronDown className={`hidden h-4 w-4 text-[#707974] transition-transform sm:block ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-[#E2E8E4] bg-white py-2 shadow-xl">
                  <div className="border-b border-[#E8ECE9] px-4 py-3">
                    <p className="text-xs text-[#707974]">Tài khoản khách hàng</p>
                    <p className="mt-0.5 truncate text-sm font-bold text-[#19211D]">{customer.full_name}</p>
                    <p className="truncate text-xs text-[#4F5A54]">{customer.email}</p>
                  </div>
                  <Link to="/customer/account" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-[#34443C] hover:bg-[#F2F5F3]">Hồ sơ của tôi</Link>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" />Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/customer/login" className="hidden px-3 py-2 text-sm font-medium text-[#4F5A54] transition-colors hover:text-[#174C3C] sm:inline-flex">Đăng nhập</Link>
              <Link to="/customer/register" className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D1DDD6] bg-[#EBF2EE] px-4 text-sm font-medium text-[#174C3C] transition-colors hover:bg-[#DEE7E2]">
                <UserRound className="h-4 w-4" />
                Đăng ký
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4F5A54] transition hover:bg-[#F2F5F3] md:hidden"
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#E2E8E4] bg-white px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-[#E1EAE5] text-[#174C3C]" : "text-[#4F5A54] hover:bg-[#F2F5F3]"}`}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
          {customer && (
            <div className="mt-3 border-t border-[#E8ECE9] pt-3">
              <Link to="/customer/account" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#34443C] hover:bg-[#F2F5F3]">Hồ sơ khách hàng</Link>
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4" />Đăng xuất</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
