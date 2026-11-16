import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, ShieldCheck, Building2, Loader2 } from "lucide-react";
import { getActiveRooms } from "../../services/Customer/Room.service";
import RoomCard from "../../components/Customer/RoomCard";

export default function Homepage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getActiveRooms({ limit: 6, sort: "-createdAt" }).then((result) => setRooms(result?.rooms || [])).catch(() => setRooms([])).finally(() => setLoading(false));
  }, []);
  const submit = (event) => { event.preventDefault(); const query = new URLSearchParams(); if (search.trim()) query.set("search", search.trim()); navigate(`/rooms${query.size ? `?${query}` : ""}`); };

  return (
    <div className="pb-16">
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700"><ShieldCheck className="h-4 w-4"/>Tìm phòng trọ dễ dàng cùng SVstay</span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">Tìm nơi ở phù hợp cho <span className="text-blue-700">chặng đường mới</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">Khám phá phòng trọ theo khu vực, ngân sách và nhu cầu của bạn. Xem hình ảnh, tiện ích và liên hệ chủ nhà trực tiếp.</p>
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl sm:flex-row">
            <label className="flex flex-1 items-center gap-3 px-3"><MapPin className="h-5 w-5 shrink-0 text-blue-600"/><span className="sr-only">Tìm theo tên hoặc khu vực</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nhập tên phòng, quận hoặc khu vực..." className="w-full py-3 text-sm outline-none"/></label>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"><Search className="h-4 w-4"/>Tìm phòng</button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-blue-600"/>Thông tin phòng chi tiết</span><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/>Liên hệ chủ nhà trực tiếp</span></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-blue-700">Cập nhật mới nhất</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Phòng trọ đang cho thuê</h2></div><Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">Xem tất cả<ArrowRight className="h-4 w-4"/></Link></div>
        {loading ? <div className="flex justify-center py-16 text-blue-600"><Loader2 className="h-8 w-8 animate-spin"/></div> : rooms.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rooms.map((room) => <RoomCard key={room._id} room={room}/>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">Chưa có phòng nào đang hiển thị.</div>}
      </section>
    </div>
  );
}
