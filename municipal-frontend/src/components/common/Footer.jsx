export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-10">
      <div className="container-app py-6 text-center text-sm">
        © {new Date().getFullYear()} Smart Municipal System • Built with MERN +
        AI
      </div>
    </footer>
  );
}
