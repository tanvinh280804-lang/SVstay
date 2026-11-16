const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t border-slate-200 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>© 2026 SVstay - Cổng quản lý dành cho Chủ trọ.</p>
      <div className="flex items-center gap-4 text-slate-400">
        <span>Hỗ trợ kỹ thuật: 1900 8888</span>
        <span>•</span>
        <span>Quy chuẩn kiểm duyệt phòng</span>
      </div>
    </footer>
  );
};

export default Footer;
