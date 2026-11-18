import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  DoorOpen,
  Droplets,
  Eye,
  Home,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  PieChart,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { getOwnerRooms } from "../../services/Owner/Room.service";
import { getCurrentOwner } from "../../services/Auth/OwnerLogin.service";

const STATUS_MAP = {
  2: {
    label: "Đang trống",
    dot: "bg-[#174C3C]",
    pill: "bg-[#E7F0EB] text-[#174C3C]",
  },
  3: {
    label: "Đã cho thuê",
    dot: "bg-[#526159]",
    pill: "bg-[#F0F1EB] text-[#34443C]",
  },
  1: {
    label: "Chờ duyệt",
    dot: "bg-[#EA580C]",
    pill: "bg-[#FFF7ED] text-[#B45309]",
  },
  0: {
    label: "Đang ẩn",
    dot: "bg-[#8A948E]",
    pill: "bg-[#F0F1EB] text-[#526159]",
  },
};

const FALLBACK_STATUS = {
  label: "Chưa cập nhật",
  dot: "bg-[#8A948E]",
  pill: "bg-[#F7F7F3] text-[#526159]",
};

const TONE_CLASS = {
  green: { icon: "bg-[#E7F0EB] text-[#174C3C]", value: "text-[#174C3C]" },
  neutral: { icon: "bg-[#F7F7F3] text-[#34443C]", value: "text-[#34443C]" },
  amber: { icon: "bg-[#FFF7ED] text-[#B45309]", value: "text-[#B45309]" },
};

const ROOM_ROW_GRID =
  "grid grid-cols-[minmax(220px,1.6fr)_minmax(200px,1.4fr)_minmax(130px,0.9fr)_88px] items-center gap-4";

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("vi-VN");

