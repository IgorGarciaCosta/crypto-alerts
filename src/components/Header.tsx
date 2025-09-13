export function Header() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold">CriptoTracker</div>
        <nav className="text-sm text-slate-400">
          <a className="hover:text-slate-200" href="/">
            Home
          </a>
        </nav>
      </div>
    </header>
  );
}
