import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, X, ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getAdminRooms, reviewAdminRoom } from "../../services/Admin/Rooms.service";

const statusText = { 0: "Từ chối/ẩn", 1: "Chờ duyệt", 2: "Đang hiển thị", 3: "Đã cho thuê" };
const statusClass = {
  0: "bg-[#F0F1EB] text-[#526159]",
  1: "bg-[#FFF7ED] text-[#B45309]",
  2: "bg-[#E7F0EB] text-[#174C3C]",
  3: "bg-[#ECEEE7] text-[#34443C]",
};

const ROOM_ROW_GRID =
  "grid grid-cols-[76px_minmax(240px,1.7fr)_minmax(160px,1.1fr)_minmax(120px,0.8fr)_112px] items-center gap-4";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState("1");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const loadRooms = useCallback(async () => {
    try {
      const data = await getAdminRooms({ status });
      setRooms(data.rooms || []);
    } catch (error) {
      toast.error(error.message || "Không tải được danh sách phòng.");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    Promise.resolve().then(loadRooms);
  }, [loadRooms]);

  const review = async (room, decision) => {
    setBusyId(room._id);
    try {
      const result = await reviewAdminRoom(room._id, decision);
      toast.success(result.message);
      setLoading(true);
      await loadRooms();
    } catch (error) {
      toast.error(error.message || "Không cập nhật được trạng thái phòng.");
    } finally {
      setBusyId(null);
    }
  };

  const selectClass =
    "h-10 rounded-lg border border-[#DCE4DF] bg-[#F7F7F3] px-3 text-sm text-[#34443C] outline-none transition focus:border-[#174C3C] focus:bg-white";

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[#E2E8E4] bg-[#F0F1EB] p-5 shadow-sm sm:p-6">
        <span className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-[#174C3C]/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#174C3C] text-white shadow-sm">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#174C3C]">Duyệt phòng trọ</h1>
              <p className="mt-0.5 text-sm text-[#526159]">
                Kiểm tra phòng do chủ trọ gửi trước khi hiển thị cho sinh viên.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(event) => {
                setLoading(true);
                setStatus(event.target.value);
              }}
              className={selectClass}
            >
              <option value="1">Chờ duyệt</option>
              <option value="2">Đang hiển thị</option>
              <option value="3">Đã cho thuê</option>
              <option value="0">Từ chối/ẩn</option>
              <option value="all">Tất cả</option>
            </select>
            <button
              onClick={() => {
                setLoading(true);
                loadRooms();
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DCE4DF] bg-white px-3.5 text-sm font-semibold text-[#34443C] transition hover:border-[#174C3C] hover:text-[#174C3C]"
            >
              <RefreshCw className="h-4 w-4" />
              Tải lại
            </button>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-[#DCE4DF]/80 pt-4 md:grid-cols-4">
          {[
            { label: "Đang hiển thị", value: rooms.filter((r) => Number(r.status) === 2).length, tone: "text-[#174C3C]" },
            { label: "Chờ duyệt", value: rooms.filter((r) => Number(r.status) === 1).length, tone: "text-[#B45309]" },
            { label: "Đã cho thuê", value: rooms.filter((r) => Number(r.status) === 3).length, tone: "text-[#34443C]" },
            { label: "Tổng danh sách", value: rooms.length, tone: "text-[#174C3C]" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white p-3.5 shadow-sm">
              <p className="truncate text-[11px] font-medium text-[#707974]">{item.label}</p>
              <p className={`mt-1 text-xl font-bold ${item.tone}`}>
                {loading ? "—" : String(item.value).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E2E8E4] bg-white p-5 shadow-sm sm:p-6">
        <div className="border-b border-[#EEF1ED] pb-4">
          <h2 className="text-base font-bold text-[#19211D]">Danh sách phòng</h2>
          <p className="mt-0.5 text-xs text-[#707974]">
            Hiển thị {rooms.length} phòng theo trạng thái đang chọn.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-[#FAFAF6] py-12 text-sm text-[#707974]">
            <Loader2 className="h-5 w-5 animate-spin text-[#174C3C]" />
            Đang tải danh sách...
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl bg-[#FAFAF6] py-12 text-center text-sm text-[#526159]">
            Không có phòng nào trong trạng thái này.
          </div>
        ) : (
          <div className="overflow-x-auto pt-4">
            <div className="min-w-[880px] space-y-2.5">
              {rooms.map((room) => (
                <article
                  key={room._id}
                  className={`${ROOM_ROW_GRID} rounded-xl bg-[#FAFAF6] p-3.5 transition hover:bg-[#F0F1EB]`}
                >
                  {room.images?.[0] ? (
                    <img
                      src={room.images[0]}
                      alt={room.room_name}
                      className="h-14 w-[76px] rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-[76px] items-center justify-center rounded-lg bg-[#ECEEE7] text-[10px] text-[#8A948E]">
                      Chưa có ảnh
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-[#19211D]">{room.room_name}</h3>
                    <p className="mt-0.5 truncate text-[11px] text-[#707974]">
                      {room.specific_address}, {room.ward}, {room.district}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-semibold text-[#174C3C]">
                      {Number(room.price).toLocaleString("vi-VN")} đ/tháng · {room.area}m² ·{" "}
                      {room.room_type_id?.type_name || "Chưa phân loại"}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#8A948E]">
                      {room.description}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#34443C]">
                      {room.owner_id?.full_name || "Không rõ"}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#707974]">
                      {room.owner_id?.email || "—"}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#8A948E]">
                      {room.owner_id?.phone_number || ""}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-block max-w-full truncate rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClass[room.status] || statusClass[1]}`}
                    >
                      {statusText[room.status] || "Không rõ"}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {room.status === 1 ? (
                      <>
                        <button
                          disabled={busyId === room._id}
                          onClick={() => review(room, "approve")}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#174C3C] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0F382C] disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Duyệt
                        </button>
                        <button
                          disabled={busyId === room._id}
                          onClick={() => review(room, "reject")}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2 text-xs font-bold text-[#B45309] transition hover:bg-[#FFEDD5] disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" />
                          Từ chối
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#8A948E]">Đã xử lý</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
