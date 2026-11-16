import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Building2, Loader2, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { customerLogin, customerRegister } from "../../services/Auth/CustomerAuth.service";

export default function CustomerAuth({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone_number: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
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

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white bg-white p-7 shadow-xl shadow-blue-900/10 sm:p-9">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"><ArrowLeft className="h-4 w-4"/>Về trang chủ</Link>
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25"><Building2 className="h-7 w-7"/></div>
          <p className="text-sm font-bold text-blue-700">Tài khoản khách hàng</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{isRegister ? "Tạo tài khoản SVstay" : "Chào mừng bạn trở lại"}</h1>
          <p className="mt-2 text-sm text-slate-500">{isRegister ? "Đăng ký để lưu thông tin và thuận tiện khi tìm phòng." : "Đăng nhập để tiếp tục trải nghiệm tìm phòng."}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && <>
            <label className="relative block"><span className="sr-only">Họ và tên</span><UserRound className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"/><input required minLength={2} maxLength={100} name="full_name" value={form.full_name} onChange={handleChange} placeholder="Họ và tên" autoComplete="name" className={inputClass}/></label>
            <label className="relative block"><span className="sr-only">Số điện thoại</span><Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"/><input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Số điện thoại (không bắt buộc)" autoComplete="tel" className={inputClass}/></label>
          </>}
          <label className="relative block"><span className="sr-only">Email</span><Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"/><input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" autoComplete="email" className={inputClass}/></label>
          <label className="relative block"><span className="sr-only">Mật khẩu</span><LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"/><input required minLength={isRegister ? 8 : undefined} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mật khẩu" autoComplete={isRegister ? "new-password" : "current-password"} className={inputClass}/></label>
          {isRegister && <label className="relative block"><span className="sr-only">Xác nhận mật khẩu</span><LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-slate-400"/><input required minLength={8} type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu" autoComplete="new-password" className={inputClass}/></label>}
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin"/>}{isRegister ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">{isRegister ? "Đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}<Link className="font-bold text-blue-700 hover:underline" to={isRegister ? "/customer/login" : "/customer/register"}>{isRegister ? "Đăng nhập" : "Đăng ký"}</Link></p>
      </section>
    </main>
  );
}
