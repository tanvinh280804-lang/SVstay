import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Droplets,
  ExternalLink,
  FileText,
  Images,
  Loader2,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Users,
  Wallet,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { getRoomDetail } from "../../services/Customer/Room.service";

const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";

export default function RoomDetail() {
  const { idOrSlug } = useParams();
  const [result, setResult] = useState({ id: null, data: null, error: "" });
  const [lightbox, setLightbox] = useState(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const loading = result.id !== idOrSlug;
  const data = result.id === idOrSlug ? result.data : null;
  const error = result.id === idOrSlug ? result.error : "";
  const imageCount = data?.room?.images?.length || 1;

  // Logic tải dữ liệu giữ nguyên, chỉ thêm reset lightbox khi đổi phòng
  useEffect(() => {
    let alive = true;
    getRoomDetail(idOrSlug)
      .then((data) => {
        if (alive) {
          setLightbox(null);
          setAvatarFailed(false);
          setResult({ id: idOrSlug, data, error: "" });
        }
      })
      .catch((err) => {
        if (alive) {
          setResult({
            id: idOrSlug,
            data: null,
            error: err.message || "Không thể tải thông tin phòng.",
          });
        }
      });
    return () => {
      alive = false;
    };
  }, [idOrSlug]);

  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") setLightbox((index) => (index + 1) % imageCount);
      if (event.key === "ArrowLeft") setLightbox((index) => (index - 1 + imageCount) % imageCount);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox, imageCount]);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center text-[#174C3C]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data?.room) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]">
          <AlertCircle size={22} />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-[#19211D]">Không tìm thấy phòng</h1>
        <p className="mt-2 text-sm text-[#B91C1C]">
          {error || "Phòng có thể đã tạm dừng hiển thị."}
        </p>
        <Link
          to="/rooms"
          className="mt-6 inline-flex rounded-lg bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f362a]"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const { room, related_rooms: related = [] } = data;
  const images = room.images?.length ? room.images : [FALLBACK_IMAGE];
  const thumbnails = images.slice(1, 5);
  const hiddenPhotos = Math.max(0, images.length - 5);
  const address =
    [room.specific_address, room.ward, room.district, room.province].filter(Boolean).join(", ") ||
    "Chưa cập nhật địa chỉ";
  const hasAddress = Boolean(room.specific_address || room.ward || room.district || room.province);
  const mapQuery = encodeURIComponent(address);
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const typeName = room.room_type_id?.type_name || "Phòng trọ";
  const roomCode = String(room._id || idOrSlug).slice(-6).toUpperCase();
  const updatedAt = room.updatedAt || room.updated_at;
  const updatedLabel = updatedAt ? new Date(updatedAt).toLocaleDateString("vi-VN") : null;
  const availableLabel = room.available_date
    ? new Date(room.available_date).toLocaleDateString("vi-VN")
    : "Liên hệ";
  const ownerName = room.owner_id?.full_name || "Chủ trọ";
  const ownerAvatar = room.owner_id?.avatar;
  const ownerInitials = ownerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const ribbonStats = [
    { icon: Ruler, label: "Diện tích", value: room.area ? `${room.area} m²` : "Đang cập nhật" },
    { icon: Users, label: "Sức chứa", value: room.max_occupants ? `${room.max_occupants} người` : "Đang cập nhật" },
    { icon: Zap, label: "Giá điện", value: room.electricity_price ? `${money(room.electricity_price)}/kWh` : "Liên hệ" },
    { icon: Droplets, label: "Giá nước", value: room.water_price ? money(room.water_price) : "Liên hệ" },
    { icon: CalendarDays, label: "Dọn vào", value: availableLabel },
  ];

  return (
    <div
      className="w-full bg-[#F5F5F0] pb-28 text-[#19211D] lg:pb-20"
      style={{ fontFamily: '"Be Vietnam Pro", Inter, system-ui, sans-serif' }}
    >
      {/* ================= THANH ĐIỀU HƯỚNG ================= */}
      <div className="w-full bg-[#F7F7F3] py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#4F5A54]">
            <Link to="/" className="hover:text-[#174C3C]">
              Trang chủ
            </Link>
            <ChevronRight size={13} className="text-[#B7BFB8]" />
            <Link to="/rooms" className="hover:text-[#174C3C]">
              Tìm phòng trọ
            </Link>
            <ChevronRight size={13} className="text-[#B7BFB8]" />
            <span className="max-w-[220px] truncate font-semibold text-[#19211D]">{room.room_name}</span>
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              Mã: #{roomCode}
            </span>
          </nav>
          <span className="text-[11px] text-[#707974]">{typeName}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        {/* ================= TIÊU ĐỀ + BADGE ================= */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#174C3C] px-2.5 py-1 text-[11px] font-semibold text-white">
              <BadgeCheck size={13} />
              Tin đã kiểm duyệt
            </span>
            {room.electricity_price ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-1 text-[11px] font-semibold text-[#B45309]">
                <Zap size={13} />
                Giá điện {money(room.electricity_price)}/kWh
              </span>
            ) : null}
            {room.water_price ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F7F7F3] px-2.5 py-1 text-[11px] font-semibold text-[#526159]">
                <Droplets size={13} />
                Giá nước {money(room.water_price)}
              </span>
            ) : null}
            {room.max_occupants ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F7F7F3] px-2.5 py-1 text-[11px] font-semibold text-[#526159]">
                <Users size={13} />
                Phù hợp {room.max_occupants} người
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-4xl text-[22px] font-bold leading-snug tracking-tight text-[#174C3C] sm:text-[28px]">
              {room.room_name}
            </h1>
            {updatedLabel ? (
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-[#4F5A54]">
                <Clock size={14} className="text-[#EA580C]" />
                Cập nhật {updatedLabel}
              </span>
            ) : null}
          </div>

          <p className="flex items-start gap-1.5 text-sm text-[#4F5A54]">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[#174C3C]" />
            {address}
          </p>
        </div>

        {/* ================= GALLERY 7/5 (GIỮ OVERLAY + LIGHTBOX) ================= */}
        <div className="relative mt-6 grid h-[360px] grid-cols-1 gap-3 overflow-hidden rounded-2xl shadow-sm sm:h-[480px] md:grid-cols-12">
          <button
            type="button"
            onClick={() => setLightbox(0)}
            className={`relative h-full overflow-hidden bg-[#E8E9E3] text-left group ${
              thumbnails.length ? "md:col-span-7" : "md:col-span-12"
            }`}
          >
            <img
              src={images[0]}
              alt={room.room_name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#081A13]/75 via-transparent to-transparent" />
            <span className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#174C3C] backdrop-blur-sm">
              Ảnh chụp thực tế
            </span>
            <span className="absolute inset-x-4 bottom-4 text-white">
              <span className="block text-sm font-semibold">{room.room_name}</span>
              <span className="mt-0.5 block text-xs text-white/80">{typeName}</span>
            </span>
          </button>

          {thumbnails.length > 0 ? (
            <div className="hidden h-full grid-cols-2 grid-rows-2 gap-3 md:grid md:col-span-5">
              {thumbnails.map((image, index) => {
                const isLast = index === thumbnails.length - 1 && hiddenPhotos > 0;
                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setLightbox(index + 1)}
                    className="relative overflow-hidden bg-[#E8E9E3] group"
                  >
                    <img
                      src={image}
                      alt={`${room.room_name} - ảnh ${index + 2}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <span className="absolute inset-0 bg-[#0F382C]/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-0.5 text-[11px] font-medium text-[#19211D]">
                      Ảnh {index + 2}
                    </span>
                    {isLast ? (
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#0F382C]/65 text-white">
                        <Images size={22} />
                        <span className="text-sm font-bold">+{hiddenPhotos} ảnh</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
              {Array.from({ length: 4 - thumbnails.length }).map((_, index) => (
                <button
                  key={`filler-${index}`}
                  type="button"
                  onClick={() => setLightbox(0)}
                  className="flex items-center justify-center gap-1.5 bg-[#F7F7F3] text-xs font-semibold text-[#174C3C] transition hover:bg-[#ECEEE7]"
                >
                  <Images size={16} />
                  Xem tất cả ảnh
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* ================= RIBBON 5 CHỈ SỐ ================= */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl border border-[#E2E8E4] bg-white p-3.5 shadow-sm sm:grid-cols-5">
          {ribbonStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-[#F7F7F3] p-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    item.label === "Dọn vào"
                      ? "bg-[#FFF7ED] text-[#EA580C]"
                      : "bg-white text-[#174C3C]"
                  }`}
                >
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] text-[#526159]">{item.label}</span>
                  <span className="mt-0.5 block truncate text-sm font-bold text-[#19211D]">{item.value}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* ================= NỘI DUNG CHÍNH ================= */}
        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Cột trái */}
          <div className="min-w-0 space-y-6 lg:col-span-8">
            {/* Thông tin phòng */}
            <section className="rounded-xl border border-[#E2E8E4] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-[#174C3C]" />
                  <h2 className="text-base font-bold text-[#174C3C]">Thông tin phòng</h2>
                </div>
                <span className="shrink-0 rounded bg-[#F7F7F3] px-2 py-0.5 text-[11px] font-medium text-[#526159]">
                  {typeName}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4F5A54]">
                {room.description || "Chủ nhà chưa thêm mô tả cho phòng này."}
              </p>
            </section>

            {/* Tiện nghi */}
            {room.amenities?.length > 0 ? (
              <section className="rounded-xl border border-[#E2E8E4] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Wrench size={20} className="text-[#174C3C]" />
                    <h2 className="text-base font-bold text-[#174C3C]">Tiện nghi &amp; nội thất có sẵn</h2>
                  </div>
                  <span className="shrink-0 text-xs text-[#707974]">
                    {room.amenities.length} tiện ích
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {room.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg bg-[#FAFAF6] p-2.5 transition-colors hover:bg-[#F7F7F3]"
                    >
                      <CheckCircle2 size={16} className="shrink-0 text-[#174C3C]" />
                      <span className="text-xs font-medium text-[#34443C]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Vị trí */}
            <section className="overflow-hidden rounded-2xl border border-[#E2E8E4] bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECEEE7] text-[#174C3C]">
                  <Compass size={20} />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#174C3C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
                    Vị trí &amp; khu vực
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-[#19211D]">Nơi bạn sẽ sống</h2>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-7 text-[#4F5A54]">
                    <MapPin size={17} className="mt-1 shrink-0 text-[#174C3C]" />
                    {address}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[room.ward, room.district, room.province].filter(Boolean).map((part) => (
                      <span
                        key={part}
                        className="rounded-full border border-[#DCE4DF] bg-[#FAFAF6] px-3 py-1 text-[11px] font-medium text-[#526159]"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {hasAddress ? (
                <div className="mt-6 overflow-hidden rounded-xl border border-[#E2E8E4] bg-white">
                  <iframe
                    title={`Bản đồ vị trí ${room.room_name}`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-44 w-full border-0 sm:h-56"
                  />
                  <a
                    href={mapOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#FAFAF6] py-2.5 text-[11px] font-semibold text-[#174C3C] transition hover:bg-[#F7F7F3]"
                  >
                    <ExternalLink size={13} />
                    Mở vị trí này trong Google Maps
                  </a>
                </div>
              ) : null}
            </section>

            {/* Phòng tương tự */}
            {related.length > 0 ? (
              <section className="pt-2">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                      Phù hợp với ngân sách sinh viên
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-[#174C3C]">Phòng tương tự</h2>
                  </div>
                  <Link
                    to="/rooms"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#174C3C] transition hover:gap-2"
                  >
                    Xem tất cả phòng
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => (
                    <article
                      key={item._id}
                      className="group flex flex-col overflow-hidden rounded-xl border border-[#E2E8E4] bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <Link
                        to={`/rooms/${item.room_slug || item._id}`}
                        className="relative block h-40 overflow-hidden bg-[#E8E9E3]"
                      >
                        <img
                          src={item.images?.[0] || FALLBACK_IMAGE}
                          alt={item.room_name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                        />
                        <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#174C3C]">
                          {item.room_type_id?.type_name || "Phòng trọ"}
                        </span>
                        <span className="absolute bottom-3 right-3 rounded bg-[#174C3C] px-2.5 py-1 text-sm font-bold text-white">
                          {money(item.price)}
                        </span>
                      </Link>
                      <div className="flex flex-1 flex-col p-3.5">
                        <Link
                          to={`/rooms/${item.room_slug || item._id}`}
                          className="line-clamp-1 text-sm font-bold text-[#19211D] transition-colors group-hover:text-[#174C3C]"
                        >
                          {item.room_name}
                        </Link>
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#526159]">
                          <MapPin size={13} className="shrink-0" />
                          <span className="truncate">
                            {[item.district, item.province].filter(Boolean).join(", ") || "Chưa cập nhật"}
                          </span>
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-[#707974]">
                          {item.area ? <span>{item.area} m²</span> : null}
                          {item.area && item.max_occupants ? <span>•</span> : null}
                          {item.max_occupants ? <span>{item.max_occupants} người</span> : null}
                        </div>
                        <Link
                          to={`/rooms/${item.room_slug || item._id}`}
                          className="mt-3 block w-full rounded-lg bg-[#F7F7F3] py-2 text-center text-[11px] font-bold text-[#174C3C] transition hover:bg-[#ECEEE7]"
                        >
                          Xem chi tiết phòng này
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Cột phải: sticky giá & liên hệ */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20">
            <div className="space-y-4 rounded-xl border-2 border-[#174C3C]/10 bg-white p-5 shadow-md">
              <div className="border-b border-[#E8E9E3] pb-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#526159]">
                    Giá thuê niêm yết
                  </span>
                </div>
                <p className="mt-1 text-2xl font-bold text-[#174C3C]">
                  {money(room.price)}
                  <span className="ml-1 text-sm font-medium text-[#EA580C]">/ tháng</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[#F7F7F3] p-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#526159]">
                    <Wallet size={13} className="text-[#174C3C]" />
                    Tiền cọc
                  </span>
                  <p className="mt-1.5 truncate text-sm font-bold text-[#19211D]">
                    {room.deposit ? money(room.deposit) : "Liên hệ"}
                  </p>
                </div>
                <div className="rounded-lg bg-[#F7F7F3] p-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#526159]">
                    <CalendarDays size={13} className="text-[#174C3C]" />
                    Dọn vào
                  </span>
                  <p className="mt-1.5 truncate text-sm font-bold text-[#19211D]">{availableLabel}</p>
                </div>
              </div>

              <div>
                <p className="truncate text-sm font-bold text-[#19211D]">{ownerName}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#174C3C] text-xs font-bold text-white">
                    {ownerAvatar && !avatarFailed ? (
                      <img
                        src={ownerAvatar}
                        alt={`Ảnh đại diện ${ownerName}`}
                        className="h-full w-full object-cover"
                        onError={() => setAvatarFailed(true)}
                      />
                    ) : (
                      ownerInitials
                    )}
                  </span>
                  <p className="flex items-center gap-1 text-[11px] text-[#4F5A54]">
                    <BadgeCheck size={12} className="text-[#174C3C]" />
                    Chủ trọ đã xác thực
                  </p>
                </div>
              </div>

              {room.owner_id?.phone_number ? (
                <a
                  href={`tel:${room.owner_id.phone_number}`}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#174C3C] text-[13px] font-bold text-white shadow-sm transition hover:bg-[#0f362a]"
                >
                  <Phone size={16} />
                  Liên hệ chủ trọ: {room.owner_id.phone_number}
                </a>
              ) : (
                <p className="text-xs text-[#707974]">Chủ trọ chưa cập nhật số điện thoại.</p>
              )}

              <div className="grid grid-cols-3 gap-1 border-t border-[#E8E9E3] pt-2.5 text-center text-[11px] text-[#526159]">
                <span className="flex flex-col items-center gap-0.5">
                  <BadgeCheck size={17} className="text-[#174C3C]" />
                  Kiểm duyệt tin
                </span>
                <span className="flex flex-col items-center gap-0.5">
                  <FileText size={17} className="text-[#174C3C]" />
                  Chi phí rõ ràng
                </span>
                <span className="flex flex-col items-center gap-0.5">
                  <ShieldCheck size={17} className="text-[#174C3C]" />
                  Không phí môi giới
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Thanh gọi điện cố định trên mobile (từ bản hiện tại) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E2E8E4] bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#707974]">Giá mỗi tháng</p>
            <p className="text-lg font-bold text-[#174C3C]">{money(room.price)}</p>
          </div>
          {room.owner_id?.phone_number ? (
            <a
              href={`tel:${room.owner_id.phone_number}`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#174C3C] px-5 text-sm font-semibold text-white"
            >
              <Phone size={16} />
              Liên hệ chủ trọ
            </a>
          ) : (
            <span className="text-xs text-[#707974]">Chưa có số liên hệ</span>
          )}
        </div>
      </div>

      {/* Lightbox ảnh (từ bản hiện tại) */}
      {lightbox !== null ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#081A13]/95 p-4 text-white backdrop-blur-sm sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <div
            className="flex items-center justify-between"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Images size={17} className="text-emerald-300" />
              Ảnh phòng · {lightbox + 1}/{images.length}
            </span>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Đóng xem ảnh"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center py-6"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={images[lightbox]}
              alt={`${room.room_name} - ảnh ${lightbox + 1}`}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
          </div>

          <div
            className="flex items-center justify-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox((index) => (index - 1 + images.length) % images.length)}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-semibold transition hover:bg-white/20"
            >
              <ChevronLeft size={16} />
              Ảnh trước
            </button>
            <button
              type="button"
              onClick={() => setLightbox((index) => (index + 1) % images.length)}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-semibold transition hover:bg-white/20"
            >
              Ảnh tiếp
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
