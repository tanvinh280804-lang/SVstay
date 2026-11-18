import { useEffect, useState } from "react";
import {
  CalendarDays,
  Image as ImageIcon,
  Lightbulb,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

const fieldIcons = {
  full_name: UserRound,
  username: UserRound,
  email: Mail,
  phone_number: Phone,
  phone: Phone,
  avatar: ImageIcon,
  avatar_url: ImageIcon,
  identity_card: ShieldCheck,
  address: MapPin,
};

const inputClass =
  "h-11 w-full rounded-lg bg-[#F7F7F3] px-3.5 text-sm text-[#19211D] outline-none transition placeholder:text-[#8A948E] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/20";

const passwordFields = [
  ["current_password", "Mật khẩu hiện tại"],
  ["new_password", "Mật khẩu mới"],
  ["confirm_password", "Xác nhận mật khẩu mới"],
];

const getPasswordStrength = (value) => {
  if (!value) return { level: 0, label: "", bar: "", text: "" };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  if (score <= 1) return { level: 1, label: "Yếu", bar: "bg-[#DC2626]", text: "text-[#DC2626]" };
  if (score === 2) return { level: 2, label: "Trung bình", bar: "bg-[#EA580C]", text: "text-[#EA580C]" };
  if (score === 3) return { level: 3, label: "Khá", bar: "bg-[#F59E0B]", text: "text-[#B45309]" };
  return { level: 4, label: "Mạnh", bar: "bg-[#174C3C]", text: "text-[#174C3C]" };
};

export default function ProfileEditor({ title, description, fields, loadProfile, saveProfile }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadProfile().then((result) => {
      const data = result?.profile || result?.admin || result?.customer || result?.owner;
      if (active) {
        setAvatarFailed(false);
        setProfile(data);
        setForm(Object.fromEntries(fields.map(({ key }) => [key, data?.[key] || ""])));
      }
    }).catch((error) => { if (active) toast.error(error.message || "Không tải được hồ sơ."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [loadProfile, fields]);

  const submit = async (event) => {
    event.preventDefault();
    if (form.new_password && form.new_password !== form.confirm_password) { toast.error("Mật khẩu xác nhận không khớp."); return; }
    const payload = { ...form };
    delete payload.confirm_password;
    if (!payload.new_password) { delete payload.new_password; delete payload.current_password; }
    try {
      setSaving(true);
      const result = await saveProfile(payload);
      const updated = result?.profile || result?.admin || result?.customer || result?.owner;
      if (updated) { setProfile(updated); setForm(Object.fromEntries(fields.map(({ key }) => [key, updated[key] || ""]))); }
      toast.success(result?.message || "Đã cập nhật hồ sơ.");
    } catch (error) { toast.error(error.message || "Không thể cập nhật hồ sơ."); }
    finally { setSaving(false); }
  };

  const avatarSrc = profile?.avatar || profile?.avatar_url || "";
  const displayName = profile?.full_name || profile?.username || "Người dùng";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const secondaryPhone = profile?.phone_number || profile?.phone || "Chưa cập nhật";
  const joinedLabel = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
    : null;
  const strength = getPasswordStrength(form.new_password || "");

  return (
    <main
      className="w-full bg-[#F5F5F0] py-8 text-[#19211D] sm:py-10"
      style={{ fontFamily: '"Be Vietnam Pro", Inter, system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <div className="mb-6">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#174C3C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            SVstay · Tài khoản
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#14261F] sm:text-[32px]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[#4F5A54]">{description}</p>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#E2E8E4] bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#174C3C]" />
              <p className="mt-3 text-sm text-[#4F5A54]">Đang tải hồ sơ...</p>
            </div>
          </div>
        ) : !profile ? (
          <div className="rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#EA580C]">
              <UserRound size={22} />
            </span>
            <p className="mt-4 text-base font-bold text-[#19211D]">Không tải được hồ sơ tài khoản.</p>
            <p className="mt-1 text-sm text-[#9A3412]">Vui lòng thử lại sau.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Thẻ hồ sơ */}
            <aside className="lg:col-span-4 lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-2xl border border-[#E2E8E4] bg-white shadow-sm">
                <div className="relative h-14 overflow-hidden bg-[#174C3C]">
                  <span className="absolute -right-4 -top-8 h-20 w-20 rounded-full bg-[#F59E0B]/25 blur-xl" />
                  <span className="absolute bottom-2 right-4 rounded-full border border-[#FCD34D]/40 bg-[#F59E0B]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FDE68A]">
                    SVstay Member
                  </span>
                </div>
                <div className="px-6 pb-6">
                  <div className="relative z-10 -mt-8 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#ECEEE7] text-xl font-bold text-[#174C3C] shadow-sm">
                    {avatarSrc && !avatarFailed ? (
                      <img
                        src={avatarSrc}
                        alt={`Ảnh đại diện ${displayName}`}
                        className="h-full w-full object-cover"
                        onError={() => setAvatarFailed(true)}
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <h2 className="mt-3 truncate text-lg font-bold text-[#14261F]">{displayName}</h2>
                  <p className="truncate text-sm text-[#4F5A54]">{profile.email}</p>

                  <div className="mt-5 space-y-3 border-t border-[#ECEEE7] pt-5">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="shrink-0 text-[#174C3C]" />
                      <span className="truncate text-[#4F5A54]">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="shrink-0 text-[#174C3C]" />
                      <span className="truncate text-[#4F5A54]">{secondaryPhone}</span>
                    </div>
                    {joinedLabel ? (
                      <div className="flex items-center gap-3 text-sm">
                        <CalendarDays size={16} className="shrink-0 text-[#EA580C]" />
                        <span className="text-[#4F5A54]">Tham gia từ {joinedLabel}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-xl bg-[#FFF7ED] p-3 text-[11px] leading-relaxed text-[#9A3412]">
                    Thông tin hồ sơ chỉ được chính chủ tài khoản cập nhật.
                  </div>
                </div>
              </div>
            </aside>

            {/* Form chỉnh sửa */}
            <div className="space-y-6 lg:col-span-8">
              <section className="rounded-2xl border border-[#E2E8E4] bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECEEE7] text-[#174C3C]">
                    <UserRound size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#19211D]">Thông tin cá nhân</h2>
                    <p className="text-[11px] text-[#707974]">Cập nhật thông tin hiển thị trên tài khoản</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {fields.map(({ key, label, required = false, type = "text" }) => {
                    const Icon = fieldIcons[key] || UserRound;
                    return (
                      <label
                        key={key}
                        className={key === "avatar" || key === "avatar_url" ? "sm:col-span-2" : ""}
                      >
                        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#526159]">
                          <Icon size={14} className="text-[#174C3C]" />
                          {label}
                        </span>
                        <input
                          type={type}
                          required={required}
                          value={form[key] || ""}
                          onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                          className={inputClass}
                        />
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-[#E2E8E4] bg-white p-6 shadow-sm sm:p-7">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#EA580C]">
                    <LockKeyhole size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#19211D]">Đổi mật khẩu</h2>
                    <p className="text-[11px] text-[#707974]">Để trống nếu không muốn thay đổi mật khẩu</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {passwordFields.map(([key, label]) => (
                    <label key={key}>
                      <span className="mb-1.5 block text-xs font-semibold text-[#526159]">{label}</span>
                      <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={form[key] || ""}
                        onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                        className={inputClass}
                      />
                    </label>
                  ))}

                  {strength.level > 0 ? (
                    <div className="sm:col-span-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold text-[#526159]">Độ an toàn mật khẩu</span>
                        <span className={`text-[11px] font-bold ${strength.text}`}>{strength.label}</span>
                      </div>
                      <div className="mt-2 flex gap-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <span
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              step <= strength.level ? strength.bar : "bg-[#E8E9E3]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-3">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-[#EA580C]" />
                  <p className="text-[11px] leading-relaxed text-[#9A3412]">
                    Mật khẩu mạnh nên có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                  </p>
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#707974]">Kiểm tra thông tin trước khi lưu thay đổi.</p>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#174C3C] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f362a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