const getInitials = (name) => {
  if (!name) return "CT";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

const getRoomCode = (room) =>
  room?.room_name?.match(/\d{2,4}/)?.[0] || room?._id?.slice(-4) || "—";

const getRoomAddress = (room) =>
  [room?.specific_address, room?.ward, room?.district].filter(Boolean).join(", ") ||
  "Chưa cập nhật địa chỉ";

export default function OwnerDashboard() {
  const [owner] = useState(() => getCurrentOwner());
  const [rooms, setRooms] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getOwnerRooms({ limit: 10 })
      .then((res) => {
        setRooms(res?.rooms || []);
        if (res?.statistics) setStatistics(res.statistics);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const ownerName = owner?.full_name || owner?.fullName || "Chủ trọ";
  const ownerAddress = owner?.address || "Chưa cập nhật địa chỉ";
  const ownerAvatar = owner?.avatar;
  const initials = getInitials(ownerName);

  const accountState =
    owner?.is_active === 1 || owner?.isActive === 1 || owner?.is_active === true
      ? { label: "Tài khoản hoạt động", className: "bg-[#E7F0EB] text-[#174C3C]" }
      : owner?.is_active === 0 || owner?.is_active === 2
        ? { label: "Tài khoản chưa hoạt động", className: "bg-[#FFF7ED] text-[#B45309]" }
        : null;

  const statusCounts = rooms.reduce(
    (acc, room) => {
      const key = Number(room.status);
      if (key in acc) acc[key] += 1;
      return acc;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0 },
  );

  const displayTotal = statistics?.totalRooms ?? rooms.length;
  const availableCount = statistics?.availableRooms ?? statusCounts[2];
  const rentedCount = statistics?.rentedRooms ?? statusCounts[3];
  const pendingCount =
    (statistics?.pendingRooms ?? statusCounts[1]) +
    (statistics?.hiddenRooms ?? statusCounts[0]);

  const rawFill =
    displayTotal > 0 ? ((displayTotal - availableCount) / displayTotal) * 100 : 0;
  const fillPercent = Math.max(0, Math.min(100, Math.round(rawFill)));
  const scopeHint = statistics ? "Theo thống kê tài khoản" : "Trong 10 phòng gần đây";

  const kpis = [
    {
      label: "Tỷ lệ lấp đầy",
      value: `${fillPercent}%`,
      hint: `${availableCount}/${displayTotal} phòng trống`,
      icon: PieChart,
      tone: "green",
      progress: fillPercent,
    },
    {
      label: "Phòng sẵn sàng",
      value: String(availableCount).padStart(2, "0"),
      hint: "Đang mở cho sinh viên",
      icon: DoorOpen,
      tone: "green",
    },
    {
      label: "Đã cho thuê",
      value: String(rentedCount).padStart(2, "0"),
      hint: "Trong danh sách quản lý",
      icon: Home,
      tone: "neutral",
    },
    {
      label: "Chờ duyệt / Ẩn",
      value: String(pendingCount).padStart(2, "0"),
      hint: "Cần rà soát thông tin",
      icon: Clock,
      tone: "amber",
    },
  ];

  const filterOptions = [
    { value: "all", label: "Tất cả", count: rooms.length },
    { value: "2", label: "Trống", count: statusCounts[2] },
    { value: "3", label: "Đã thuê", count: statusCounts[3] },
    { value: "1", label: "Chờ duyệt", count: statusCounts[1] },
  ];

  const filteredRooms =
    statusFilter === "all"
      ? rooms
      : rooms.filter((room) => Number(room.status) === Number(statusFilter));

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6">
      {/* Hero profile banner + ambient circles */}
      <section className="relative overflow-hidden rounded-2xl border border-[#E2E8E4] bg-[#F0F1EB] p-5 shadow-sm sm:p-7">
        <span className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#174C3C]/10 blur-3xl" />
        <span className="pointer-events-none absolute bottom-[-6rem] left-1/3 h-64 w-64 rounded-full bg-[#F59E0B]/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#174C3C] text-2xl font-bold text-white ring-4 ring-white shadow-md">
                {initials}
              </span>
              {ownerAvatar && (
                <img
                  src={ownerAvatar}
                  alt={ownerName}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="relative h-full w-full rounded-full object-cover ring-4 ring-white shadow-md"
                />
              )}
              <span
                title="Tài khoản Chủ trọ SVstay"
                className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#174C3C] text-white shadow-sm ring-2 ring-[#F0F1EB]"
              >
                <BadgeCheck className="h-4 w-4" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#174C3C] sm:text-2xl">
                  Xin chào, {ownerName}!
                </h1>
                <span className="rounded-full bg-[#174C3C]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#174C3C]">
                  Chủ trọ SVstay
                </span>
              </div>

              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-[#526159]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#174C3C]" />
                <span>{ownerAddress}</span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {accountState && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${accountState.className}`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {accountState.label}
                  </span>
                )}
                {owner?.phone_number && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#34443C] shadow-sm">
                    <Phone className="h-3.5 w-3.5 text-[#174C3C]" />
                    {owner.phone_number}
                  </span>
                )}
                {owner?.email && (
                  <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#34443C] shadow-sm">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-[#174C3C]" />
                    <span className="truncate">{owner.email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:w-auto">
            <Link
              to="/owner/rooms/create"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#174C3C]/20 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#174C3C] backdrop-blur-sm transition hover:bg-white lg:flex-none"
            >
              <PlusCircle className="h-4 w-4" />
              Đăng phòng mới
            </Link>
            <Link
              to="/owner/rooms"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F382C] lg:flex-none"
            >
              Quản lý phòng
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* KPI mosaic */}
        <div className="relative mt-6 grid grid-cols-2 gap-3 border-t border-[#DCE4DF]/80 pt-5 md:grid-cols-4">
          {kpis.map((card) => {
            const Icon = card.icon;
            const tone = TONE_CLASS[card.tone];
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
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={`text-2xl font-bold ${tone.value}`}>
                    {loading ? "—" : card.value}
                  </span>
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
        <p className="relative mt-2 text-right text-[10px] text-[#8A948E]">{scopeHint}</p>
      </section>

      {/* Workspace content */}
      <div className="space-y-6">
          {/* Room inventory rows */}
          <div className="rounded-2xl border border-[#E2E8E4] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[#EEF1ED] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-[#19211D]">
                  Danh sách & trạng thái phòng trọ
                </h2>
                <p className="mt-0.5 text-xs text-[#707974]">
                  Các tin đăng gần đây của bạn, cập nhật theo thời gian thực.
                </p>
              </div>
              <Link
                to="/owner/rooms"
                className="inline-flex items-center gap-1 self-start text-xs font-semibold text-[#174C3C] transition hover:gap-1.5"
              >
                Quản lý tất cả
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5 py-4">
              {filterOptions.map((option) => {
                const isActive = statusFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatusFilter(option.value)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                      isActive
                        ? "bg-[#174C3C] text-white"
                        : "bg-[#F7F7F3] text-[#526159] hover:bg-[#ECEEE7]"
                    }`}
                  >
                    {option.label} ({loading ? "…" : option.count})
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-[#FAFAF6] py-12 text-sm text-[#707974]">
                <Loader2 className="h-5 w-5 animate-spin text-[#174C3C]" />
                Đang tải phòng trọ...
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="rounded-xl bg-[#FAFAF6] py-12 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F0EB] text-[#174C3C]">
                  <Building2 className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-medium text-[#34443C]">
                  {rooms.length === 0
                    ? "Chưa có phòng trọ nào được tạo."
                    : "Không có phòng nào với trạng thái này."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                  <div
                    className={`${ROOM_ROW_GRID} px-3.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A948E]`}
                  >
                    <span>Phòng trọ</span>
                    <span>Trạng thái & địa chỉ</span>
                    <span className="text-right">Giá thuê</span>
                    <span className="text-right">Thao tác</span>
                  </div>

                  <div className="space-y-2.5">
                    {filteredRooms.map((room) => {
                      const status = STATUS_MAP[Number(room.status)] || FALLBACK_STATUS;
                      const amenityText =
                        Array.isArray(room.amenities) && room.amenities.length > 0
                          ? room.amenities.slice(0, 3).join(" • ")
                          : "Chưa cập nhật tiện ích";
                      const roomSlug = room.room_slug || room._id;

                      return (
                        <div
                          key={room._id}
                          className={`${ROOM_ROW_GRID} rounded-xl bg-[#FAFAF6] p-3.5 transition hover:bg-[#F0F1EB]`}
                        >
                          <div className="flex min-w-0 items-center gap-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#174C3C] text-sm font-bold text-white">
                              {getRoomCode(room)}
                            </span>
                            <div className="min-w-0">
                              <h4 className="truncate text-sm font-bold text-[#19211D]">
                                {room.room_name}
                              </h4>
                              <p className="mt-0.5 truncate text-[11px] text-[#707974]">
                                {room.room_type_id?.type_name
                                  ? `${room.room_type_id.type_name} • `
                                  : ""}
                                {room.area ? `${room.area}m² • ` : ""}
                                {amenityText}
                              </p>
                            </div>
                          </div>

                          <div className="flex min-w-0 items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                              {Number(room.status) === 2 && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#174C3C] opacity-40" />
                              )}
                              <span
                                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.dot}`}
                              />
                            </span>
                            <div className="min-w-0">
                              <span
                                className={`inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-bold ${status.pill}`}
                              >
                                {status.label}
                              </span>
                              <span className="mt-0.5 block truncate text-[11px] text-[#707974]">
                                {getRoomAddress(room)}
                              </span>
                            </div>
                          </div>

                          <div className="min-w-0 text-right">
                            <span className="block truncate text-sm font-bold text-[#174C3C]">
                              {formatMoney(room.price)} đ
                            </span>
                            <span className="block text-[11px] text-[#707974]">mỗi tháng</span>
                          </div>

                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/rooms/${roomSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Xem tin đăng"
                              className="rounded-lg bg-[#174C3C]/10 p-2 text-[#174C3C] transition hover:bg-[#174C3C]/20"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/owner/rooms/edit/${room._id}`}
                              title="Chỉnh sửa phòng"
                              className="rounded-lg bg-[#174C3C]/10 p-2 text-[#174C3C] transition hover:bg-[#174C3C]/20"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 border-t border-[#EEF1ED] pt-3 text-[11px] text-[#707974] sm:flex-row sm:items-center sm:justify-between">
              <span>Hiển thị {filteredRooms.length} / {rooms.length} phòng gần đây</span>
              <Link
                to="/owner/rooms"
                className="inline-flex items-center gap-1 font-semibold text-[#174C3C]"
              >
                Xem danh sách đầy đủ
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Utility price table - uses real room fields */}
          <div className="rounded-2xl border border-[#E2E8E4] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[#EEF1ED] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-[#19211D]">
                    Đơn giá điện nước & đặt cọc
                  </h2>
                  <span className="rounded-full bg-[#E7F0EB] px-2.5 py-0.5 text-[11px] font-bold text-[#174C3C]">
                    Dữ liệu từ tin đăng
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#707974]">
                  Thông tin lưu trực tiếp trên từng phòng, không nhập liệu mẫu.
                </p>
              </div>
              <Link
                to="/owner/rooms"
                className="inline-flex items-center gap-1 self-start rounded-lg bg-[#F7F7F3] px-3 py-1.5 text-[11px] font-semibold text-[#34443C] transition hover:bg-[#ECEEE7]"
              >
                <ReceiptText className="h-3.5 w-3.5 text-[#EA580C]" />
                Cập nhật trong quản lý phòng
              </Link>
            </div>

            <div className="overflow-x-auto pt-4">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="bg-[#F7F7F3] text-[11px] uppercase tracking-wide text-[#707974]">
                    <th className="rounded-l-lg px-3 py-2.5 font-semibold">Phòng</th>
                    <th className="px-3 py-2.5 font-semibold">Tiền điện</th>
                    <th className="px-3 py-2.5 font-semibold">Tiền nước</th>
                    <th className="px-3 py-2.5 font-semibold">Đặt cọc</th>
                    <th className="px-3 py-2.5 font-semibold">Giá thuê</th>
                    <th className="rounded-r-lg px-3 py-2.5 text-right font-semibold">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1ED]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-xs text-[#707974]">
                        Đang tải dữ liệu phòng...
                      </td>
                    </tr>
                  ) : rooms.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-xs text-[#707974]">
                        Chưa có phòng để hiển thị đơn giá.
                      </td>
                    </tr>
                  ) : (
                    rooms.map((room) => {
                      const status = STATUS_MAP[Number(room.status)] || FALLBACK_STATUS;
                      return (
                        <tr key={room._id} className="transition hover:bg-[#FAFAF6]">
                          <td className="px-3 py-3">
                            <span className="block font-bold text-[#174C3C]">
                              {room.room_name}
                            </span>
                            <span
                              className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.pill}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#34443C]">
                              <Zap className="h-3.5 w-3.5 text-[#EA580C]" />
                              {room.electricity_price
                                ? `${formatMoney(room.electricity_price)} đ/kWh`
                                : "Chưa cập nhật"}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#34443C]">
                              <Droplets className="h-3.5 w-3.5 text-[#174C3C]" />
                              {room.water_price
                                ? `${formatMoney(room.water_price)} đ`
                                : "Chưa cập nhật"}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-mono text-xs font-semibold text-[#34443C]">
                            {room.deposit ? `${formatMoney(room.deposit)} đ` : "Chưa cập nhật"}
                          </td>
                          <td className="px-3 py-3 font-mono text-xs font-bold text-[#174C3C]">
                            {formatMoney(room.price)} đ
                          </td>
                          <td className="px-3 py-3 text-right">
                            <Link
                              to={`/owner/rooms/edit/${room._id}`}
                              title="Chỉnh sửa đơn giá"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#174C3C]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#174C3C] transition hover:bg-[#174C3C]/20"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Sửa
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-2 rounded-xl bg-[#FAFAF6] p-3 text-xs text-[#526159] sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#174C3C]" />
                Đơn giá hiển thị đúng những gì bạn đã lưu trong tin đăng.
              </span>
              <span className="flex items-center gap-2 font-semibold text-[#34443C]">
                <Wallet className="h-4 w-4 text-[#174C3C]" />
                Tổng {rooms.length} phòng đang hiển thị
              </span>
            </div>
          </div>
      </div>
    </div>
  );
}
