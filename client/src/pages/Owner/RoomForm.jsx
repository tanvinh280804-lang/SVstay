import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Building2,
  DollarSign,
  MapPin,
  Check,
  Loader2,
} from "lucide-react";
import {
  createRoom,
  updateRoom,
  getOwnerRoomById,
  getRoomTypes,
} from "../../services/Owner/Room.service";

const COMMON_AMENITIES = [
  "Điều hòa",
  "Bình nóng lạnh",
  "Tủ lạnh",
  "Máy giặt",
  "Gác lửng",
  "Giường nệm",
  "Tủ quần áo",
  "Khu vực bếp",
  "Ban công thoáng",
  "Thang máy",
  "Chỗ để xe miễn phí",
  "Giờ giấc tự do",
  "Khóa vân tay / Camera 24/7",
  "Wifi tốc độ cao",
  "Không chung chủ",
];

export default function RoomForm() {
  const { roomId } = useParams();
  const isEdit = Boolean(roomId);
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRoom, setFetchingRoom] = useState(isEdit);

  // Form fields
  const [formData, setFormData] = useState({
    room_name: "",
    room_type_id: "",
    price: "",
    deposit: "",
    electricity_price: "",
    water_price: "",
    area: "",
    max_occupants: 2,
    province: "TP. Hồ Chí Minh",
    district: "",
    ward: "",
    specific_address: "",
    description: "",
    available_date: "",
    status: 2, // 2: AVAILABLE
    amenities: [],
  });

  // Images
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Load initial data
  useEffect(() => {
    getRoomTypes().then((types) => {
      setRoomTypes(types || []);
      if (!isEdit && types && types.length > 0 && !formData.room_type_id) {
        setFormData((prev) => ({ ...prev, room_type_id: types[0]._id }));
      }
    });

    if (isEdit) {
      getOwnerRoomById(roomId)
        .then((res) => {
          const room = res?.room;
          if (room) {
            setFormData({
              room_name: room.room_name || "",
              room_type_id: room.room_type_id?._id || room.room_type_id || "",
              price: room.price || "",
              deposit: room.deposit || "",
              electricity_price: room.electricity_price || "",
              water_price: room.water_price || "",
              area: room.area || "",
              max_occupants: room.max_occupants || 2,
              province: room.province || "",
              district: room.district || "",
              ward: room.ward || "",
              specific_address: room.specific_address || "",
              description: room.description || "",
              available_date: room.available_date ? room.available_date.substring(0, 10) : "",
              status: room.status ?? 2,
              amenities: room.amenities || [],
            });
            setExistingImages(room.images || []);
          }
        })
        .catch(() => {
          toast.error("Không tìm thấy thông tin phòng trọ.");
          navigate("/owner/rooms");
        })
        .finally(() => setFetchingRoom(false));
    }
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      const updated = exists
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item];
      return { ...prev, amenities: updated };
    });
  };

  // Chọn ảnh mới
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (selectedFiles.length + files.length > 10) {
      toast.warning("Chỉ được tải lên tối đa 10 ảnh.");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Tạo preview URL
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const removeSelectedFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (imgUrl) => {
    setExistingImages((prev) => prev.filter((url) => url !== imgUrl));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room_name.trim()) {
      toast.warning("Vui lòng nhập tên phòng trọ!");
      return;
    }
    if (!formData.room_type_id) {
      toast.warning("Vui lòng chọn loại phòng trọ!");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.warning("Vui lòng nhập giá thuê hợp lệ!");
      return;
    }
    if (!formData.area || Number(formData.area) <= 0) {
      toast.warning("Vui lòng nhập diện tích phòng!");
      return;
    }
    if (!formData.province.trim() || !formData.district.trim() || !formData.ward.trim() || !formData.specific_address.trim()) {
      toast.warning("Vui lòng nhập đầy đủ tỉnh/thành, quận/huyện, phường/xã và địa chỉ cụ thể!");
      return;
    }
    if (!formData.description.trim()) {
      toast.warning("Vui lòng nhập mô tả phòng trọ!");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("room_name", formData.room_name.trim());
      payload.append("room_type_id", formData.room_type_id);
      payload.append("price", Number(formData.price));
      if (formData.deposit) payload.append("deposit", Number(formData.deposit));
      if (formData.electricity_price) payload.append("electricity_price", Number(formData.electricity_price));
      if (formData.water_price) payload.append("water_price", Number(formData.water_price));
      payload.append("area", Number(formData.area));
      payload.append("max_occupants", Number(formData.max_occupants));
      payload.append("province", formData.province.trim());
      payload.append("district", formData.district.trim());
      payload.append("ward", formData.ward.trim());
      payload.append("specific_address", formData.specific_address.trim());
      payload.append("description", formData.description.trim());
      if (formData.available_date) payload.append("available_date", formData.available_date);
      payload.append("status", Number(formData.status));

      // Tiện ích
      formData.amenities.forEach((amenity) => {
        payload.append("amenities", amenity);
      });

      // Nếu đang sửa phòng và có giữ ảnh cũ
      if (isEdit) {
        existingImages.forEach((img) => {
          payload.append("existing_images", img);
        });
      }

      // Đính kèm các file ảnh mới
      selectedFiles.forEach((file) => {
        payload.append("images", file);
      });

      if (isEdit) {
        await updateRoom(roomId, payload);
        toast.success("Cập nhật phòng trọ thành công!");
      } else {
        await createRoom(payload);
        toast.success("Thêm mới phòng trọ thành công!");
      }

      navigate("/owner/rooms");
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi lưu phòng trọ.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingRoom) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Đang tải thông tin phòng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Form */}
      <div className="flex items-center gap-4">
        <Link
          to="/owner/rooms"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 flex items-center justify-center transition shadow-2xs"
          title="Quay lại danh sách"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isEdit ? "Chỉnh sửa phòng trọ" : "Đăng phòng trọ mới"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Điền thông tin chi tiết và tải ảnh để thu hút nhiều sinh viên thuê phòng hơn.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Khối 1: Thông tin cơ bản */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Thông tin cơ bản</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tên phòng trọ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="room_name"
                value={formData.room_name}
                onChange={handleChange}
                placeholder="VD: Phòng khép kín có gác lửng ban công gần ĐH Bách Khoa"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Loại phòng <span className="text-rose-500">*</span>
              </label>
              <select
                name="room_type_id"
                value={formData.room_type_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 bg-white cursor-pointer"
                required
              >
                <option value="">-- Chọn loại phòng --</option>
                {roomTypes.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.type_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Diện tích (m²) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="VD: 25"
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Số người ở tối đa
              </label>
              <input
                type="number"
                name="max_occupants"
                value={formData.max_occupants}
                onChange={handleChange}
                placeholder="VD: 2"
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Khối 2: Chi phí & Giá thuê */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>Chi phí & Giá thuê</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Giá thuê (đ/tháng) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="VD: 3000000"
                min="0"
                step="50000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tiền đặt cọc (đ)
              </label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="VD: 3000000"
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tiền điện (đ/kWh)
              </label>
              <input
                type="number"
                name="electricity_price"
                value={formData.electricity_price}
                onChange={handleChange}
                placeholder="VD: 3500"
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tiền nước (đ/tháng hoặc m³)
              </label>
              <input
                type="number"
                name="water_price"
                value={formData.water_price}
                onChange={handleChange}
                placeholder="VD: 100000"
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Khối 3: Vị trí & Địa chỉ */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-rose-600" />
            <span>Địa chỉ phòng trọ</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Tỉnh / Thành phố <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="VD: TP. Hồ Chí Minh hoặc Hà Nội"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Quận / Huyện <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="VD: Quận Cầu Giấy hoặc Thủ Đức"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phường / Xã
              </label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="VD: Phường Dịch Vọng Hậu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Địa chỉ cụ thể (Số nhà, tên đường, ngõ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="specific_address"
                value={formData.specific_address}
                onChange={handleChange}
                placeholder="VD: Số 12 ngõ 45 phố Trần Thái Tông"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                required
              />
            </div>
          </div>
        </div>

        {/* Khối 4: Tiện ích & Mô tả */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Check className="w-5 h-5 text-indigo-600" />
            <span>Tiện ích & Mô tả</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Các tiện ích sẵn có (Chọn nhiều)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {COMMON_AMENITIES.map((amenity) => {
                const checked = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition border flex items-center justify-between cursor-pointer ${
                      checked
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{amenity}</span>
                    {checked && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mô tả chi tiết phòng trọ
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả về không gian, giờ giấc, an ninh, khoảng cách tới các trường đại học lân cận, tiện ích xung quanh..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800 resize-y"
            />
          </div>
        </div>

        {/* Khối 5: Tải lên hình ảnh */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <span>Hình ảnh thực tế của phòng (Tối đa 10 ảnh)</span>
          </h2>

          {/* Vùng chọn ảnh */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Nhấp vào đây để chọn ảnh từ máy tính
              </p>
              <p className="text-xs text-slate-400">
                Định dạng JPG, PNG, WEBP. Ảnh sắc nét giúp phòng được thuê nhanh hơn 80%!
              </p>
            </label>
          </div>

          {/* Xem trước ảnh đã chọn hoặc ảnh cũ */}
          {(existingImages.length > 0 || previewUrls.length > 0) && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ảnh đã tải lên ({existingImages.length + previewUrls.length}/10)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {/* Ảnh cũ (khi sửa) */}
                {existingImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={url} alt="Room" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition"
                      title="Xóa ảnh này"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] bg-slate-900/70 text-white px-1.5 py-0.5 rounded">
                      Đã lưu
                    </span>
                  </div>
                ))}

                {/* Ảnh mới chọn */}
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-blue-200 group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition"
                      title="Gỡ ảnh"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-semibold">
                      Mới
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nút Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/owner/rooms"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý dữ liệu...</span>
              </>
            ) : (
              <span>{isEdit ? "Lưu thay đổi" : "Đăng phòng ngay"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
