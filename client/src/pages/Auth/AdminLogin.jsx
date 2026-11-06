
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../Services/Auth/AdminLogin.service";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.username.trim() || !form.password.trim()) {
            setError("Vui lòng nhập đầy đủ username và password!");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                username: form.username,
                password: form.password,
            };

            const response = await adminLogin(payload);

            console.log("Login response:", response);
            navigate("/admin");

        } catch (err) {
            setError(
                err.message || err.response?.data?.message || "Đăng nhập thất bại!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-blue-600 text-white text-2xl font-bold mb-4">
                        A
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Admin Login
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                        Welcome back! Please login to your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-200"
                    >
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>

                </form>

                <p className="text-center text-gray-400 text-xs mt-8">
                    © 2026 SVStay Admin System
                </p>

            </div>
        </div>
    );
}
