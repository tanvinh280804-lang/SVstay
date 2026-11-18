import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Headphones,
  Wallet,
  BadgeCheck,
  Home,
  Users,
  Ruler,
  KeyRound,
  Building2,
  BedDouble,
  CheckCircle2,
  GraduationCap,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { getActiveRooms, getRoomTypes } from "../../services/Customer/Room.service";

const areas = [
  {
    name: "Hà Nội",
    description: "Khám phá phòng trọ Hà Nội",
    image:
      "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "TP. Hồ Chí Minh",
    description: "Khám phá phòng trọ Sài Gòn",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Đà Nẵng",
    description: "Khám phá phòng trọ Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Cần Thơ",
    description: "Khám phá phòng trọ Cần Thơ",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=700&q=85",
  },
];

const universities = [
  { short: "BK", name: "Đại học Bách Khoa Hà Nội" },
  { short: "VNU", name: "Đại học Quốc gia Hà Nội" },
  { short: "NEU", name: "Đại học Kinh tế Quốc dân" },
  { short: "HCM", name: "Đại học Quốc gia TP.HCM" },
  { short: "UEH", name: "Đại học Kinh tế TP.HCM" },
  { short: "TDT", name: "Đại học Tôn Đức Thắng" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Không phí môi giới, không cọc giữ chỗ ảo",
    description:
      "Kết nối trực tiếp số điện thoại và Zalo chủ nhà. Tuyệt đối không qua trung gian cò phòng hay phát sinh phụ phí dẫn xem phòng.",
    note: "Chính sách hoàn tiền cọc nếu tin sai",
  },
  {
    icon: FileText,
    title: "Điện nước giá nhà nước / niêm yết rõ",
    description:
      "Mỗi bài đăng bắt buộc công khai giá điện (kW), giá nước (khối hoặc người), tiền mạng wifi và phí dịch vụ xe cộ trước khi sinh viên liên hệ.",
    note: "Cam kết không phụ phí ẩn",
  },
];

const categoryIcons = [
  KeyRound,
  Users,
  Building2,
  BedDouble,
  Home,
  ShieldCheck,
  GraduationCap,
  FileText,
  Headphones,
];

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAsaDxMRzZWPC_XFHOIKz393fZ_UXajCxZcyZjZrQpouawGBvZxXELXotpMS1hScA5ey2Tqz7Tyz8Ks-lcF-HcxSk_QTvGaHDcCS4rG1sVtCzPqRs7RY0J7zRxQLYLNjjomaTjjj-fUFXsZDdk3O6GEvb_AyW5qnqS5jMeTnOPB7q72tfMsyAQxa9EkKa1sx429i_ih_HKMEInUHp27zqcMWnMREL7QtQzHRFPnSwzB";

const money = (value) => Number(value || 0).toLocaleString("vi-VN");

const roomAddress = (room) =>
  [room.specific_address, room.ward, room.district, room.province]
    .filter(Boolean)
    .join(", ");

const countRoomsByTypeId = (rooms, typeId) =>
  typeId
    ? rooms.filter(
        (room) => String(room.room_type_id?._id || room.room_type_id) === String(typeId),
      ).length
    : 0;

