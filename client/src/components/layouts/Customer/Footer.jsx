import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#174c3c]/20 bg-[#11231C] pb-8 pt-16 text-gray-300">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-2">
          {/* Cột 1: Thông tin thương hiệu SVstay & Liên hệ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#174c3c] text-white">
                <MapPin className="text-lg" size={18} />
              </div>
              <span className="font-['Be Vietnam Pro'] text-xl font-bold tracking-tight text-white">
                SVstay
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              Nền tảng tìm kiếm và đặt phòng trọ sinh viên. Hướng đến một môi
              trường thuê trọ an toàn, minh bạch chi phí và gắn kết cộng đồng
              học đường.
            </p>

            <div className="space-y-2 pt-2 text-sm text-gray-300">
              <div className="flex items-center gap-2.5">
                <Phone className="text-base text-emerald-500" size={16} />
                <span>
                  Hotline sinh viên:{" "}
                  <strong className="font-medium text-white">1900 6868</strong>{" "}
                  <span className="text-xs text-gray-400">(08:00 - 21:00)</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="text-base text-emerald-500" size={16} />
                <span>
                  Email hỗ trợ:{" "}
                  <a
                    href="mailto:hotro@svstay.vn"
                    className="text-white hover:underline"
                  >
                    hotro@svstay.vn
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Cột 2: Chủ nhà & Điều khoản chính sách */}
          <div>
            <h4 className="mb-4 font-['Be Vietnam Pro'] text-xs font-bold uppercase tracking-wider text-white">
              Chủ nhà &amp; Điều khoản
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link
                  to="/owner/login"
                  className="inline-block transition-colors duration-150 hover:text-white"
                >
                  Đăng tin cho thuê phòng trọ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="inline-block transition-colors duration-150 hover:text-white"
                >
                  Bảng giá gói tin ưu tiên
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="inline-block transition-colors duration-150 hover:text-white"
                >
                  Quy chế hoạt động sàn TMĐT
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="inline-block transition-colors duration-150 hover:text-white"
                >
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="inline-block transition-colors duration-150 hover:text-white"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
