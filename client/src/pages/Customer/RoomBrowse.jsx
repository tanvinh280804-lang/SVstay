import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getActiveRooms, getRoomTypes } from "../../services/Customer/Room.service";
import RoomCard from "../../components/Customer/RoomCard";

const initialFilters = { search: "", district: "", room_type_id: "", min_price: "", max_price: "", sort: "-createdAt" };

export default function RoomBrowse() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({ ...initialFilters, search: searchParams.get("search") || "" }));
  const [draft, setDraft] = useState(() => ({ ...initialFilters, search: searchParams.get("search") || "" }));
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-7"><p className="text-sm font-semibold text-blue-700">SVstay · Tìm chỗ ở phù hợp</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">Phòng trọ đang cho thuê</h1><p className="mt-2 text-slate-500">Lọc theo khu vực, loại phòng và ngân sách của bạn.</p></div>
      <form onSubmit={submit} className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-6">
        <label className="relative lg:col-span-2"><span className="sr-only">Từ khóa</span><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input name="search" value={draft.search} onChange={updateDraft} placeholder="Tên phòng, địa chỉ..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"/></label>
        <input name="district" value={draft.district} onChange={updateDraft} placeholder="Quận / huyện" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"/>
        <select name="room_type_id" value={draft.room_type_id} onChange={updateDraft} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Tất cả loại phòng</option>{types.map((type) => <option key={type._id} value={type._id}>{type.type_name}</option>)}</select>
        <input name="min_price" type="number" min="0" value={draft.min_price} onChange={updateDraft} placeholder="Giá từ" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"/>
        <input name="max_price" type="number" min="0" value={draft.max_price} onChange={updateDraft} placeholder="Giá đến" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"/>
        <div className="flex gap-3 md:col-span-2 lg:col-span-6 lg:justify-end">
          <select name="sort" value={draft.sort} onChange={updateDraft} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="-createdAt">Mới đăng</option><option value="price_asc">Giá thấp trước</option><option value="price_desc">Giá cao trước</option><option value="area_desc">Diện tích lớn trước</option></select>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><SlidersHorizontal className="h-4 w-4"/>Áp dụng bộ lọc</button>
        </div>
      </form>

      <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-800">{pagination.total || 0} phòng phù hợp</h2><span className="text-sm text-slate-500">Trang {pagination.page || 1} / {pagination.totalPages || 1}</span></div>
      {loading ? <div className="flex justify-center py-20 text-blue-600"><Loader2 className="h-8 w-8 animate-spin"/></div> : error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div> : rooms.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rooms.map((room) => <RoomCard key={room._id} room={room}/>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center"><p className="text-lg font-bold text-slate-800">Chưa tìm thấy phòng phù hợp</p><p className="mt-1 text-sm text-slate-500">Thử thay đổi từ khóa hoặc bộ lọc.</p></div>}
      {!loading && pagination.totalPages > 1 && <div className="mt-8 flex justify-center gap-2"><button disabled={pagination.page <= 1} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4"/>Trước</button><button disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm disabled:opacity-40">Sau<ChevronRight className="h-4 w-4"/></button></div>}
    </div>
  );
}
