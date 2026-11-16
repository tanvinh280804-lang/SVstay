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
  { title: "Khu vực phổ biến", path: "/popular-areas" },
  { title: "Giới thiệu", path: "/about" },
  { title: "Bảng tin", path: "/news" },
  { title: "Liên hệ", path: "/contact" },
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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-xs backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-4">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105"><Building2 className="h-5 w-5"/></div>
            <span className="text-2xl font-extrabold leading-none tracking-tight text-slate-800">SV<span className="text-blue-600">stay</span></span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
            {navLinks.map((item) => <NavLink key={item.path} to={item.path} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive ? "bg-blue-50/80 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"}`}>{item.title}</NavLink>)}
          </nav>

          <div className="flex items-center gap-2">
            {customer ? (
              <div className="relative" ref={accountMenuRef}>
                <button type="button" onClick={() => setAccountMenuOpen((open) => !open)} aria-expanded={accountMenuOpen} aria-label="Mở menu tài khoản khách hàng" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pr-2.5 text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50">
                  {customer.avatar ? <img src={customer.avatar} alt="Ảnh đại diện" className="h-9 w-9 rounded-full object-cover"/> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{getInitials(customer.full_name)}</span>}
                  <span className="hidden max-w-32 truncate text-sm font-semibold sm:block">{customer.full_name || "Tài khoản"}</span>
                  <ChevronDown className={`hidden h-4 w-4 text-slate-400 transition-transform sm:block ${accountMenuOpen ? "rotate-180" : ""}`}/>
                </button>
                {accountMenuOpen && <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-3"><p className="text-xs text-slate-400">Tài khoản khách hàng</p><p className="mt-0.5 truncate text-sm font-bold text-slate-800">{customer.full_name}</p><p className="truncate text-xs text-slate-500">{customer.email}</p></div>
                  <Link to="/customer/account" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Hồ sơ của tôi</Link>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4"/>Đăng xuất</button>
                </div>}
              </div>
            ) : (
              <Link to="/customer/login" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-bold text-white shadow-sm shadow-blue-500/25 transition hover:bg-blue-700 sm:px-4"><UserRound className="h-4 w-4"/><span>Đăng nhập</span></Link>
            )}
            <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 lg:hidden" aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}>{mobileMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}</button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 lg:hidden"><nav className="flex flex-col gap-1">{navLinks.map((item) => <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>{item.title}</NavLink>)}</nav>{customer && <div className="mt-3 border-t border-slate-100 pt-3"><Link to="/customer/account" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hồ sơ khách hàng</Link><button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"><LogOut className="h-4 w-4"/>Đăng xuất</button></div>}</div>}
    </header>
  );
};

export default Header;
