export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-slate-300 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles[variant]} px-4 py-2 rounded-lg font-medium shadow-sm transition active:scale-95`}
    >
      {children}
    </button>
  );
}
