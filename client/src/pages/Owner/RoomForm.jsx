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

const inputClass =
  "w-full rounded-lg border border-[#DCE4DF] bg-[#F7F7F3] px-4 py-2.5 text-sm text-[#19211D] outline-none transition placeholder:text-[#8A948E] focus:border-[#174C3C] focus:bg-white";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#526159]";

const sectionClass =
  "space-y-5 rounded-2xl border border-[#E2E8E4] bg-white p-6 shadow-sm";

const sectionTitleClass =
  "flex items-center gap-2 border-b border-[#EEF1ED] pb-3 text-base font-bold text-[#19211D]";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form chỉ tải lại theo roomId
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
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#707974]">
        <Loader2 className="h-8 w-8 animate-spin text-[#174C3C]" />
        <p className="text-sm font-medium">Đang tải thông tin phòng...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header Form */}
      <div className="flex items-center gap-4">
        <Link
          to="/owner/rooms"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE4DF] bg-white text-[#526159] shadow-sm transition hover:border-[#174C3C] hover:text-[#174C3C]"
          title="Quay lại danh sách"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#174C3C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            SVstay · Chủ trọ
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#14261F]">
            {isEdit ? "Chỉnh sửa phòng trọ" : "Đăng phòng trọ mới"}
          </h1>
          <p className="mt-1 text-xs text-[#4F5A54] sm:text-sm">
            Điền thông tin chi tiết và tải ảnh để thu hút nhiều sinh viên thuê phòng hơn.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Khối 1: Thông tin cơ bản */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>
            <Building2 className="h-5 w-5 text-[#174C3C]" />
            <span>Thông tin cơ bản</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Tên phòng trọ <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                name="room_name"
                value={formData.room_name}
                onChange={handleChange}
                placeholder="VD: Phòng khép kín có gác lửng ban công gần ĐH Bách Khoa"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Loại phòng <span className="text-[#DC2626]">*</span>
              </label>
              <select
                name="room_type_id"
                value={formData.room_type_id}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
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
              <label className={labelClass}>
                Diện tích (m²) <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="VD: 25"
                min="1"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Số người ở tối đa</label>
              <input
                type="number"
                name="max_occupants"
                value={formData.max_occupants}
                onChange={handleChange}
                placeholder="VD: 2"
                min="1"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Khối 2: Chi phí & Giá thuê */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>
            <DollarSign className="h-5 w-5 text-[#EA580C]" />
            <span>Chi phí & Giá thuê</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClass}>
                Giá thuê (đ/tháng) <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="VD: 3000000"
                min="0"
                step="50000"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Tiền đặt cọc (đ)</label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="VD: 3000000"
                min="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Tiền điện (đ/kWh)</label>
              <input
                type="number"
                name="electricity_price"
                value={formData.electricity_price}
                onChange={handleChange}
                placeholder="VD: 3500"
                min="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Tiền nước (đ/tháng hoặc m³)</label>
              <input
                type="number"
                name="water_price"
                value={formData.water_price}
                onChange={handleChange}
                placeholder="VD: 100000"
                min="0"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Khối 3: Vị trí & Địa chỉ */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>
            <MapPin className="h-5 w-5 text-[#174C3C]" />
            <span>Địa chỉ phòng trọ</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>
                Tỉnh / Thành phố <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder="VD: TP. Hồ Chí Minh hoặc Hà Nội"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                Quận / Huyện <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="VD: Quận Cầu Giấy hoặc Thủ Đức"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Phường / Xã</label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="VD: Phường Dịch Vọng Hậu"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-3">
              <label className={labelClass}>
                Địa chỉ cụ thể (Số nhà, tên đường, ngõ) <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                name="specific_address"
                value={formData.specific_address}
                onChange={handleChange}
                placeholder="VD: Số 12 ngõ 45 phố Trần Thái Tông"
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>

        {/* Khối 4: Tiện ích & Mô tả */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>
            <Check className="h-5 w-5 text-[#174C3C]" />
            <span>Tiện ích & Mô tả</span>
          </h2>

          <div>
            <label className={`${labelClass} mb-2`}>Các tiện ích sẵn có (Chọn nhiều)</label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
              {COMMON_AMENITIES.map((amenity) => {
                const checked = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex cursor-pointer items-center justify-between gap-1 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                      checked
                        ? "border-[#174C3C] bg-[#ECEEE7] text-[#174C3C]"
                        : "border-[#DCE4DF] bg-[#FAFAF6] text-[#526159] hover:bg-[#F7F7F3]"
                    }`}
                  >
                    <span className="truncate">{amenity}</span>
                    {checked && <Check className="ml-1 h-3.5 w-3.5 shrink-0 text-[#174C3C]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Mô tả chi tiết phòng trọ</label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả về không gian, giờ giấc, an ninh, khoảng cách tới các trường đại học lân cận, tiện ích xung quanh..."
              className={`${inputClass} resize-y py-3`}
            />
          </div>
        </div>

        {/* Khối 5: Tải lên hình ảnh */}
        <div className={sectionClass}>
          <h2 className={sectionTitleClass}>
            <UploadCloud className="h-5 w-5 text-[#174C3C]" />
            <span>Hình ảnh thực tế của phòng (Tối đa 10 ảnh)</span>
          </h2>

          {/* Vùng chọn ảnh */}
          <div className="rounded-2xl border-2 border-dashed border-[#C7DBD0] p-6 text-center transition-colors hover:border-[#174C3C]">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECEEE7] text-[#174C3C]">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-[#19211D]">
                Nhấp vào đây để chọn ảnh từ máy tính
              </p>
              <p className="text-xs text-[#9A3412]">
                Định dạng JPG, PNG, WEBP. Ảnh sắc nét giúp phòng được thuê nhanh hơn 80%!
              </p>
            </label>
          </div>

          {/* Xem trước ảnh đã chọn hoặc ảnh cũ */}
          {(existingImages.length > 0 || previewUrls.length > 0) && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#526159]">
                Ảnh đã tải lên ({existingImages.length + previewUrls.length}/10)
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {/* Ảnh cũ (khi sửa) */}
                {existingImages.map((url, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-[#DCE4DF]">
                    <img src={url} alt="Room" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F382C]/85 text-white transition hover:bg-[#DC2626]"
                      title="Xóa ảnh này"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 rounded bg-[#174C3C] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Đã lưu
                    </span>
                  </div>
                ))}

                {/* Ảnh mới chọn */}
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-[#FED7AA]">
                    <img src={url} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#DC2626] text-white transition hover:bg-[#B91C1C]"
                      title="Gỡ ảnh"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 rounded bg-[#EA580C] px-1.5 py-0.5 text-[10px] font-semibold text-white">
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
            className="rounded-xl border border-[#DCE4DF] px-5 py-2.5 text-sm font-semibold text-[#526159] transition hover:bg-[#FAFAF6]"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#174C3C] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0F382C] disabled:bg-[#8AA79B] disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
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