export default function Homepage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [showAllTypes, setShowAllTypes] = useState(false);

  // Giữ nguyên logic API ban đầu
  useEffect(() => {
    getActiveRooms({ limit: 100, sort: "-createdAt" })
      .then((result) => setRooms(result?.rooms || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  // Lấy loại phòng thật từ hệ thống, làm mới khi quay lại tab để phản ánh thêm/xóa loại.
  useEffect(() => {
    let alive = true;

    const loadRoomTypes = () => {
      getRoomTypes()
        .then((types) => {
          if (alive) setRoomTypes(Array.isArray(types) ? types : []);
        })
        .catch(() => {
          if (alive) setRoomTypes([]);
        })
        .finally(() => {
          if (alive) setTypesLoading(false);
        });
    };

    loadRoomTypes();
    window.addEventListener("focus", loadRoomTypes);
    document.addEventListener("visibilitychange", loadRoomTypes);

    return () => {
      alive = false;
      window.removeEventListener("focus", loadRoomTypes);
      document.removeEventListener("visibilitychange", loadRoomTypes);
    };
  }, []);

  // Giữ nguyên logic tìm kiếm ban đầu
  const submit = (event) => {
    event.preventDefault();

    const query = new URLSearchParams();

    if (search.trim()) {
      query.set("search", search.trim());
    }

    navigate(`/rooms${query.size ? `?${query}` : ""}`);
  };

  const featuredRoom = rooms[0];
  const visibleTypes = showAllTypes ? roomTypes : roomTypes.slice(0, 4);

  // Giữ lại areas/universities cho các section thiết kế đang để trống.
  void areas;
  void universities;

  return (
    <div
      className="w-full bg-[#F5F5F0] text-[#19211D]"
      style={{
        fontFamily: '"Be Vietnam Pro", Inter, system-ui, sans-serif',
      }}
    >
      {/* ================= HERO + SEARCH ================= */}
      <section className="w-full border-b border-[#E2E8E4] bg-[#F0F1EB] py-8 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col lg:col-span-7">
              <div className="inline-flex items-center gap-2 self-start rounded-md border border-[#D8DDD3] bg-[#ECEEE7] px-3 py-1 text-xs font-semibold text-[#174C3C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
                <BadgeCheck size={14} />
                Nền tảng phòng trọ minh bạch #1 cho sinh viên
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#14261F] sm:text-[34px] sm:leading-[42px]">
                Tìm phòng trọ an tâm &amp; phù hợp cho sinh viên
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4F5A54] sm:text-base">
                Kết nối trực tiếp sinh viên và chủ nhà uy tín. Giá điện nước
                niêm yết rõ ràng, duyệt tin thủ công, cam kết không phí môi
                giới.
              </p>

              <div className="mt-6 w-full rounded-xl border border-[#DCE4DF] bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-[#E8ECE9] pb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#174C3C] px-3.5 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    <Home size={16} />
                    Thuê phòng trọ
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-1 font-[Inter] text-[11px] font-semibold uppercase tracking-wider text-[#B45309]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                    Duyệt tin thủ công
                  </span>
                </div>

                <form onSubmit={submit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label
                      htmlFor="svstay-home-search"
                      className="flex items-center gap-1 text-xs font-semibold text-[#2D3934]"
                    >
                      <MapPin size={14} className="text-[#EA580C]" />
                      Khu vực / Trường đại học / Tên phòng
                    </label>
                    <input
                      id="svstay-home-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="h-10 w-full rounded-lg border border-[#DCDDD6] bg-[#F7F7F3] px-3 text-sm text-[#19211D] outline-none transition placeholder:text-gray-400 focus:border-[#174C3C] focus:bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#174C3C] text-sm font-semibold text-white shadow-sm transition hover:bg-[#10382C]"
                    >
                      <Search size={18} />
                      Tìm kiếm ngay
                    </button>
                  </div>
                </form>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#EEF2EF] pt-3.5 text-[11px] text-[#526159]">
                  <span className="font-[Inter] font-semibold">Cam kết:</span>
                  <span>Không phí môi giới</span>
                  <span className="text-gray-300">•</span>
                  <span>Giá điện nước rõ ràng</span>
                  <span className="text-gray-300">•</span>
                  <span>Chủ nhà uy tín</span>
                </div>
              </div>
            </div>

            <div className="relative mt-2 lg:col-span-5 lg:mt-0">
              <div className="overflow-hidden rounded-xl border border-[#D5DFD9] bg-white shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8ECE9] sm:aspect-[16/11]">
                  <img
                    src={HERO_IMAGE}
                    alt="Phòng trọ sinh viên tiện nghi, sáng sủa và ngăn nắp"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-[#174C3C] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                    <BadgeCheck size={13} />
                    Phòng trọ xác thực 100%
                  </span>
                  <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {featuredRoom
                      ? `${money(featuredRoom.price)} đ/tháng`
                      : "Đang cập nhật giá"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#E8ECE9] bg-white p-3.5">
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-xs font-semibold text-[#19211D]">
                      {featuredRoom?.room_name || "Phòng trọ sinh viên xác thực"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-[#4F5A54]">
                      <MapPin size={13} className="shrink-0 text-gray-400" />
                      {featuredRoom
                        ? roomAddress(featuredRoom)
                        : "Các khu vực đại học trọng điểm"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-[#EDF0E8] px-2 py-1 text-[11px] font-semibold text-[#174C3C]">
                    Đã kiểm duyệt
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {[
                  { icon: BadgeCheck, label: "Chính chủ" },
                  { icon: Wallet, label: "Giá rõ ràng" },
                  { icon: Headphones, label: "Hỗ trợ 24/7" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#DEE5E0] bg-white px-2 py-2 text-[11px] font-semibold text-[#34443C]"
                    >
                      <Icon
                        size={14}
                        className={item.label === "Giá rõ ràng" ? "text-[#EA580C]" : "text-[#174C3C]"}
                      />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DANH MỤC NHANH ================= */}
      <section className="w-full border-b border-[#E2E8E4] bg-[#FAFAF6] py-10">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#19211D] sm:text-xl">
              Bạn đang tìm loại hình nào?
            </h2>
            {roomTypes.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllTypes((open) => !open)}
                aria-expanded={showAllTypes}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D5DFD9] bg-white px-3 py-1.5 text-xs font-semibold text-[#174C3C] transition hover:border-[#174C3C] hover:bg-[#F2F5F3]"
              >
                {showAllTypes ? "Thu gọn" : `Xem tất cả ${roomTypes.length} loại phòng`}
                {showAllTypes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

          {typesLoading ? (
            <div className="flex justify-center rounded-xl border border-[#DEE5E0] bg-white py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#174C3C]" />
            </div>
          ) : visibleTypes.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleTypes.map((type, index) => {
                const Icon = categoryIcons[index % categoryIcons.length];
                const count = countRoomsByTypeId(rooms, type._id);

                return (
                  <Link
                    key={type._id}
                    to={`/rooms?room_type_id=${type._id}`}
                    className="group flex items-start gap-3.5 rounded-xl border border-[#DEE5E0] bg-white p-4 transition-all duration-150 hover:border-[#174C3C] hover:bg-[#F4F5F0]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D5DFD9] bg-white text-[#174C3C] transition-colors group-hover:border-[#174C3C] group-hover:bg-[#174C3C] group-hover:text-white">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#19211D] transition-colors group-hover:text-[#174C3C]">
                        {type.type_name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-[#4F5A54]">
                        {type.description?.trim() ||
                          "Khám phá các phòng trọ thuộc loại hình này."}
                      </p>
                      {count > 0 && (
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                          {count} phòng đang đăng →
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D5DFD9] bg-white py-10 text-center text-sm text-[#4F5A54]">
              Chưa có loại phòng nào trên hệ thống.
            </div>
          )}
        </div>
      </section>

      {/* ================= PHÒNG MỚI ĐĂNG ================= */}
      <section className="w-full border-b border-[#E2E8E4] bg-[#F5F5F0] py-10 sm:py-14">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#174C3C]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#F59E0B]" />
                Cập nhật liên tục 24/7
              </div>
              <h2 className="mt-1 text-xl font-bold text-[#14261F] sm:text-2xl">
                Phòng trọ mới đăng
              </h2>
              <p className="mt-0.5 text-xs text-[#4F5A54] sm:text-sm">
                Hình ảnh chụp thực tế tại phòng, giá thuê chính chủ, không
                tăng giá vô lý.
              </p>
            </div>
            <div>
              <Link
                to="/rooms"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#174C3C] hover:underline sm:text-sm"
              >
                Xem tất cả phòng trọ
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center rounded-xl border border-[#DCE4DF] bg-white py-16 shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-[#174C3C]" />
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rooms.slice(0, 4).map((room) => (
                <article
                  key={room._id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-[#DCE4DF] bg-white transition-all duration-200 hover:z-10 hover:-translate-y-1 hover:border-[#174C3C] hover:shadow-[0_18px_36px_-12px_rgba(15,56,44,0.4)] hover:ring-1 hover:ring-[#174C3C]/10"
                >
                  <Link
                    to={`/rooms/${room.room_slug || room._id}`}
                    className="relative aspect-[16/11] w-full overflow-hidden bg-[#E8ECE9]"
                  >
                    <img
                      src={
                        room.images?.[0] ||
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={room.room_name}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded bg-[#174C3C] px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                      <BadgeCheck size={12} />
                      Mới đăng
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 rounded bg-black/70 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                      {room.room_type_id?.type_name || "Phòng trọ"}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-3.5">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-base font-bold text-[#174C3C]">
                          {money(room.price)} đ
                          <span className="text-xs font-normal text-[#EA580C]">
                            /tháng
                          </span>
                        </span>
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
                          {room.deposit
                            ? `Cọc ${money(room.deposit)} đ`
                            : "Liên hệ cọc"}
                        </span>
                      </div>

                      <Link
                        to={`/rooms/${room.room_slug || room._id}`}
                        className="mt-1.5 line-clamp-1 block text-sm font-semibold text-[#19211D] transition-colors group-hover:text-[#174C3C]"
                      >
                        {room.room_name}
                      </Link>

                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#4F5A54]">
                        <MapPin size={13} className="shrink-0 text-gray-400" />
                        {roomAddress(room) || "Chưa cập nhật địa chỉ"}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#4F5A54]">
                        <span className="flex items-center gap-1">
                          <Ruler size={13} />
                          {room.area}m²
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <Users size={13} />
                          Tối đa {room.max_occupants}
                        </span>
                        {room.amenities?.[0] && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="truncate">{room.amenities[0]}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5 border-t border-[#EDF2EE] pt-2.5">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#174C3C]">
                        <GraduationCap size={14} className="shrink-0" />
                        <span className="truncate">
                          Gần trường đại học · {room.district || room.province}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 truncate text-[11px] text-gray-500">
                        <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                        Điện:{" "}
                        {room.electricity_price
                          ? `${money(room.electricity_price)} đ/kW`
                          : "liên hệ"}{" "}
                        · Nước:{" "}
                        {room.water_price
                          ? `${money(room.water_price)} đ/khối`
                          : "liên hệ"}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#FED7AA] bg-[#FFFBF5] py-16 text-center text-sm text-[#9A3412]">
              Chưa có phòng nào đang hiển thị.
            </div>
          )}
        </div>
      </section>

      {/* ================= VÌ SAO CHỌN SVSTAY ================= */}
      <section className="w-full border-b border-[#E2E8E4] bg-[#FAFAF6] py-12 sm:py-14">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex flex-col items-center rounded-xl border border-[#DEE5E0] bg-white p-5 text-center"
                >
                  <div
                    className={`mb-3.5 flex h-10 w-10 items-center justify-center rounded-lg ${
                      benefit.title.includes("Điện nước")
                        ? "border border-[#FED7AA] bg-[#FFF7ED] text-[#EA580C]"
                        : "border border-emerald-200 bg-emerald-50 text-[#174C3C]"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-[#14261F]">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#4F5A54]">
                    {benefit.description}
                  </p>
                  <div
                    className={`mt-4 flex w-full items-center justify-center gap-1.5 border-t pt-3 text-xs font-semibold ${
                      benefit.title.includes("Điện nước")
                        ? "border-[#FED7AA] text-[#B45309]"
                        : "border-[#E8ECE9] text-[#174C3C]"
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    {benefit.note}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
