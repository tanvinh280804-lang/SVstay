const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#E2E8E4] bg-white px-6 py-4 text-xs text-[#707974] sm:flex-row">
      <p className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
        © 2026 SVstay - Cổng quản lý dành cho Chủ trọ.
      </p>
      <div className="flex items-center gap-4 text-[#8A948E]">
        <span>Hỗ trợ kỹ thuật: 1900 8888</span>
        <span>•</span>
        <span>Quy chuẩn kiểm duyệt phòng</span>
      </div>
    </footer>
  );
};

export default Footer;
