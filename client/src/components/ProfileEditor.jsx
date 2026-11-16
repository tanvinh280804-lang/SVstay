import { useEffect, useState } from "react";
import { Loader2, Save, UserRound } from "lucide-react";
import { toast } from "react-toastify";

export default function ProfileEditor({ title, description, fields, loadProfile, saveProfile }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    loadProfile().then((result) => {
      const data = result?.profile || result?.admin || result?.customer || result?.owner;
      if (active) { setProfile(data); setForm(Object.fromEntries(fields.map(({ key }) => [key, data?.[key] || ""]))); }
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

  return <main className="mx-auto w-full max-w-4xl space-y-5">
    <header><h1 className="text-2xl font-bold text-slate-800">{title}</h1><p className="mt-1 text-sm text-slate-500">{description}</p></header>
    {loading ? <div className="rounded-2xl border bg-white p-12 text-center text-slate-500"><Loader2 className="mx-auto mb-2 animate-spin"/>Đang tải hồ sơ...</div> : !profile ? <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">Không tải được hồ sơ tài khoản.</div> : <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-teal-700">{(profile.avatar || profile.avatar_url) ? <img className="h-full w-full object-cover" src={profile.avatar || profile.avatar_url} alt="Ảnh đại diện"/> : <UserRound/>}</div><div><p className="font-bold text-slate-800">{profile.full_name || profile.username}</p><p className="text-sm text-slate-500">{profile.email}</p></div></div>
      <div className="grid gap-4 sm:grid-cols-2">{fields.map(({ key, label, required = false, type = "text" }) => <label key={key} className="space-y-1.5 text-sm font-semibold text-slate-700">{label}<input type={type} required={required} value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"/></label>)}</div>
      <section className="space-y-4 border-t border-slate-100 pt-5"><div><h2 className="font-bold text-slate-800">Đổi mật khẩu</h2><p className="text-xs text-slate-500">Để trống nếu không muốn đổi.</p></div><div className="grid gap-4 sm:grid-cols-3">{[["current_password","Mật khẩu hiện tại"],["new_password","Mật khẩu mới"],["confirm_password","Xác nhận mật khẩu mới"]].map(([key,label]) => <label key={key} className="space-y-1.5 text-sm font-semibold text-slate-700">{label}<input type="password" autoComplete="new-password" value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"/></label>)}</div></section>
      <div className="flex justify-end"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 font-bold text-white disabled:opacity-50"><Save size={17}/>{saving ? "Đang lưu..." : "Lưu thay đổi"}</button></div>
    </form>}
  </main>;
}
