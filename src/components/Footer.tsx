export default function Footer() {
  return (
    <footer className="py-6 px-6 border-t border-slate-200">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Jin-Woo Lee. All rights reserved.</p>
        <a
          href="/admin"
          className="hover:text-slate-600 transition-colors opacity-40 hover:opacity-100"
          title="Admin CMS"
        >
          ⚙️ Admin
        </a>
      </div>
    </footer>
  );
}
