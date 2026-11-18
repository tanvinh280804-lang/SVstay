import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { customerLogin, customerRegister } from "../../services/Auth/CustomerAuth.service";

const inputClass =
  "h-11 w-full rounded-lg bg-[#F7F7F3] pl-10 pr-4 text-sm text-[#19211D] outline-none transition placeholder:text-[#707974] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20";

const passwordInputClass =
  "h-11 w-full rounded-lg bg-[#F7F7F3] pl-10 pr-11 text-sm text-[#19211D] outline-none transition placeholder:text-[#707974] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20";

const highlights = [
  "Tin đăng được duyệt thủ công, hạn chế phòng ảo",
  "Giá điện nước và tiền cọc niêm yết rõ ràng",
  "Kết nối trực tiếp chủ nhà, không phí môi giới",
];

const getPasswordStrength = (value = "") => {
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
};

const strengthMeta = [
  { label: "Độ an toàn mật khẩu", bar: "bg-[#E8E9E3]", text: "text-[#526159]", active: 0 },
  { label: "Mật khẩu yếu", bar: "bg-[#ba1a1a]", text: "text-[#ba1a1a]", active: 1 },
  { label: "Mức độ trung bình", bar: "bg-[#ffb874]", text: "text-[#663800]", active: 2 },
  { label: "Mật khẩu khá an toàn", bar: "bg-[#9dd2bc]", text: "text-[#174C3C]", active: 3 },
  { label: "Mật khẩu rất mạnh & an toàn!", bar: "bg-[#174C3C]", text: "text-[#174C3C]", active: 4 },
];

