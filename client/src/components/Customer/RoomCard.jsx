import { Link } from "react-router-dom";
import { MapPin, Users, Ruler } from "lucide-react";

const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function RoomCard({ room }) {
  const image = room.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80";
  const address = [room.specific_address, room.ward, room.district, room.province].filter(Boolean).join(", ");
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/rooms/${room.room_slug || room._id}`} className="block aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={image} alt={room.room_name} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{room.room_type_id?.type_name || "Phòng trọ"}</span>
          {room.status === 2 && <span className="text-xs font-medium text-emerald-700">Đang trống</span>}
        </div>
        <Link to={`/rooms/${room.room_slug || room._id}`} className="block truncate text-lg font-bold text-slate-900 hover:text-blue-700">{room.room_name}</Link>
        <p className="flex min-h-10 items-start gap-2 text-sm text-slate-500"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{address || "Chưa cập nhật địa chỉ"}</p>
        <div className="flex gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Ruler className="h-4 w-4" />{room.area} m²</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />Tối đa {room.max_occupants} người</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <p className="font-extrabold text-blue-700">{money(room.price)} <span className="text-xs font-medium text-slate-400">/ tháng</span></p>
          <Link to={`/rooms/${room.room_slug || room._id}`} className="rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Xem phòng</Link>
        </div>
      </div>
    </article>
  );
}
