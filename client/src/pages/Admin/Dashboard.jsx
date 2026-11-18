import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
  Loader2,
} from "lucide-react";
import { getUsers } from "../../services/Admin/Users.service";
import { getAdminRooms } from "../../services/Admin/Rooms.service";
import { getAllRoomTypes } from "../../services/Admin/RoomTypes.service";
import { getCurrentAdmin } from "../../services/Auth/AdminLogin.service";

const ROOM_ROW_GRID =
  "grid grid-cols-[minmax(210px,1.5fr)_minmax(170px,1.2fr)_minmax(120px,0.9fr)_minmax(120px,0.9fr)_minmax(110px,0.8fr)_88px] items-center gap-4";

const STATUS_MAP = {
  0: { label: "Từ chối/ẩn", className: "bg-[#F0F1EB] text-[#526159]" },
  1: { label: "Chờ duyệt", className: "bg-[#FFF7ED] text-[#B45309]" },
  2: { label: "Đang hiển thị", className: "bg-[#E7F0EB] text-[#174C3C]" },
  3: { label: "Đã cho thuê", className: "bg-[#ECEEE7] text-[#34443C]" },
};

const formatMoney = (value) => Number(value || 0).toLocaleString("vi-VN");

const getRoleLabel = (role) => {
  if (role === 2 || role === "2" || role === "SUPERADMIN") return "Super Admin";
  if (role === 1 || role === "1" || role === "ADMIN") return "Admin";
  return "Quản trị viên";
};

const getInitials = (name) => {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
};

