import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  PlusCircle,
  CheckCircle2,
  Home,
  Clock,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Users,
  ShieldCheck,
} from "lucide-react";
import { getOwnerRooms } from "../../services/Owner/Room.service";
import { getCurrentOwner } from "../../services/Auth/OwnerLogin.service";

export default function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOwner(getCurrentOwner());
    getOwnerRooms({ limit: 5 })
      .then((res) => {
        setRooms(res?.rooms || []);
        if (res?.statistics) setStatistics(res.statistics);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Kênh Chủ trọ chính thức - SVstay</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xin chào, {owner?.fullName || "Chủ trọ"}!
          </h1>
          <p className="text-sm text-blue-100 max-w-xl">
            Chào mừng bạn đến với hệ thống quản lý phòng trọ SVstay. Theo dõi phòng trống, quản lý hợp đồng và tiếp cận sinh viên nhanh chóng.
          </p>
        </div>

        <Link
          to="/owner/rooms/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-lg transition self-start md:self-auto cursor-pointer shrink-0"
        >
          <PlusCircle className="w-5 h-5 text-blue-600" />
          <span>Đăng phòng mới</span>
        </Link>
      </div>

      {/* Thống kê 4 khối */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng phòng đã đăng</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
              {statistics?.totalRooms ?? rooms.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Phòng đang trống</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">
              {statistics?.availableRooms ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Đã có người thuê</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">
              {statistics?.rentedRooms ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Chờ duyệt / Ẩn</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">
              {(statistics?.pendingRooms ?? 0) + (statistics?.hiddenRooms ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách phòng mới nhất */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Phòng trọ gần đây</h2>
            <p className="text-xs text-slate-500 mt-0.5">Các phòng mới nhất bạn đã đăng tải</p>
          </div>

          <Link
            to="/owner/rooms"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Quản lý tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {rooms.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">Chưa có phòng trọ nào được tạo.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rooms.slice(0, 5).map((room) => {
              const thumb =
                room.images && room.images.length > 0
                  ? room.images[0]
                  : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80";

              return (
                <div
                  key={room._id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={thumb}
                      alt={room.room_name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">
                        {room.room_name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {room.specific_address}, {room.district}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="font-extrabold text-blue-600 text-sm">
                        {Number(room.price || 0).toLocaleString("vi-VN")} đ
                      </span>
                      <span className="text-[11px] text-slate-400 block">{room.area}m²</span>
                    </div>

                    <Link
                      to={`/owner/rooms/edit/${room._id}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                    >
                      Chỉnh sửa
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
