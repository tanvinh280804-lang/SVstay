import { useCallback, useEffect, useState } from "react";
import { Ban, LockKeyhole, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { getUsers, setUserStatus } from "../../services/Admin/Users.service";

const accountStatus = { 0: "Tạm khóa", 1: "Hoạt động", 2: "Bị cấm" };
const getAccountStatus = (user) => user.is_active ?? 1;

export default function Users() {
  const [type, setType] = useState("customers");
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers(type, { search });
      setUsers(result.users || []);
    } catch (error) {
      toast.error(error.message || "Không tải được danh sách người dùng.");
    } finally { setLoading(false); }
  }, [type, search, refresh]);
  useEffect(() => { load(); }, [load]);

  const changeStatus = async (user, status) => {
    setBusyId(user._id);
    try {
      const result = await setUserStatus(type, user._id, status);
      toast.success(result.message || "Đã cập nhật trạng thái tài khoản.");
      setRefresh((value) => value + 1);
    } catch (error) { toast.error(error.message || "Không cập nhật được trạng thái tài khoản."); }
    finally { setBusyId(null); }
  };

  return <section className="space-y-5">
    <header><h1 className="text-xl font-bold text-slate-800">Quản lý người dùng</h1><p className="mt-1 text-sm text-slate-500">Admin chỉ xem thông tin và khóa hoặc cấm tài khoản. Người dùng tự cập nhật hồ sơ của mình.</p></header>
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3">
      <div className="flex gap-2"><button onClick={() => setType("customers")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${type === "customers" ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600"}`}>Customers</button><button onClick={() => setType("owners")} className={`rounded-lg px-4 py-2 text-sm font-semibold ${type === "owners" ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600"}`}>Owners</button></div>
      <form onSubmit={(event) => { event.preventDefault(); setSearch(searchInput.trim()); }} className="flex gap-2"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Tìm tên, email, số điện thoại" className="w-64 rounded-lg border py-2 pl-9 pr-3 text-sm"/></div><button className="rounded-lg border px-3" aria-label="Tìm kiếm"><Search size={17}/></button><button type="button" onClick={() => { setSearchInput(""); setSearch(""); setRefresh((value) => value + 1); }} className="rounded-lg border px-3" aria-label="Tải lại"><RefreshCw size={17}/></button></form>
    </div>
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Họ tên</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Điện thoại</th>{type === "owners" && <th className="px-4 py-3">CCCD</th>}<th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Ngày tạo</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-100">
      {loading ? <tr><td colSpan={type === "owners" ? 7 : 6} className="p-8 text-center text-slate-500">Đang tải...</td></tr> : users.length === 0 ? <tr><td colSpan={type === "owners" ? 7 : 6} className="p-8 text-center text-slate-500">Chưa có tài khoản nào.</td></tr> : users.map((user) => { const status = getAccountStatus(user); return <tr key={user._id} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold text-slate-800">{user.full_name}</td><td className="px-4 py-3 text-slate-600">{user.email}</td><td className="px-4 py-3 text-slate-600">{user.phone_number || "—"}</td>{type === "owners" && <td className="px-4 py-3 text-slate-600">{user.identity_card}</td>}<td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === 2 ? "bg-rose-50 text-rose-700" : status === 0 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{accountStatus[status]}</span></td><td className="px-4 py-3 text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "—"}</td><td className="px-4 py-3"><div className="flex justify-end gap-2">{status !== 0 && <button disabled={busyId === user._id} onClick={() => changeStatus(user, 0)} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 px-2.5 py-2 text-xs font-semibold text-amber-800 disabled:opacity-50" title="Tạm khóa"><LockKeyhole size={14}/>Khóa</button>}{status !== 2 && <button disabled={busyId === user._id} onClick={() => changeStatus(user, 2)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 py-2 text-xs font-semibold text-rose-700 disabled:opacity-50" title="Cấm tài khoản"><Ban size={14}/>Cấm</button>}{status !== 1 && <button disabled={busyId === user._id} onClick={() => changeStatus(user, 1)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 px-2.5 py-2 text-xs font-semibold text-emerald-700 disabled:opacity-50" title="Mở khóa"><ShieldCheck size={14}/>Mở khóa</button>}</div></td></tr>; })}
    </tbody></table></div>

  </section>;
}
