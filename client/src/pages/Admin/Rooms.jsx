import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import { toast } from "react-toastify";
import { getAdminRooms, reviewAdminRoom } from "../../services/Admin/Rooms.service";

const statusText = { 0: "Từ chối/ẩn", 1: "Chờ duyệt", 2: "Đang hiển thị", 3: "Đã cho thuê" };

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminRooms({ status });
      setRooms(data.rooms || []);
    } catch (error) {
      toast.error(error.message || "Không tải được danh sách phòng.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  const review = async (room, decision) => {
    setBusyId(room._id);
    try {
      const result = await reviewAdminRoom(room._id, decision);
      toast.success(result.message);
      await loadRooms();
    } catch (error) {
      toast.error(error.message || "Không cập nhật được trạng thái phòng.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-bold text-slate-800">Duyệt phòng trọ</h1><p className="mt-1 text-sm text-slate-500">Kiểm tra phòng do chủ trọ gửi trước khi hiển thị cho khách.</p></div>
        <div className="flex gap-2">
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="1">Chờ duyệt</option><option value="2">Đang hiển thị</option><option value="3">Đã cho thuê</option><option value="0">Từ chối/ẩn</option><option value="all">Tất cả</option>
          </select>
          <button onClick={loadRooms} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"><RefreshCw size={16}/>Tải lại</button>
        </div>
      </header>
      {loading ? <p className="rounded-xl bg-white p-6 text-slate-500">Đang tải danh sách...</p> : rooms.length === 0 ? <p className="rounded-xl bg-white p-8 text-center text-slate-500">Không có phòng nào trong trạng thái này.</p> : (
        <div className="grid gap-4">
          {rooms.map((room) => <article key={room._id} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[180px_1fr_auto]">
            {room.images?.[0] ? <img src={room.images[0]} alt={room.room_name} className="h-36 w-full rounded-lg object-cover md:w-[180px]"/> : <div className="flex h-36 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400 md:w-[180px]">Chưa có ảnh</div>}
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-800">{room.room_name}</h2><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{statusText[room.status] || "Không rõ"}</span></div>
              <p className="mt-1 text-sm text-slate-600">{room.specific_address}, {room.ward}, {room.district}, {room.province}</p>
              <p className="mt-2 text-sm font-semibold text-teal-700">{Number(room.price).toLocaleString("vi-VN")} ₫/tháng · {room.area} m² · {room.room_type_id?.type_name || "Chưa phân loại"}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{room.description}</p>
              <p className="mt-2 text-xs text-slate-500">Chủ trọ: {room.owner_id?.full_name || "Không rõ"} · {room.owner_id?.email || ""} · {room.owner_id?.phone_number || ""}</p>
            </div>
            {room.status === 1 && <div className="flex items-start gap-2 md:flex-col"><button disabled={busyId === room._id} onClick={() => review(room, "approve")} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"><Check size={16}/>Duyệt</button><button disabled={busyId === room._id} onClick={() => review(room, "reject")} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700 disabled:opacity-50"><X size={16}/>Từ chối</button></div>}
          </article>)}
        </div>
      )}
    </section>
  );
}
