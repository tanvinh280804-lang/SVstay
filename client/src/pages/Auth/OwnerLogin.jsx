import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, Building2, Loader2, ArrowLeft } from "lucide-react";
import { ownerLogin } from "../../services/Auth/OwnerLogin.service";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
            <Building2 className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Cổng Đăng Nhập Chủ Trọ
          </h1>

          <p className="text-slate-500 mt-2 text-xs sm:text-sm">
            Quản lý phòng trọ, khách thuê và doanh thu hiệu quả cùng SVStay.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="owner@svstay.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>ĐĂNG NHẬP CHỦ TRỌ</span>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={fillSampleAccount}
            className="text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            Điền tài khoản mẫu
          </button>
          <span className="text-slate-400">Hỗ trợ: 1900 8888</span>
        </div>
      </div>
    </div>
  );
}
