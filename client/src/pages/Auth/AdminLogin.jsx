import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Loader2,
} from "lucide-react";
import { adminLogin } from "../../services/Auth/AdminLogin.service";

const inputClass =
  "h-11 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F7F3] pl-10 pr-3 text-sm text-[#19211D] outline-none transition placeholder:text-[#8A948E] focus:border-[#174C3C] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/10";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      toast.warning("Vui lòng nhập đầy đủ username và password!");
      return;
    }

    try {
      setLoading(true);
      await adminLogin({
        username: form.username.trim(),
        password: form.password,
      });
      toast.success("Đăng nhập thành công! Chào mừng Admin.");
      navigate("/admin/dashboard");
    } catch (err) {
      const errorMsg =
        err.message ||
        err.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen w-full bg-[#F5F5F0] py-8 lg:py-12"
      style={{ fontFamily: '"Be Vietnam Pro", Inter, system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold">
          <Link
            to="/"
            className="flex items-center gap-1 text-[#526159] transition hover:text-[#0F382C]"
          >
            <ArrowLeft size={16} />
            Trang chủ
          </Link>
          <span className="text-[#E2E8E4]">/</span>
          <span className="text-[#4F5A54]">Đăng nhập Quản trị</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <section className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-7 lg:p-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-[#b8eed8]/30 blur-3xl" />

            <div className="relative z-10 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                Khu vực Quản trị
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19211D] sm:text-[28px] sm:leading-9">
                Đăng nhập dành cho Admin
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#4F5A54]">
                Quản lý người dùng, duyệt phòng và giám sát toàn bộ hệ thống SVstay.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <div>
                <label
                  htmlFor="adminUsername"
                  className="mb-1.5 block text-xs font-semibold text-[#19211D]"
                >
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]"
                  />
                  <input
                    id="adminUsername"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="adminPassword"
                  className="mb-1.5 block text-xs font-semibold text-[#19211D]"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]"
                  />
                  <input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#526159] transition hover:text-[#19211D]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#174C3C] text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-[#0F382C] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      ĐĂNG NHẬP ADMIN
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="relative z-10 mt-5 text-center text-xs text-[#4F5A54]">
              Bạn là Chủ trọ?{" "}
              <Link
                to="/owner/login"
                className="font-semibold text-[#174C3C] hover:underline"
              >
                Đăng nhập cổng Chủ trọ
              </Link>
            </p>
          </section>

          <aside className="relative hidden flex-col justify-between overflow-hidden rounded-xl bg-[#0F382C] p-8 text-white lg:col-span-5 lg:flex">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#174C3C]/50 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#174C3C]/40 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-none tracking-tight">SVstay</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/80">
                    Khu vực Quản trị
                  </span>
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                <ShieldCheck size={14} />
                Kiểm duyệt & giám sát hệ thống
              </div>

              <h2 className="mt-5 text-2xl font-bold leading-snug">
                Giữ cho hệ thống{" "}
                <span className="text-[#b8eed8]">minh bạch & an toàn.</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Kiểm duyệt tin đăng, quản lý tài khoản và đảm bảo trải nghiệm tìm phòng của
                sinh viên luôn đáng tin cậy.
              </p>
            </div>

            <div className="relative mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center">
              {[
                ["Duyệt phòng", "Kiểm tra tin"],
                ["Người dùng", "Sinh viên & chủ trọ"],
                ["Loại phòng", "Phân loại hệ thống"],
              ].map(([title, subtitle]) => (
                <div key={title} className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
                  <p className="text-xs font-bold text-white">{title}</p>
                  <p className="mt-1 text-[10px] text-white/60">{subtitle}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
