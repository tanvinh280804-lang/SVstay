const Header = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-lg"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Admin</span>
          <span className="text-slate-300">/</span>
          <strong className="font-semibold text-slate-800">Dashboard</strong>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="relative w-10 h-10 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-base"
          aria-label="Thông báo"
        >
          <span>🔔</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200 shrink-0">
            AD
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <strong className="text-sm font-semibold text-slate-800 leading-tight">
              Administrator
            </strong>
            <span className="text-xs text-slate-500 leading-tight">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
