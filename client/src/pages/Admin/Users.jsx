import { useCallback, useEffect, useState } from "react";
import {
  Ban,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  Users as UsersIcon,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { getUsers, setUserStatus } from "../../services/Admin/Users.service";

const accountStatus = { 0: "Tạm khóa", 1: "Hoạt động", 2: "Bị cấm" };
const accountClass = {
  0: "bg-[#FFF7ED] text-[#B45309]",
  1: "bg-[#E7F0EB] text-[#174C3C]",
  2: "bg-[#FEE2E2] text-[#B91C1C]",
};
const getAccountStatus = (user) => user.is_active ?? 1;

export default function Users() {
  const [type, setType] = useState("customers");
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await getUsers(type, { search });
      setUsers(result.users || []);
    } catch (error) {
      toast.error(error.message || "Không tải được danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, [type, search]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const changeStatus = async (user, status) => {
    setBusyId(user._id);
    try {
      const result = await setUserStatus(type, user._id, status);
      toast.success(result.message || "Đã cập nhật trạng thái tài khoản.");
      setLoading(true);
      await load();
    } catch (error) {
      toast.error(error.message || "Không cập nhật được trạng thái tài khoản.");
    } finally {
      setBusyId(null);
    }
  };

  const inputClass =
    "h-10 rounded-lg border border-[#DCE4DF] bg-[#F7F7F3] px-3 text-sm text-[#19211D] outline-none transition placeholder:text-[#8A948E] focus:border-[#174C3C] focus:bg-white";

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[#E2E8E4] bg-[#F0F1EB] p-5 shadow-sm sm:p-6">
        <span className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full bg-[#174C3C]/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#174C3C] text-white shadow-sm">
            <UsersIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-[#174C3C]">Quản lý người dùng</h1>
            <p className="mt-0.5 text-sm text-[#526159]">
              Admin xem thông tin và khóa hoặc cấm tài khoản. Người dùng tự cập nhật hồ sơ.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E2E8E4] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 border-b border-[#EEF1ED] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-xl bg-[#F7F7F3] p-1">
            <button
              onClick={() => {
                setLoading(true);
                setType("customers");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                type === "customers"
                  ? "bg-[#174C3C] text-white shadow-sm"
                  : "text-[#526159] hover:text-[#174C3C]"
              }`}
            >
              Sinh viên
            </button>
            <button
              onClick={() => {
                setLoading(true);
                setType("owners");
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                type === "owners"
                  ? "bg-[#174C3C] text-white shadow-sm"
                  : "text-[#526159] hover:text-[#174C3C]"
              }`}
            >
              Chủ trọ
            </button>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setLoading(true);
              setSearch(searchInput.trim());
            }}
            className="flex flex-wrap items-center gap-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A948E]" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Tìm tên, email, số điện thoại"
                className={`${inputClass} w-full pl-9 sm:w-72`}
              />
            </div>
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#174C3C] text-white transition hover:bg-[#0F382C]"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setSearchInput("");
                if (search) {
                  setSearch("");
                } else {
                  load();
                }
              }}
              aria-label="Tải lại"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCE4DF] bg-white text-[#526159] transition hover:border-[#174C3C] hover:text-[#174C3C]"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="overflow-x-auto pt-4">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="bg-[#F7F7F3] text-[10px] font-bold uppercase tracking-wider text-[#8A948E]">
                <th className="rounded-l-lg px-4 py-3">Họ tên</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Điện thoại</th>
                {type === "owners" && <th className="px-4 py-3">CCCD</th>}
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="rounded-r-lg px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1ED]">
              {loading ? (
                <tr>
                  <td colSpan={type === "owners" ? 7 : 6} className="px-4 py-12 text-center text-sm text-[#707974]">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#174C3C]" />
                      Đang tải...
                    </span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={type === "owners" ? 7 : 6} className="px-4 py-12 text-center text-sm text-[#707974]">
                    Chưa có tài khoản nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const status = getAccountStatus(user);
                  return (
                    <tr key={user._id} className="transition hover:bg-[#FAFAF6]">
                      <td className="px-4 py-3 font-bold text-[#19211D]">{user.full_name}</td>
                      <td className="px-4 py-3 text-[#526159]">{user.email}</td>
                      <td className="px-4 py-3 text-[#526159]">{user.phone_number || "—"}</td>
                      {type === "owners" && (
                        <td className="px-4 py-3 text-[#526159]">{user.identity_card}</td>
                      )}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${accountClass[status]}`}
                        >
                          {accountStatus[status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#707974]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {status !== 0 && (
                            <button
                              disabled={busyId === user._id}
                              onClick={() => changeStatus(user, 0)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-2 text-[11px] font-semibold text-[#B45309] disabled:opacity-50"
                              title="Tạm khóa"
                            >
                              <LockKeyhole className="h-3.5 w-3.5" />
                              Khóa
                            </button>
                          )}
                          {status !== 2 && (
                            <button
                              disabled={busyId === user._id}
                              onClick={() => changeStatus(user, 2)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#FECACA] bg-[#FEE2E2] px-2.5 py-2 text-[11px] font-semibold text-[#B91C1C] disabled:opacity-50"
                              title="Cấm tài khoản"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Cấm
                            </button>
                          )}
                          {status !== 1 && (
                            <button
                              disabled={busyId === user._id}
                              onClick={() => changeStatus(user, 1)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#C7DBD0] bg-[#E7F0EB] px-2.5 py-2 text-[11px] font-semibold text-[#174C3C] disabled:opacity-50"
                              title="Mở khóa"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Mở
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
