import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin, MessageSquare, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200">
          
          {/* Cột 1: Thông tin thương hiệu (chiếm 2 cột trên lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl text-slate-800 tracking-tight leading-none">
                SV<span className="text-blue-600">stay</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Hệ thống tìm kiếm và thuê phòng trọ uy tín hàng đầu Việt Nam dành cho sinh viên. Mang lại trải nghiệm an tâm, minh bạch với hàng ngàn phòng trọ xác thực từ chủ nhà.
            </p>

            <div className="pt-1">
              <Link
                to="/safety"
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Xem tiêu chuẩn xác thực</span>
              </Link>
            </div>
          </div>

          {/* Cột 2: Khám phá nhanh */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wider mb-4">
              Khám phá nhanh
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link></li>
              <li><Link to="/rooms" className="hover:text-blue-600 transition-colors">Tìm phòng trọ mới đăng</Link></li>
              <li><Link to="/popular-areas" className="hover:text-blue-600 transition-colors">Khu vực hot</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Cẩm nang sinh viên</Link></li>
              <li><Link to="/customer/login" className="hover:text-blue-600 transition-colors">Tài khoản khách hàng</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ sinh viên */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wider mb-4">
              Hỗ trợ sinh viên
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Quy định & Chính sách</Link></li>
              <li><Link to="/guide" className="hover:text-blue-600 transition-colors">Hướng dẫn thuê phòng</Link></li>
              <li><Link to="/contract-sample" className="hover:text-blue-600 transition-colors">Hợp đồng mẫu</Link></li>
              <li><Link to="/report" className="hover:text-blue-600 transition-colors">Báo cáo lừa đảo</Link></li>
              <li><Link to="/help" className="hover:text-blue-600 transition-colors">Trung tâm trợ giúp</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ hỗ trợ */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wider mb-4">
              Liên hệ hỗ trợ
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Hotline: 1900 8888</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>contact@svstay.vn</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Khu đô thị ĐHQG TP.HCM & Hà Nội</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Cộng đồng sinh viên SVStay</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bản quyền */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 SVStay - Nền tảng phòng trọ sinh viên Việt Nam - Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-slate-700">Điều khoản dịch vụ</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-700">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
