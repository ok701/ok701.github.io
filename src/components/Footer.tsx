export default function Footer() {
  return (
    <footer className="py-6 px-6 border-t border-slate-200">
      <div className="max-w-[1100px] mx-auto text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Jin-Woo Lee. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
