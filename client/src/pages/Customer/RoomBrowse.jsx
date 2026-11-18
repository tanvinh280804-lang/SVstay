import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Ruler,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { getActiveRooms, getRoomTypes } from "../../services/Customer/Room.service";

const initialFilters = { search: "", district: "", room_type_id: "", min_price: "", max_price: "", sort: "-createdAt" };

const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80";

const roomAddress = (room) =>
  [room.specific_address, room.ward, room.district, room.province].filter(Boolean).join(", ");

const inputClass =
  "h-11 w-full rounded-lg bg-[#F7F7F3] px-3 text-sm text-[#19211D] outline-none transition placeholder:text-[#8A948E] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20";

const selectClass =
  "h-11 w-full appearance-none rounded-lg bg-[#F7F7F3] px-3 pr-9 text-sm text-[#19211D] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20";

export default function RoomBrowse() {
  const [searchParams] = useSearchParams();
  const initialQueryFilters = () => ({
    ...initialFilters,
    search: searchParams.get("search") || "",
    room_type_id: searchParams.get("room_type_id") || "",
  });
  const [filters, setFilters] = useState(initialQueryFilters);
  const [draft, setDraft] = useState(initialQueryFilters);
  const [types, setTypes] = useState([]);
  const [result, setResult] = useState({ key: null, rooms: [], pagination: null, error: "" });
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const requestKey = JSON.stringify([filters, pagination.page]);
  const loading = result.key !== requestKey;
  const error = result.key === requestKey ? result.error : "";
  const rooms = result.key === requestKey ? result.rooms : [];

  useEffect(() => { getRoomTypes().then(setTypes); }, []);
  useEffect(() => {
    let alive = true;
    getActiveRooms({ ...filters, page: pagination.page, limit: 12 })
      .then((response) => { if (alive) { setResult({ key: requestKey, rooms: response?.rooms || [], pagination: response?.pagination || null, error: "" }); if (response?.pagination) setPagination((current) => ({ ...current, ...response.pagination })); } })
      .catch((err) => { if (alive) setResult({ key: requestKey, rooms: [], pagination: null, error: err.message || "Không thể tải danh sách phòng." }); });
    return () => { alive = false; };
  }, [filters, pagination.page, requestKey]);

  const updateDraft = (event) => setDraft((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => { event.preventDefault(); setPagination((current) => ({ ...current, page: 1 })); setFilters(draft); };

  return (
    <div
      className="w-full bg-[#F5F5F0] py-8 text-[#19211D] sm:py-10"
      style={{ fontFamily: '"Be Vietnam Pro", Inter, system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <Link to="/" className="text-[#526159] transition hover:text-[#0F382C]">
            Trang chủ
          </Link>
          <ChevronRight size={13} className="text-[#B7BFB8]" />
          <span className="text-[#4F5A54]">Tìm phòng trọ</span>
        </div>

        {/* Tiêu đề */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#174C3C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              SVstay · Phòng trọ sinh viên
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#14261F] sm:text-[32px]">
              Tìm phòng trọ phù hợp
            </h1>
            <p className="mt-2 text-sm text-[#4F5A54]">
              Lọc theo khu vực, loại phòng và ngân sách của bạn.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCE4DF] bg-[#F7F7F3] px-3 py-1.5 text-xs font-semibold text-[#174C3C]">
            <BadgeCheck size={15} />
            Tin đã kiểm duyệt
          </span>
        </div>

        {/* Bộ lọc */}
        <form
          onSubmit={submit}
          className="rounded-2xl border border-[#E2E8E4] bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#EA580C]">
              <SlidersHorizontal size={17} />
            </span>
            <div>
              <p className="text-sm font-bold text-[#19211D]">Bộ lọc tìm kiếm</p>
              <p className="text-[11px] text-[#9A3412]">Điều chỉnh và áp dụng để xem kết quả</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <label className="relative md:col-span-2">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#526159]">Từ khóa</span>
              <Search size={16} className="absolute left-3 top-[38px] text-[#EA580C]" />
              <input
                name="search"
                value={draft.search}
                onChange={updateDraft}
                placeholder="Tên phòng, địa chỉ..."
                className={`${inputClass} pl-10`}
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[11px] font-semibold text-[#526159]">Khu vực</span>
              <input
                name="district"
                value={draft.district}
                onChange={updateDraft}
                placeholder="Quận / huyện"
                className={inputClass}
              />
            </label>

            <label className="relative">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#526159]">Loại phòng</span>
              <select name="room_type_id" value={draft.room_type_id} onChange={updateDraft} className={selectClass}>
                <option value="">Tất cả loại phòng</option>
                {types.map((type) => (
                  <option key={type._id} value={type._id}>{type.type_name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-[38px] text-[#7B857F]" />
            </label>

            <label>
              <span className="mb-1.5 block text-[11px] font-semibold text-[#526159]">Giá từ</span>
              <input
                name="min_price"
                type="number"
                min="0"
                value={draft.min_price}
                onChange={updateDraft}
                placeholder="0 đ"
                className={inputClass}
              />
            </label>

            <label>
              <span className="mb-1.5 block text-[11px] font-semibold text-[#526159]">Giá đến</span>
              <input
                name="max_price"
                type="number"
                min="0"
                value={draft.max_price}
                onChange={updateDraft}
                placeholder="10.000.000 đ"
                className={inputClass}
              />
            </label>

            <label className="relative md:col-span-3 lg:col-span-1">
              <span className="mb-1.5 block text-[11px] font-semibold text-[#526159]">Sắp xếp</span>
              <select name="sort" value={draft.sort} onChange={updateDraft} className={selectClass}>
                <option value="-createdAt">Mới đăng</option>
                <option value="price_asc">Giá thấp trước</option>
                <option value="price_desc">Giá cao trước</option>
                <option value="area_desc">Diện tích lớn trước</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-[38px] text-[#7B857F]" />
            </label>

            <div className="flex items-end md:col-span-3 lg:col-span-6 lg:justify-end">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#174C3C] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f362a] lg:w-auto"
              >
                <Search size={16} />
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </form>

        {/* Kết quả */}
        <div className="mb-4 mt-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#14261F]">Phòng trọ đang cho thuê</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-1 text-xs font-semibold text-[#B45309]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              {pagination.total || 0} phòng
            </span>
          </div>
          <span className="text-xs text-[#707974]">
            Trang {pagination.page || 1} / {pagination.totalPages || 1}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center rounded-2xl bg-white py-20 text-[#174C3C]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-6 text-sm text-[#B91C1C]">
            <AlertCircle size={20} className="shrink-0 text-[#DC2626]" />
            {error}
          </div>
        ) : rooms.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room._id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#DCE4DF] bg-white transition-all duration-200 hover:z-10 hover:-translate-y-1 hover:border-[#174C3C] hover:shadow-[0_18px_36px_-12px_rgba(15,56,44,0.4)]"
              >
                <Link
                  to={`/rooms/${room.room_slug || room._id}`}
                  className="relative aspect-[16/11] w-full overflow-hidden bg-[#E8E9E3]"
                >
                  <img
                    src={room.images?.[0] || FALLBACK_IMAGE}
                    alt={room.room_name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded bg-[#174C3C] px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
                    <BadgeCheck size={12} />
                    Mới đăng
                  </span>
                  <span className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-[11px] font-medium text-[#174C3C] backdrop-blur-sm">
                    {room.room_type_id?.type_name || "Phòng trọ"}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-base font-bold text-[#174C3C]">
                      {money(room.price)}
                      <span className="ml-1 text-xs font-normal text-[#EA580C]">/tháng</span>
                    </span>
                    <span className="shrink-0 rounded bg-[#F7F7F3] px-2 py-1 text-[11px] font-semibold text-[#526159]">
                      {room.deposit ? `Cọc ${money(room.deposit)}` : "Liên hệ cọc"}
                    </span>
                  </div>

                  <Link
                    to={`/rooms/${room.room_slug || room._id}`}
                    className="mt-2 line-clamp-1 text-sm font-bold text-[#19211D] transition-colors group-hover:text-[#174C3C]"
                  >
                    {room.room_name}
                  </Link>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#4F5A54]">
                    <MapPin size={13} className="shrink-0 text-[#7B857F]" />
                    {roomAddress(room) || "Chưa cập nhật địa chỉ"}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#4F5A54]">
                    {room.area ? (
                      <span className="flex items-center gap-1">
                        <Ruler size={13} className="text-[#174C3C]" />
                        {room.area} m²
                      </span>
                    ) : null}
                    {room.max_occupants ? (
                      <span className="flex items-center gap-1">
                        <Users size={13} className="text-[#174C3C]" />
                        Tối đa {room.max_occupants}
                      </span>
                    ) : null}
                  </div>

                  <Link
                    to={`/rooms/${room.room_slug || room._id}`}
                    className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-[#DCE4DF] bg-[#FAFAF6] py-1.5 text-xs font-semibold text-[#174C3C] transition hover:border-[#174C3C] hover:bg-[#F7F7F3]"
                  >
                    Xem chi tiết
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#FED7AA] bg-[#FFFBF5] py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7ED] text-[#EA580C]">
              <Search size={22} />
            </span>
            <p className="mt-4 text-base font-bold text-[#19211D]">Chưa tìm thấy phòng phù hợp</p>
            <p className="mt-1 text-sm text-[#9A3412]">Thử thay đổi từ khóa hoặc bộ lọc.</p>
          </div>
        )}

        {!loading && pagination.totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DCE4DF] bg-white px-4 text-sm font-semibold text-[#174C3C] transition hover:border-[#174C3C] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Trước
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7ED] px-2.5 py-1 text-xs font-semibold text-[#B45309]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DCE4DF] bg-white px-4 text-sm font-semibold text-[#174C3C] transition hover:border-[#174C3C] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
              <ChevronRight size={16} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
