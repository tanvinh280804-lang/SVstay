import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { adminLogin } from "../../services/Auth/AdminLogin.service";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
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

        if (!form.username.trim() || !form.password.trim()) {
            toast.warning("Vui lòng nhập đầy đủ username và password!");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                username: form.username.trim(),
                password: form.password,
            };

            const response = await adminLogin(payload);
            toast.success("Đăng nhập thành công! Chào mừng Admin.");
            console.log("Login response:", response);

            navigate("/admin");
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
        <div className="relative min-h-screen flex items-center justify-center bg-[#121212] px-4 overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px]"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-[420px] bg-[#212529]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 sm:p-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 mb-6 transform transition-transform hover:scale-105 duration-300">
                        <ShieldCheck className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Admin Login
                    </h1>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản quản trị.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                            Username
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-300">
                                <User className="w-5 h-5" />
                            </span>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Nhập tên đăng nhập"
                                autoComplete="username"
                                className="w-full bg-[#121212]/80 hover:bg-[#121212] focus:bg-[#121212] border border-gray-700/50 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-3.5 text-gray-100 outline-none transition-all duration-300 shadow-inner focus:ring-4 focus:ring-blue-500/20 placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-gray-500 group-focus-within:text-blue-500 transition-colors duration-300">
                                <Lock className="w-5 h-5" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                autoComplete="current-password"
                                className="w-full bg-[#121212]/80 hover:bg-[#121212] focus:bg-[#121212] border border-gray-700/50 focus:border-blue-500 rounded-2xl pl-12 pr-12 py-3.5 text-gray-100 outline-none transition-all duration-300 shadow-inner focus:ring-4 focus:ring-blue-500/20 placeholder:text-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-2xl py-4 mt-2 transition-all duration-300 shadow-[0_8px_20px_rgb(59,130,246,0.2)] hover:shadow-[0_8px_25px_rgb(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Đang đăng nhập...</span>
                            </>
                        ) : (
                            <span>ĐĂNG NHẬP</span>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-800/50">
                    <p className="text-center text-gray-500 text-xs font-medium tracking-wider">
                        © 2026 SVStay Admin System
                    </p>
                </div>
            </div>
        </div>
    );
}