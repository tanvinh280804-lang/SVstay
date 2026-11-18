import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Tag,
  SlidersHorizontal,
  Plus,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAllRoomTypes, createRoomType } from "../../services/Admin/RoomTypes.service";

export default function RoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Bộ lọc & tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'inactive'

  // Modal thêm mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type_name: "",
    description: "",
  });

  useEffect(() => {
    let isMounted = true;

    getAllRoomTypes()
      .then((res) => {
        if (isMounted) {
          // Backend trả về dạng { message: "...", roomType: [...] }
          const list = res?.roomType || res?.data || (Array.isArray(res) ? res : []);
          setRoomTypes(list);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Không thể tải danh sách loại phòng.";
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Xử lý tạo loại phòng mới
  const handleOpenAddModal = () => {
    setFormData({ type_name: "", description: "" });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    if (!submitting) {
      setIsAddModalOpen(false);
    }
  };

  const handleCreateRoomType = async (e) => {
    e.preventDefault();
    if (!formData.type_name.trim()) {
      toast.warning("Vui lòng nhập tên loại phòng.");
      return;
    }
    if (!formData.description.trim()) {
      toast.warning("Vui lòng nhập mô tả loại phòng.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createRoomType({
        type_name: formData.type_name.trim(),
        description: formData.description.trim(),
      });

      toast.success(res?.message || "Thêm loại phòng thành công!");
      handleCloseAddModal();
      handleRefresh();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Lỗi khi thêm loại phòng.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm và trạng thái
  const filteredRoomTypes = useMemo(() => {
    return roomTypes.filter((item) => {
      const matchSearch =
        item.type_name?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.type_slug?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item._id?.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? (item.is_active ?? item.isActive) === true
          : (item.is_active ?? item.isActive) === false;

      return matchSearch && matchStatus;
    });
  }, [roomTypes, searchTerm, statusFilter]);

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6">
      {/* Tiêu đề trang & Thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8E4] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E7F0EB] text-[#174C3C] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#19211D]">Quản lý loại phòng</h1>
            <p className="text-sm text-[#707974]">
              Danh sách các loại phòng cho thuê hiện có trên hệ thống.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-medium text-[#34443C] bg-[#ECEEE7] hover:bg-[#E2E8E4] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#174C3C] hover:bg-[#0F382C] rounded-xl transition-colors shadow-sm shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm loại phòng</span>
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8E4] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A948E]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, slug hoặc mô tả..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F7F3] border border-[#E2E8E4] rounded-xl focus:outline-none focus:border-[#174C3C] focus:bg-white transition-all placeholder:text-[#8A948E] text-[#19211D]"
          />
        </div>

        {/* Filter status */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-[#8A948E] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-2 text-sm bg-[#F7F7F3] border border-[#E2E8E4] rounded-xl focus:outline-none focus:border-[#174C3C] text-[#34443C] cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã tạm dừng</option>
          </select>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#E7F0EB] text-[#174C3C] whitespace-nowrap">
            {filteredRoomTypes.length} / {roomTypes.length} loại
          </span>
        </div>
      </div>

      {/* Trạng thái Đang tải */}
      {loading && (
        <div className="bg-white p-12 rounded-2xl border border-[#E2E8E4] text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E7F0EB] text-[#174C3C] mb-3 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-[#526159]">
            Đang tải danh sách loại phòng...
          </p>
        </div>
      )}

      {/* Trạng thái Lỗi */}
      {!loading && error && (
        <div className="bg-[#FFF7ED] border border-[#FED7AA] p-6 rounded-2xl text-[#B45309]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#B45309] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-base text-[#7C2D12]">
                Không thể tải dữ liệu loại phòng
              </h3>
              <p className="text-sm text-[#B45309] mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-3 px-4 py-1.5 bg-[#B45309] text-white text-xs font-semibold rounded-lg hover:bg-[#9A3412] transition cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bảng danh sách loại phòng */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-[#E2E8E4] shadow-sm overflow-hidden">
          {filteredRoomTypes.length === 0 ? (
            <div className="p-12 text-center text-[#8A948E]">
              <Package className="w-12 h-12 mx-auto stroke-1 text-[#C4CDC7] mb-2" />
              <p className="text-sm font-medium text-[#526159]">Không tìm thấy loại phòng nào</p>
              <p className="text-xs text-[#8A948E] mt-1">
                Thử điều chỉnh từ khóa tìm kiếm hoặc bấm &quot;Thêm loại phòng&quot; để tạo mới.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F7F3] border-b border-[#E2E8E4] text-xs font-bold uppercase tracking-wider text-[#707974]">
                    <th className="py-3.5 px-4 w-12 text-center">STT</th>
                    <th className="py-3.5 px-4 min-w-[220px]">Tên loại phòng</th>
                    <th className="py-3.5 px-4 min-w-[180px]">Slug</th>
                    <th className="py-3.5 px-4 min-w-[300px]">Mô tả</th>
                    <th className="py-3.5 px-4 min-w-[130px] text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF1ED] text-sm">
                  {filteredRoomTypes.map((item, index) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[#FAFAF6] transition-colors"
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center font-medium text-[#8A948E]">
                        {index + 1}
                      </td>

                      {/* Tên loại phòng */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#19211D]">
                          {item.type_name}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ECEEE7] text-[#526159] text-xs font-mono">
                          <Tag className="w-3 h-3 text-[#8A948E]" />
                          {item.type_slug}
                        </span>
                      </td>

                      {/* Mô tả */}
                      <td className="py-3.5 px-4 text-[#526159] text-xs sm:text-sm leading-relaxed">
                        {item.description || (
                          <span className="italic text-[#8A948E]">Chưa có mô tả</span>
                        )}
                      </td>

                      {/* Trạng thái is_active */}
                      <td className="py-3.5 px-4 text-center">
                        {(item.is_active ?? item.isActive) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7F0EB] text-[#174C3C] border border-[#C7DBD0]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ECEEE7] text-[#707974] border border-[#E2E8E4]">
                            <XCircle className="w-3.5 h-3.5" />
                            Tạm dừng
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal thêm mới loại phòng */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#19211D]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8E4] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-[#EEF1ED]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#E7F0EB] text-[#174C3C] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#19211D]">Thêm loại phòng mới</h3>
                  <p className="text-xs text-[#707974]">Tạo mới phân loại phòng cho hệ thống</p>
                </div>
              </div>
              <button
                onClick={handleCloseAddModal}
                disabled={submitting}
                className="p-1.5 text-[#8A948E] hover:text-[#526159] hover:bg-[#ECEEE7] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateRoomType} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#34443C] uppercase tracking-wider mb-1.5">
                  Tên loại phòng <span className="text-[#EA580C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phòng đơn, Ký túc xá, Căn hộ mini..."
                  value={formData.type_name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type_name: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F7F3] border border-[#E2E8E4] rounded-xl focus:outline-none focus:border-[#174C3C] focus:bg-white transition-all text-[#19211D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#34443C] uppercase tracking-wider mb-1.5">
                  Mô tả loại phòng <span className="text-[#EA580C]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mô tả thông tin chi tiết về loại phòng này..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F7F3] border border-[#E2E8E4] rounded-xl focus:outline-none focus:border-[#174C3C] focus:bg-white transition-all text-[#19211D] resize-none"
                />
              </div>

              {/* Preview slug tự động */}
              {formData.type_name && (
                <div className="flex items-center gap-2 p-2.5 bg-[#F7F7F3] rounded-xl border border-[#E2E8E4] text-xs text-[#707974]">
                  <Tag className="w-3.5 h-3.5 text-[#8A948E] shrink-0" />
                  <span>Slug dự kiến:</span>
                  <code className="font-mono text-[#174C3C] font-semibold">
                    {formData.type_name.toLowerCase().trim().replace(/\s+/g, "-")}
                  </code>
                </div>
              )}

              {/* Footer hành động */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EEF1ED]">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-[#526159] hover:bg-[#ECEEE7] rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#174C3C] hover:bg-[#0F382C] rounded-xl transition-colors shadow-sm shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? "Đang lưu..." : "Lưu loại phòng"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