export default function CustomerAuth({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone_number: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("student");

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRegister && role === "landlord") {
      toast.info("Đăng ký tài khoản Chủ nhà sẽ sớm được hỗ trợ. Hiện bạn có thể đăng nhập tại trang Chủ nhà.");
      return;
    }

    if (isRegister && form.password !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      const payload = isRegister
        ? { full_name: form.full_name.trim(), email: form.email.trim(), phone_number: form.phone_number.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };
      if (isRegister) await customerRegister(payload);
      else await customerLogin(payload);
      toast.success(isRegister ? "Tạo tài khoản khách hàng thành công." : "Đăng nhập thành công.");
      navigate("/rooms", { replace: true });
    } catch (error) {
      toast.error(error.message || (isRegister ? "Không thể đăng ký tài khoản." : "Không thể đăng nhập."));
    } finally {
      setLoading(false);
    }
  };

  const strength = strengthMeta[getPasswordStrength(form.password)];

  return (
    <main
      className="w-full bg-[#F5F5F0] py-8 lg:py-12"
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
          <span className="text-[#4F5A54]">{isRegister ? "Tạo tài khoản mới" : "Đăng nhập"}</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Cột trái: form (7 cols) */}
          <section className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-7 lg:p-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-[#b8eed8]/30 blur-3xl" />

            <div className="relative z-10 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">Tài khoản khách hàng</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#19211D] sm:text-[28px] sm:leading-9">
                {isRegister ? "Tạo tài khoản SVstay" : "Đăng nhập SVstay"}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#4F5A54]">
                {isRegister
                  ? "Bắt đầu hành trình tìm phòng trọ an tâm hoặc kết nối cho thuê với hàng nghìn sinh viên đại học."
                  : "Đăng nhập để tiếp tục hành trình tìm phòng trọ an tâm trên SVstay."}
              </p>
            </div>

            {isRegister && (
              <div className="relative z-10 mb-8 grid grid-cols-2 gap-1.5 rounded-xl bg-[#F2F5F3] p-1">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-2.5 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${role === "student" ? "bg-white font-semibold text-[#174C3C] shadow-sm" : "font-medium text-[#526159] hover:text-[#19211D]"}`}
                >
                  <GraduationCap size={20} />
                  Tôi là Sinh viên
                </button>
                <button
                  type="button"
                  onClick={() => setRole("landlord")}
                  className={`flex items-center justify-center gap-2.5 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${role === "landlord" ? "bg-white font-semibold text-[#174C3C] shadow-sm" : "font-medium text-[#526159] hover:text-[#19211D]"}`}
                >
                  <Building2 size={20} />
                  Tôi là Chủ nhà
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              {isRegister && (
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                    Họ và tên của bạn
                  </label>
                  <div className="relative">
                    <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                    <input
                      id="fullName"
                      required
                      minLength={2}
                      maxLength={100}
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              <div className={isRegister ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "space-y-4"}>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                    <input
                      id="email"
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className={inputClass}
                    />
                  </div>
                </div>

                {isRegister && (
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                      Số điện thoại Zalo / Liên hệ
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                      <input
                        id="phone"
                        required
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        autoComplete="tel"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>

              {isRegister && role === "landlord" && (
                <div>
                  <label htmlFor="propertyArea" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                    Khu vực nhà trọ chính
                  </label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                    <select
                      id="propertyArea"
                      className="h-11 w-full appearance-none rounded-lg bg-[#F7F7F3] pl-10 pr-9 text-sm text-[#19211D] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20"
                      defaultValue=""
                    >
                      <option value="">-- Chọn Quận/Huyện tập trung phòng --</option>
                      <option value="hbt">Hà Nội - Quận Hai Bà Trưng</option>
                      <option value="cg">Hà Nội - Quận Cầu Giấy</option>
                      <option value="dd">Hà Nội - Quận Đống Đa</option>
                      <option value="tx">Hà Nội - Quận Thanh Xuân</option>
                      <option value="q10">TP. Hồ Chí Minh - Quận 10</option>
                      <option value="td">TP. Hồ Chí Minh - TP. Thủ Đức</option>
                      <option value="bt">TP. Hồ Chí Minh - Quận Bình Thạnh</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#526159]">▾</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                  Mật khẩu {isRegister && <span className="font-normal text-[#526159]">· Ít nhất 8 ký tự, gồm số &amp; chữ hoa</span>}
                </label>
                <div className="relative">
                  <LockKeyhole size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                  <input
                    id="password"
                    required
                    minLength={isRegister ? 8 : undefined}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    placeholder="••••••••"
                    className={passwordInputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#526159] transition hover:text-[#19211D]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {isRegister && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((index) => (
                        <span
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-colors ${index < strength.active ? strength.bar : "bg-[#E8E9E3]"}`}
                        />
                      ))}
                    </div>
                    <p className={`mt-1.5 text-[11px] font-medium ${strength.text}`}>{strength.label}</p>
                  </div>
                )}
              </div>

              {isRegister && (
                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-[#19211D]">
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative">
                    <LockKeyhole size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526159]" />
                    <input
                      id="confirmPassword"
                      required
                      minLength={8}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={passwordInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((visible) => !visible)}
                      aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#526159] transition hover:text-[#19211D]"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {isRegister && (
                <div className="pt-2">
                  <label className="flex cursor-pointer select-none items-start gap-3">
                    <input required type="checkbox" className="mt-1 h-4 w-4 cursor-pointer rounded accent-[#174C3C]" />
                    <span className="text-xs leading-relaxed text-[#4F5A54]">
                      Tôi đồng ý với{" "}
                      <Link to="/terms" className="font-semibold text-[#174C3C] underline hover:text-[#0F382C]">
                        Điều khoản dịch vụ
                      </Link>{" "}
                      và{" "}
                      <Link to="/privacy" className="font-semibold text-[#174C3C] underline hover:text-[#0F382C]">
                        Chính sách bảo vệ thông tin sinh viên
                      </Link>{" "}
                      của SVstay.
                    </span>
                  </label>
                </div>
              )}

              <div className="pt-2">
                <button
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#174C3C] text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-[#0f362a] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <UserPlus size={20} />
                  )}
                  {isRegister
                    ? role === "landlord"
                      ? "Đăng ký tài khoản Chủ nhà / Cho thuê"
                      : "Đăng ký tài khoản Sinh viên"
                    : "Đăng nhập"}
                </button>
              </div>

              <div className="pt-3 text-center text-sm text-[#4F5A54]">
                {isRegister ? (
                  <>
                    Bạn đã có tài khoản trên SVstay?{" "}
                    <Link
                      to="/customer/login"
                      className="ml-1 font-semibold text-[#174C3C] hover:underline"
                    >
                      Đăng nhập ngay
                    </Link>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-[#E2E8E4] bg-[#F7F7F3] p-4 text-left">
                      <p className="text-sm font-semibold text-[#14261F]">Chưa có tài khoản SVstay?</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#4F5A54]">
                        Đăng ký để lưu thông tin, kết nối trực tiếp với chủ nhà và tìm phòng nhanh hơn.
                      </p>
                      <Link
                        to="/customer/register"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#174C3C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0f362a]"
                      >
                        Tạo tài khoản miễn phí
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                    <p className="text-xs text-[#4F5A54]">
                      Bạn là chủ nhà?{" "}
                      <Link to="/owner/login" className="font-semibold text-[#174C3C] hover:underline">
                        Đăng nhập tại đây
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* Cột phải: panel xanh (5 cols) */}
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
                    Phòng trọ sinh viên
                  </span>
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                <BadgeCheck size={14} />
                Nền tảng phòng trọ minh bạch #1 cho sinh viên
              </div>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight">
                {isRegister ? "Tìm phòng trọ an tâm, đăng ký chỉ 1 phút." : "Chào mừng bạn trở lại SVstay."}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50/80">
                {isRegister
                  ? "Tạo tài khoản để lưu thông tin, liên hệ chủ nhà nhanh chóng và theo dõi các phòng trọ phù hợp."
                  : "Đăng nhập để tiếp tục tìm kiếm, lưu thông tin và kết nối với chủ nhà uy tín."}
              </p>

              <ul className="mt-8 space-y-3.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-emerald-50/90">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mt-10 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-emerald-50/70">
              <ShieldCheck size={15} className="text-emerald-300" />
              Thông tin của bạn được bảo mật · Không phí môi giới
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
