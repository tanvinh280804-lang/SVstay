import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
  Hash,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAdminProfile } from "../../services/Admin/Profile.service";
import { getCurrentAdmin } from "../../services/Auth/AdminLogin.service";

export default function Profile() {
  const { adminId } = useParams();
  const navigate = useNavigate();

  // Lấy ID admin từ URL param hoặc từ localStorage (tài khoản hiện tại đang đăng nhập)
  const currentAdmin = getCurrentAdmin();
  const targetAdminId = adminId || currentAdmin?._id || currentAdmin?.id;

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(targetAdminId));
  const [error, setError] = useState(
    !targetAdminId ? "Không tìm thấy mã ID Admin để tải thông tin hồ sơ." : null
  );
  const [imageError, setImageError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!targetAdminId) return;

    let isMounted = true;

    getAdminProfile(targetAdminId)
      .then((res) => {
        if (isMounted) {
          // Backend trả về dạng { message: "...", admin: { ... } }
          setAdmin(res?.admin || res);
          setImageError(false);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const msg =
            err?.message ||
            err?.response?.data?.message ||
            "Không thể tải thông tin hồ sơ Admin.";
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [targetAdminId, refreshTrigger]);

  const handleManualRefresh = () => {
    if (!targetAdminId) {
      setError("Không tìm thấy mã ID Admin để tải thông tin hồ sơ.");
      return;
    }
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Helper hiển thị tên vai trò
  const renderRoleName = (role) => {
    if (role === 2 || role === "2") return "Super Admin (Cấp cao nhất)";
    if (role === 1 || role === "1") return "Admin (Quản trị viên)";
    return `Role: ${role ?? "N/A"}`;
  };

  // Helper định dạng ngày giờ
  const formatDate = (dateString) => {
    if (!dateString) return "---";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Ký tự viết tắt cho Avatar nếu không có ảnh
  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Hồ sơ Admin</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 pl-8">
            Xem và quản lý thông tin tài khoản quản trị viên hệ thống.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Trạng thái Loading */}
      {loading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-3 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-600">Đang tải thông tin hồ sơ...</p>
        </div>
      )}

      {/* Trạng thái Lỗi */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-rose-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-base text-rose-900">Không thể tải thông tin hồ sơ</h3>
              <p className="text-sm text-rose-700 mt-1">{error}</p>
              <button
                onClick={handleManualRefresh}
                className="mt-3 px-4 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nội dung hồ sơ */}
      {!loading && !error && admin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Tóm tắt thông tin & Avatar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              {admin?.avatar_url && !imageError ? (
                <img
                  src={admin.avatar_url}
                  alt={admin.username || "Admin Avatar"}
                  onError={() => setImageError(true)}
                  className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-3xl flex items-center justify-center border-4 border-indigo-100 shadow-sm">
                  {getInitials(admin?.username)}
                </div>
              )}

              {/* Status Dot */}
              <span
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${
                  admin?.isActive === 1 ? "bg-emerald-500" : "bg-rose-500"
                }`}
                title={admin?.isActive === 1 ? "Hoạt động" : "Không hoạt động"}
              />
            </div>

            <h2 className="text-lg font-bold text-slate-800">
              {admin?.username || "---"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{admin?.email || "---"}</p>

            {/* Badges vai trò & trạng thái */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                {admin?.role === 2 ? "Super Admin" : "Admin"}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  admin?.isActive === 1
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {admin?.isActive === 1 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đang hoạt động
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Đã khóa / Tạm dừng
                  </>
                )}
              </span>
            </div>

            <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs text-slate-500">
              <div className="flex items-center justify-between">
                <span>Mã Admin (_id):</span>
                <span className="font-mono text-slate-700 font-medium truncate max-w-[150px]" title={admin?._id}>
                  {admin?._id || "---"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Số điện thoại:</span>
                <span className="text-slate-700 font-medium">{admin?.phone || "Chưa cập nhật"}</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Chi tiết thông tin */}
          <div className="lg:col-span-2 space-y-6">
            {/* Khung Thông tin chi tiết */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Thông tin tài khoản
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* ID */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Hash className="w-4 h-4 text-slate-400" />
                    <span>Mã định danh (_id)</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800 font-mono break-all">
                    {admin?._id || "---"}
                  </p>
                </div>

                {/* Username */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Tên đăng nhập (username)</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {admin?.username || "---"}
                  </p>
                </div>

                {/* Email */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Email</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800 break-all">
                    {admin?.email || "---"}
                  </p>
                </div>

                {/* Số điện thoại */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>Số điện thoại (phone)</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {admin?.phone || "Chưa có"}
                  </p>
                </div>

                {/* Vai trò */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Vai trò / Cấp bậc (role)</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-indigo-700">
                    {renderRoleName(admin?.role)}
                  </p>
                </div>

                {/* Trạng thái hoạt động */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <span>Trạng thái (isActive)</span>
                  </div>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      admin?.isActive === 1 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {admin?.isActive === 1 ? "1 - Đang hoạt động" : "0 - Bị vô hiệu hóa"}
                  </p>
                </div>
              </div>
            </div>

            {/* Khung Thông tin hệ thống / Thời gian */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Thông tin hệ thống
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {/* Ngày tạo */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Ngày tạo (createdAt)</span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">
                    {formatDate(admin?.createdAt)}
                  </p>
                </div>

                {/* Ngày cập nhật */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Cập nhật cuối (updatedAt)</span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">
                    {formatDate(admin?.updatedAt)}
                  </p>
                </div>

                {/* Phiên bản schema (__v) */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Hash className="w-4 h-4 text-slate-400" />
                    <span>Phiên bản (__v)</span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">
                    {admin?.__v ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
