import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Building2,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Home,
  Loader2,
} from "lucide-react";
import {
  getOwnerRooms,
  toggleRoomStatus,
  deleteRoom,
  getRoomTypes,
} from "../../services/Owner/Room.service";

const STATUS_MAP = {
  2: { label: "Đang trống", color: "border-[#C7DBD0] bg-[#E7F0EB] text-[#174C3C]" },
  3: { label: "Đã cho thuê", color: "border-[#DCE4DF] bg-[#F7F7F3] text-[#34443C]" },
  1: { label: "Chờ duyệt", color: "border-[#FED7AA] bg-[#FFF7ED] text-[#B45309]" },
  0: { label: "Đang ẩn", color: "border-[#DCE4DF] bg-[#F0F1EB] text-[#526159]" },
};

const statCards = [
  {
    label: "Tổng số phòng",
    icon: Building2,
    value: (statistics, pagination) => statistics?.totalRooms ?? pagination.total ?? 0,
    iconClass: "bg-[#ECEEE7] text-[#174C3C]",
    valueClass: "text-[#174C3C]",
  },
  {
    label: "Đang trống",
    icon: CheckCircle2,
    value: (statistics) => statistics?.availableRooms ?? 0,
    iconClass: "bg-[#E7F0EB] text-[#174C3C]",
    valueClass: "text-[#174C3C]",
  },
  {
    label: "Đã cho thuê",
    icon: Home,
    value: (statistics) => statistics?.rentedRooms ?? 0,
    iconClass: "bg-[#F7F7F3] text-[#34443C]",
    valueClass: "text-[#34443C]",
  },
  {
    label: "Chờ duyệt / Ẩn",
    icon: Clock,
    value: (statistics) => (statistics?.pendingRooms ?? 0) + (statistics?.hiddenRooms ?? 0),
    iconClass: "bg-[#FFF7ED] text-[#EA580C]",
    valueClass: "text-[#B45309]",
  },
];

const inputClass =
  "h-10 w-full rounded-lg border border-[#DCE4DF] bg-[#F7F7F3] px-3 text-sm text-[#19211D] outline-none transition placeholder:text-[#8A948E] focus:border-[#174C3C] focus:bg-white";

