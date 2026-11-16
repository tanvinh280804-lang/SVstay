import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Ruler, Zap, Droplets, CalendarDays, Phone, Loader2 } from "lucide-react";
import { getRoomDetail } from "../../services/Customer/Room.service";
import RoomCard from "../../components/Customer/RoomCard";

const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function RoomDetail() {
  const { idOrSlug } = useParams();
  const [result, setResult] = useState({ id: null, data: null, error: "" });
  const loading = result.id !== idOrSlug;
  const data = result.id === idOrSlug ? result.data : null;
  const error = result.id === idOrSlug ? result.error : "";
  useEffect(() => {
    let alive = true;
    getRoomDetail(idOrSlug).then((data) => { if (alive) setResult({ id: idOrSlug, data, error: "" }); }).catch((err) => { if (alive) setResult({ id: idOrSlug, data: null, error: err.message || "Không thể tải thông tin phòng." }); });
    return () => { alive = false; };
  }, [idOrSlug]);

  if (loading) return <div className="flex min-h-[55vh] items-center justify-center text-blue-600"><Loader2 className="h-8 w-8 animate-spin"/></div>;
  if (error || !data?.room) return <div className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-2xl font-bold">Không tìm thấy phòng</h1><p className="mt-2 text-slate-500">{error || "Phòng có thể đã tạm dừng hiển thị."}</p><Link to="/rooms" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Quay lại danh sách</Link></div>;

  const { room, related_rooms: related = [] } = data;
  const images = room.images?.length ? room.images : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"];
  const address = [room.specific_address, room.ward, room.district, room.province].filter(Boolean).join(", ");
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/rooms" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4"/>Tất cả phòng</Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <main className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-2">{images.slice(0, 5).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${room.room_name} ${index + 1}`} className={`h-64 w-full rounded-2xl object-cover ${index === 0 ? "sm:col-span-2 sm:h-[430px]" : "h-48"}`}/>)}</div>
          <div className="mt-7"><span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{room.room_type_id?.type_name || "Phòng trọ"}</span><h1 className="mt-3 text-3xl font-extrabold text-slate-900">{room.room_name}</h1><p className="mt-3 flex items-start gap-2 text-slate-600"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"/>{address}</p></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[Ruler, `${room.area} m²`, "Diện tích"], [Users, `${room.max_occupants} người`, "Sức chứa"], [Zap, `${money(room.electricity_price)}/kWh`, "Điện"], [Droplets, `${money(room.water_price)}`, "Nước"]].map(([Icon, value, label]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><Icon className="h-5 w-5 text-blue-600"/><p className="mt-3 font-bold text-slate-900">{value}</p><p className="text-xs text-slate-500">{label}</p></div>)}</div>
          <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">Thông tin phòng</h2><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{room.description || "Chủ nhà chưa thêm mô tả."}</p></section>
          {room.amenities?.length > 0 && <section className="mt-7 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">Tiện ích</h2><div className="mt-4 flex flex-wrap gap-2">{room.amenities.map((amenity) => <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{amenity}</span>)}</div></section>}
          {related.length > 0 && <section className="mt-12"><h2 className="mb-5 text-2xl font-extrabold">Phòng tương tự</h2><div className="grid gap-5 sm:grid-cols-2">{related.map((item) => <RoomCard key={item._id} room={item}/>)}</div></section>}
        </main>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"><p className="text-sm text-slate-500">Giá thuê mỗi tháng</p><p className="mt-1 text-3xl font-extrabold text-blue-700">{money(room.price)}</p><div className="mt-5 space-y-3 border-y border-slate-100 py-4 text-sm text-slate-600"><p className="flex justify-between gap-3"><span>Tiền cọc</span><strong>{money(room.deposit)}</strong></p><p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-600"/>Có thể dọn vào: {room.available_date ? new Date(room.available_date).toLocaleDateString("vi-VN") : "Liên hệ chủ nhà"}</p></div><div className="mt-5"><p className="font-bold text-slate-900">{room.owner_id?.full_name || "Chủ nhà"}</p>{room.owner_id?.phone_number ? <a href={`tel:${room.owner_id.phone_number}`} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700"><Phone className="h-4 w-4"/>Gọi {room.owner_id.phone_number}</a> : <p className="mt-2 text-sm text-slate-500">Thông tin liên hệ chưa được cập nhật.</p>}</div></aside>
      </div>
    </div>
  );
}
