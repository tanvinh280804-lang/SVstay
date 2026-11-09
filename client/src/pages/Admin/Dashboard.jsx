import {
  Users,
  Package,
  ClipboardList,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

const statistics = [
  {
    title: "Tổng người dùng",
    value: "1,250",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Tổng sản phẩm",
    value: "350",
    change: "+8.2%",
    icon: Package,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Tổng đơn hàng",
    value: "568",
    change: "+15.3%",
    icon: ClipboardList,
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Doanh thu",
    value: "125.500.000đ",
    change: "+10.8%",
    icon: DollarSign,
    color: "text-rose-600 bg-rose-50",
  },
];

const orders = [
  {
    id: "#ORD001",
    customer: "Nguyễn Văn A",
    date: "02/11/2026",
    total: "500.000đ",
    status: "Hoàn thành",
  },
  {
    id: "#ORD002",
    customer: "Trần Thị B",
    date: "02/11/2026",
    total: "750.000đ",
    status: "Đang xử lý",
  },
  {
    id: "#ORD003",
    customer: "Lê Văn C",
    date: "01/11/2026",
    total: "320.000đ",
    status: "Chờ xác nhận",
  },
  {
    id: "#ORD004",
    customer: "Phạm Thị D",
    date: "01/11/2026",
    total: "950.000đ",
    status: "Hoàn thành",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Dashboard Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chào mừng bạn quay trở lại trang quản trị!
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200 shadow-2xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>02/11/2026</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statistics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{item.title}</span>
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  {item.value}
                </h2>

                <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{item.change}</span>
                  </span>
                  <span>so với tháng trước</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <section className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Đơn hàng gần đây</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi các đơn hàng mới nhất
            </p>
          </div>

          <button className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer self-start sm:self-auto">
            Xem tất cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80">
                <th className="py-3.5 px-5">Mã đơn hàng</th>
                <th className="py-3.5 px-5">Khách hàng</th>
                <th className="py-3.5 px-5">Ngày đặt</th>
                <th className="py-3.5 px-5">Tổng tiền</th>
                <th className="py-3.5 px-5">Trạng thái</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-indigo-600">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-800">
                    {order.customer}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-slate-800">
                    {order.total}
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.status === "Hoàn thành"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                          : order.status === "Đang xử lý"
                          ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                          : "bg-slate-100 text-slate-700 ring-1 ring-slate-600/10"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
