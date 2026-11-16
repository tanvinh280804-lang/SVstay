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
  2: { label: "Đang trống", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  3: { label: "Đã cho thuê", color: "bg-blue-50 text-blue-700 border-blue-200" },
  1: { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200" },
  0: { label: "Đang ẩn", color: "bg-slate-100 text-slate-700 border-slate-200" },
};

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
    fetchRooms(1);
    getRoomTypes().then((types) => setRoomTypes(types || []));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Quản lý phòng trọ
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Xem danh sách, kiểm soát tình trạng và cập nhật thông tin phòng của bạn.
          </p>
        </div>

        <Link
          to="/owner/rooms/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm shadow-blue-500/25 transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm phòng mới</span>
        </Link>
      </div>

      {/* 4 Thẻ Thống kê nhanh */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng số phòng</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {statistics?.totalRooms ?? pagination.total ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Đang trống</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">
              {statistics?.availableRooms ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Đã cho thuê</p>
            <p className="text-xl font-bold text-indigo-600 mt-0.5">
              {statistics?.rentedRooms ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Chờ duyệt / Ẩn</p>
            <p className="text-xl font-bold text-amber-600 mt-0.5">
              {(statistics?.pendingRooms ?? 0) + (statistics?.hiddenRooms ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Thanh Tìm kiếm và Lọc */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên phòng, địa chỉ, mô tả..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
            />
          </div>

          <div className="sm:col-span-3 lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="2">Đang trống</option>
              <option value="3">Đã cho thuê</option>
              <option value="1">Chờ duyệt</option>
              <option value="0">Đang ẩn</option>
            </select>
          </div>

          <div className="sm:col-span-3 lg:col-span-2">
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white cursor-pointer"
            >
              <option value="all">Tất cả loại phòng</option>
              {roomTypes.map((type) => <option key={type._id} value={type._id}>{type.type_name}</option>)}
            </select>
          </div>

          <div className="sm:col-span-12 lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition cursor-pointer"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Danh sách phòng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium">Đang tải danh sách phòng...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Chưa có phòng trọ nào</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              Bạn chưa đăng phòng trọ nào hoặc không có phòng nào phù hợp với bộ lọc hiện tại.
            </p>
            <Link
              to="/owner/rooms/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng phòng đầu tiên ngay</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Ảnh & Tên phòng</th>
                  <th className="py-3.5 px-4">Loại phòng</th>
                  <th className="py-3.5 px-4">Giá thuê</th>
                  <th className="py-3.5 px-4">Diện tích</th>
                  <th className="py-3.5 px-4">Địa chỉ</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((room) => {
                  const statusInfo = STATUS_MAP[room.status] || {
                    label: "Khác",
                    color: "bg-slate-100 text-slate-700 border-slate-200",
                  };
                  const thumb =
                    room.images && room.images.length > 0
                      ? room.images[0]
                      : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80";

                  return (
                    <tr key={room._id} className="hover:bg-slate-50/70 transition">
                      {/* Ảnh & Tên phòng */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt={room.room_name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 truncate hover:text-blue-600 transition">
                              {room.room_name}
                            </h4>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {room.room_slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Loại phòng */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {room.room_type_id?.type_name || "Phòng trọ"}
                      </td>

                      {/* Giá thuê */}
                      <td className="py-3.5 px-4 font-bold text-blue-600 whitespace-nowrap">
                        {formatPrice(room.price)}
                        <span className="text-xs font-normal text-slate-400 block">/tháng</span>
                      </td>

                      {/* Diện tích */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <span className="font-semibold">{room.area}m²</span>
                        <span className="text-xs text-slate-400 block">
                          Tối đa {room.max_occupants || 2} người
                        </span>
                      </td>

                      {/* Địa chỉ */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px]">
                        <p className="truncate text-xs">
                          {room.specific_address || ""}, {room.district || ""}, {room.province || ""}
                        </p>
                      </td>

                      {/* Trạng thái & Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {room.status === 1 ? (
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusInfo.color}`}>Chờ admin duyệt</span>
                        ) : (
                          <select
                            value={room.status}
                            onChange={(e) => handleToggleStatus(room, e.target.value)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer outline-none ${statusInfo.color}`}
                          >
                            <option value="2">Đang trống</option>
                            <option value="3">Đã cho thuê</option>
                            <option value="0">Đang ẩn</option>
                          </select>
                        )}
                      </td>

                      {/* Hành động */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Xem trên web */}
                          <Link
                            to={`/rooms/${room.room_slug || room._id}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Xem trang hiển thị sinh viên"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Sửa */}
                          <Link
                            to={`/owner/rooms/edit/${room._id}`}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Chỉnh sửa phòng"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Xóa */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(room)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Xóa phòng"
                          >
                            <Trash2 className="w-4 h-4" />
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
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Trang {pagination.page} / {pagination.totalPages} (Tổng {pagination.total} phòng)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchRooms(pagination.page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Trang trước
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchRooms(pagination.page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Xác nhận Xóa */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-800">Xác nhận xóa phòng trọ?</h3>
              <p className="text-sm text-slate-500 mt-1">
                Bạn có chắc chắn muốn xóa phòng <strong>"{deleteTarget.room_name}"</strong>? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition shadow-sm shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