export default function Dashboard() {
  const [admin] = useState(() => getCurrentAdmin());
  const [summary, setSummary] = useState({
    customers: 0,
    owners: 0,
    totalRooms: 0,
    pendingRooms: 0,
    roomTypes: 0,
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getUsers("customers"),
      getUsers("owners"),
      getAdminRooms({ status: "all", limit: 100 }),
      getAllRoomTypes(),
    ])
      .then(([customersRes, ownersRes, roomsRes, typesRes]) => {
        const customers = customersRes.status === "fulfilled" ? customersRes.value : {};
        const owners = ownersRes.status === "fulfilled" ? ownersRes.value : {};
        const roomsData = roomsRes.status === "fulfilled" ? roomsRes.value : {};
        const typesData = typesRes.status === "fulfilled" ? typesRes.value : {};

        const roomList = roomsData?.rooms || [];
        const typeList =
          typesData?.roomType || typesData?.data || (Array.isArray(typesData) ? typesData : []);

        setRooms(roomList);
        setSummary({
          customers: customers?.total ?? customers?.users?.length ?? 0,
          owners: owners?.total ?? owners?.users?.length ?? 0,
          totalRooms: roomsData?.pagination?.total ?? roomList.length,
          pendingRooms: roomList.filter((room) => Number(room.status) === 1).length,
          roomTypes: typeList.length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const adminName = admin?.username || "Administrator";
  const totalUsers = summary.customers + summary.owners;
  const approvalRate =
    summary.totalRooms > 0
      ? Math.round(((summary.totalRooms - summary.pendingRooms) / summary.totalRooms) * 100)
      : 0;

  const kpis = [
    {
      label: "Tổng người dùng",
      value: totalUsers,
      hint: "Sinh viên + Chủ trọ",
      icon: Users,
      tone: "bg-[#E7F0EB] text-[#174C3C]",
      valueClass: "text-[#174C3C]",
      progress: totalUsers > 0 ? 100 : 0,
    },
    {
      label: "Sinh viên",
      value: summary.customers,
      hint: "Tài khoản khách thuê",
      icon: UserRound,
      tone: "bg-[#F7F7F3] text-[#34443C]",
      valueClass: "text-[#34443C]",
    },
    {
      label: "Chủ trọ",
      value: summary.owners,
      hint: "Tài khoản đăng tin",
      icon: Building2,
      tone: "bg-[#F7F7F3] text-[#34443C]",
      valueClass: "text-[#34443C]",
    },
    {
      label: "Phòng chờ duyệt",
      value: summary.pendingRooms,
      hint: `Trên tổng ${summary.totalRooms} phòng`,
      icon: ClipboardCheck,
      tone: "bg-[#FFF7ED] text-[#B45309]",
      valueClass: "text-[#B45309]",
      progress: approvalRate,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[#E2E8E4] bg-[#F0F1EB] p-5 shadow-sm sm:p-7">
        <span className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#174C3C]/10 blur-3xl" />
        <span className="pointer-events-none absolute bottom-[-6rem] left-1/3 h-64 w-64 rounded-full bg-[#F59E0B]/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#174C3C] text-2xl font-bold text-white ring-4 ring-white shadow-md sm:h-24 sm:w-24">
              {getInitials(adminName)}
              <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#174C3C] text-white ring-2 ring-[#F0F1EB]">
                <BadgeCheck className="h-4 w-4" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#174C3C] sm:text-2xl">
                  Xin chào, {adminName}!
                </h1>
                <span className="rounded-full bg-[#174C3C]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#174C3C]">
                  Khu vực Quản trị
                </span>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#526159]">
                <Mail className="h-4 w-4 shrink-0 text-[#174C3C]" />
                <span className="truncate">{admin?.email || "Chưa cập nhật email"}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#34443C] shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#174C3C]" />
                  {getRoleLabel(admin?.role)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#34443C] shadow-sm">
                  {summary.roomTypes} loại phòng
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/rooms"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#174C3C]/20 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#174C3C] transition hover:bg-white lg:flex-none"
            >
              <ClipboardCheck className="h-4 w-4" />
              Duyệt phòng
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F382C] lg:flex-none"
            >
              Quản lý người dùng
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3 border-t border-[#DCE4DF]/80 pt-5 md:grid-cols-4">
          {kpis.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl border border-[#E2E8E4] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-semibold text-[#707974]">
                    {card.label}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold">
                  <span className={card.valueClass}>{loading ? "—" : card.value}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-[#707974]">{card.hint}</p>
                {card.progress !== undefined && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ECEEE7]">
                    <div
                      className="h-full rounded-full bg-[#174C3C] transition-all duration-500"
                      style={{ width: `${loading ? 0 : card.progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent rooms */}
      <section className="rounded-2xl border border-[#E2E8E4] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 border-b border-[#EEF1ED] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#19211D]">Phòng mới gửi lên hệ thống</h2>
            <p className="mt-0.5 text-xs text-[#707974]">
              Dữ liệu lấy trực tiếp từ danh sách phòng, không dùng dữ liệu mẫu.
            </p>
          </div>
          <Link
            to="/admin/rooms"
            className="inline-flex items-center gap-1 self-start text-xs font-semibold text-[#174C3C] transition hover:gap-1.5"
          >
            Xem tất cả
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto pt-4">
          <div className="min-w-[900px]">
            <div
              className={`${ROOM_ROW_GRID} px-3.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A948E]`}
            >
              <span>Phòng trọ</span>
              <span>Chủ trọ</span>
              <span>Trạng thái</span>
              <span className="text-right">Giá thuê</span>
              <span className="text-right">Ngày tạo</span>
              <span className="text-right">Thao tác</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-[#FAFAF6] py-12 text-sm text-[#707974]">
                <Loader2 className="h-5 w-5 animate-spin text-[#174C3C]" />
                Đang tải dữ liệu hệ thống...
              </div>
            ) : rooms.length === 0 ? (
              <div className="rounded-xl bg-[#FAFAF6] py-12 text-center text-sm text-[#526159]">
                Chưa có phòng nào trên hệ thống.
              </div>
            ) : (
              <div className="space-y-2.5">
                {rooms.slice(0, 6).map((room) => {
                  const status = STATUS_MAP[Number(room.status)] || STATUS_MAP[1];
                  return (
                    <div
                      key={room._id}
                      className={`${ROOM_ROW_GRID} rounded-xl bg-[#FAFAF6] p-3.5 transition hover:bg-[#F0F1EB]`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#19211D]">
                          {room.room_name}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[#707974]">
                          {room.room_type_id?.type_name || "Chưa phân loại"} ·{" "}
                          {room.district || "Chưa cập nhật quận"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-[#34443C]">
                          {room.owner_id?.full_name || "Không rõ"}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[#707974]">
                          {room.owner_id?.email || "—"}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`inline-block max-w-full truncate rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="text-right text-sm font-bold text-[#174C3C]">
                        {formatMoney(room.price)} đ
                      </div>
                      <div className="text-right text-[11px] text-[#707974]">
                        {room.createdAt
                          ? new Date(room.createdAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </div>
                      <div className="text-right">
                        <Link
                          to="/admin/rooms"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#174C3C]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#174C3C] transition hover:bg-[#174C3C]/20"
                        >
                          Xử lý
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