const selectClass =
  "h-10 w-full cursor-pointer rounded-lg border border-[#DCE4DF] bg-[#F7F7F3] px-3 text-sm text-[#34443C] outline-none transition focus:border-[#174C3C] focus:bg-white";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch dữ liệu phòng
  const fetchRooms = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "all") params.status = statusFilter;
      if (roomTypeFilter !== "all") params.room_type_id = roomTypeFilter;

      const response = await getOwnerRooms(params);
      setRooms(response?.rooms || []);
      setPagination(response?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      if (response?.statistics) setStatistics(response.statistics);
    } catch (err) {
      toast.error(err.message || "Không thể tải danh sách phòng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- giữ nguyên luồng tải ban đầu
    fetchRooms(1);
    getRoomTypes().then((types) => setRoomTypes(types || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- search chỉ áp dụng khi bấm Tìm kiếm
  }, [statusFilter, roomTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms(1);
  };

  // Đổi nhanh trạng thái phòng
  const handleToggleStatus = async (room, newStatus) => {
    try {
      await toggleRoomStatus(room._id, { status: Number(newStatus) });
      toast.success("Cập nhật trạng thái phòng thành công!");
      // Cập nhật ngay trong state
      setRooms((prev) =>
        prev.map((r) => (r._id === room._id ? { ...r, status: Number(newStatus) } : r))
      );
    } catch (err) {
      toast.error(err.message || "Không thể cập nhật trạng thái phòng.");
    }
  };

  // Xác nhận xóa phòng
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteRoom(deleteTarget._id);
      toast.success("Xóa phòng thành công!");
      setDeleteTarget(null);
      fetchRooms(pagination.page);
    } catch (err) {
      toast.error(err.message || "Lỗi khi xóa phòng.");
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="space-y-6">
      {/* Header và Nút tạo */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#174C3C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            SVstay · Quản lý phòng
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#14261F]">
            Quản lý phòng trọ
          </h1>
          <p className="mt-1 text-sm text-[#4F5A54]">
            Xem danh sách, kiểm soát tình trạng và cập nhật thông tin phòng của bạn.
          </p>
        </div>

        <Link
          to="/owner/rooms/create"
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F382C] sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Thêm phòng mới</span>
        </Link>
      </div>

      {/* 4 Thẻ Thống kê nhanh */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-2xl border border-[#E2E8E4] bg-white p-4 shadow-sm sm:p-5"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[#707974]">{card.label}</p>
                <p className={`mt-0.5 text-xl font-bold ${card.valueClass}`}>
                  {card.value(statistics, pagination)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thanh Tìm kiếm và Lọc */}
      <div className="rounded-2xl border border-[#E2E8E4] bg-white p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="relative sm:col-span-6 lg:col-span-6">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#EA580C]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên phòng, địa chỉ, mô tả..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <div className="sm:col-span-3 lg:col-span-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
              <option value="all">Tất cả trạng thái</option>
              <option value="2">Đang trống</option>
              <option value="3">Đã cho thuê</option>
              <option value="1">Chờ duyệt</option>
              <option value="0">Đang ẩn</option>
            </select>
          </div>

          <div className="sm:col-span-3 lg:col-span-2">
            <select value={roomTypeFilter} onChange={(e) => setRoomTypeFilter(e.target.value)} className={selectClass}>
              <option value="all">Tất cả loại phòng</option>
              {roomTypes.map((type) => <option key={type._id} value={type._id}>{type.type_name}</option>)}
            </select>
          </div>

          <div className="sm:col-span-12 lg:col-span-2">
            <button
              type="submit"
              className="h-10 w-full rounded-lg bg-[#174C3C] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F382C]"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách phòng */}
      <div className="overflow-hidden rounded-2xl border border-[#E2E8E4] bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#707974]">
            <Loader2 className="h-8 w-8 animate-spin text-[#174C3C]" />
            <p className="text-sm font-medium">Đang tải danh sách phòng...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#EA580C]">
              <Building2 className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-base font-bold text-[#19211D]">Chưa có phòng trọ nào</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#4F5A54]">
              Bạn chưa đăng phòng trọ nào hoặc không có phòng nào phù hợp với bộ lọc hiện tại.
            </p>
            <Link
              to="/owner/rooms/create"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#174C3C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F382C]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Đăng phòng đầu tiên ngay</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8E4] bg-[#FAFAF6] text-xs font-bold uppercase tracking-wider text-[#526159]">
                  <th className="px-4 py-3.5">Ảnh & Tên phòng</th>
                  <th className="px-4 py-3.5">Loại phòng</th>
                  <th className="px-4 py-3.5">Giá thuê</th>
                  <th className="px-4 py-3.5">Diện tích</th>
                  <th className="px-4 py-3.5">Địa chỉ</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF1ED]">
                {rooms.map((room) => {
                  const statusInfo = STATUS_MAP[room.status] || {
                    label: "Khác",
                    color: "border-[#DCE4DF] bg-[#F0F1EB] text-[#526159]",
                  };
                  const thumb =
                    room.images && room.images.length > 0
                      ? room.images[0]
                      : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80";

                  return (
                    <tr key={room._id} className="transition hover:bg-[#FAFAF6]">
                      {/* Ảnh & Tên phòng */}
                      <td className="min-w-[240px] px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt={room.room_name}
                            className="h-14 w-14 shrink-0 rounded-xl border border-[#DCE4DF] object-cover"
                          />
                          <div className="min-w-0">
                            <h4 className="truncate font-bold text-[#19211D] transition hover:text-[#174C3C]">
                              {room.room_name}
                            </h4>
                            <p className="mt-0.5 truncate text-xs text-[#8A948E]">{room.room_slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Loại phòng */}
                      <td className="whitespace-nowrap px-4 py-3.5 font-medium text-[#4F5A54]">
                        {room.room_type_id?.type_name || "Phòng trọ"}
                      </td>

                      {/* Giá thuê */}
                      <td className="whitespace-nowrap px-4 py-3.5 font-bold text-[#174C3C]">
                        {formatPrice(room.price)}
                        <span className="block text-xs font-normal text-[#EA580C]">/tháng</span>
                      </td>

                      {/* Diện tích */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-[#4F5A54]">
                        <span className="font-semibold">{room.area}m²</span>
                        <span className="block text-xs text-[#8A948E]">
                          Tối đa {room.max_occupants || 2} người
                        </span>
                      </td>

                      {/* Địa chỉ */}
                      <td className="max-w-[200px] px-4 py-3.5 text-[#4F5A54]">
                        <p className="truncate text-xs">
                          {room.specific_address || ""}, {room.district || ""}, {room.province || ""}
                        </p>
                      </td>

                      {/* Trạng thái & Toggle */}
                      <td className="whitespace-nowrap px-4 py-3.5">
                        {room.status === 1 ? (
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusInfo.color}`}>
                            Chờ admin duyệt
                          </span>
                        ) : (
                          <select
                            value={room.status}
                            onChange={(e) => handleToggleStatus(room, e.target.value)}
                            className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs font-bold outline-none ${statusInfo.color}`}
                          >
                            <option value="2">Đang trống</option>
                            <option value="3">Đã cho thuê</option>
                            <option value="0">Đang ẩn</option>
                          </select>
                        )}
                      </td>

                      {/* Hành động */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Xem trên web */}
                          <Link
                            to={`/rooms/${room.room_slug || room._id}`}
                            target="_blank"
                            className="rounded-lg p-1.5 text-[#707974] transition hover:bg-[#ECEEE7] hover:text-[#174C3C]"
                            title="Xem trang hiển thị sinh viên"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          {/* Sửa */}
                          <Link
                            to={`/owner/rooms/edit/${room._id}`}
                            className="rounded-lg p-1.5 text-[#707974] transition hover:bg-[#FFF7ED] hover:text-[#EA580C]"
                            title="Chỉnh sửa phòng"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* Xóa */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(room)}
                            className="cursor-pointer rounded-lg p-1.5 text-[#707974] transition hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                            title="Xóa phòng"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#EEF1ED] p-4 text-xs text-[#707974]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7ED] px-2.5 py-1 font-semibold text-[#B45309]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              Trang {pagination.page} / {pagination.totalPages} (Tổng {pagination.total} phòng)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchRooms(pagination.page - 1)}
                className="cursor-pointer rounded-lg border border-[#DCE4DF] px-3 py-1.5 transition hover:border-[#174C3C] hover:text-[#174C3C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trang trước
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchRooms(pagination.page + 1)}
                className="cursor-pointer rounded-lg border border-[#DCE4DF] px-3 py-1.5 transition hover:border-[#174C3C] hover:text-[#174C3C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Xác nhận Xóa */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081A13]/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#E2E8E4] bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626]">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-[#19211D]">Xác nhận xóa phòng trọ?</h3>
              <p className="mt-1 text-sm text-[#4F5A54]">
                Bạn có chắc chắn muốn xóa phòng <strong>"{deleteTarget.room_name}"</strong>? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-[#DCE4DF] py-2.5 text-sm font-semibold text-[#526159] transition hover:bg-[#FAFAF6]"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#DC2626] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B91C1C] disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xóa vĩnh viễn</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
