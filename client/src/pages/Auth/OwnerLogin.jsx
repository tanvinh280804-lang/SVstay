import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { ownerLogin } from "../../services/Auth/OwnerLogin.service";

const inputClass =
  "h-11 w-full rounded-lg bg-[#F7F7F3] pl-10 pr-4 text-sm text-[#19211D] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20";

const passwordInputClass =
  "h-11 w-full rounded-lg bg-[#F7F7F3] pl-10 pr-11 text-sm text-[#19211D] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20";

const ownerHighlights = [
  "Đăng tin và quản lý phòng trọ trên cùng một giao diện",
  "Tiếp nhận yêu cầu liên hệ từ sinh viên đã xác thực",
  "Theo dõi phòng trống, hợp đồng và doanh thu rõ ràng",
];

export default function OwnerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      toast.warning("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      const response = await ownerLogin(payload);
      toast.success("Đăng nhập thành công! Chào mừng Chủ trọ.");
      console.log("Owner login response:", response);

      navigate("/owner/rooms");
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

  // Nút điền nhanh tài khoản mẫu đã seed
  const fillSampleAccount = () => {
    setForm({
      email: "owner@svstay.com",
      password: "123456",
    });
    toast.info("Đã điền tài khoản mẫu!");
  };

  return (
    <main
      className="min-h-screen w-full bg-[#F5F5F0] py-8 lg:py-12"
      style={{ fontFamily: '"Be Vietnam Pro", Inter, system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold">
          <Link to="/" className="flex items-center gap-1 text-[#526159] transition hover:text-[#0F382C]">
            <ArrowLeft size={16} />
            Trang chủ
          </Link>
          <span className="text-[#E2E8E4]">/</span>
          <span className="text-[#4F5A54]">Đăng nhập Chủ nhà</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Cột trái: form đăng nhập chủ nhà */}
          <section className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-7 lg:p-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-[#b8eed8]/30 blur-3xl" />

            <div className="relative z-10 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">Cổng dành cho Chủ nhà</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19211D] sm:text-[28px] sm:leading-9">
                Đăng nhập dành cho Chủ nhà
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#4F5A54]">
                Quản lý phòng trọ, khách thuê và doanh thu hiệu quả cùng SVstay.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <div>
                <label htmlFor="ownerEmail" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                  <input
                    id="ownerEmail"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ownerPassword" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                  Mật khẩu
                </label>
                <div className="relative">
                  <LockKeyhole size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                  <input
                    id="ownerPassword"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={passwordInputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#174C3C] text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-[#0f362a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Building2 size={20} />
                      ĐĂNG NHẬP CHỦ TRỌ
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="relative z-10 mt-5 flex flex-col gap-3 border-t border-[#E8ECE9] pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={fillSampleAccount}
                className="self-start font-semibold text-[#174C3C] hover:underline"
              >
                Điền tài khoản mẫu
              </button>
              <span className="text-[#707974]">Hỗ trợ Chủ trọ: 1900 8888</span>
            </div>

            <p className="relative z-10 mt-4 text-center text-xs text-[#4F5A54]">
              Bạn là sinh viên?{" "}
              <Link to="/customer/login" className="font-semibold text-[#174C3C] hover:underline">
                Đăng nhập tài khoản khách hàng
              </Link>
            </p>
          </section>

          {/* Cột phải: panel xanh */}
          <aside className="relative hidden flex-col justify-between overflow-hidden rounded-xl bg-[#0F382C] p-8 text-white lg:col-span-5 lg:flex">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#174C3C]/50 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#174C3C]/40 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Building2 size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-none tracking-tight">SVstay</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/80">
                    Dành cho Chủ nhà
                  </span>
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                <BadgeCheck size={14} />
                Quản lý cho thuê minh bạch, hiệu quả
              </div>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight">
                Quản lý phòng trọ và khách thuê tại một nơi.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">
                Đăng tin, cập nhật giá điện nước và theo dõi yêu cầu từ sinh viên — tất cả trên SVstay Owner.
              </p>

              <ul className="mt-8 space-y-3.5">
                {ownerHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-emerald-50/90">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-10 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-emerald-50/70">
              <ShieldCheck size={15} className="text-emerald-300" />
              Thông tin chủ trọ được bảo mật · Hỗ trợ 1900 8888
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
