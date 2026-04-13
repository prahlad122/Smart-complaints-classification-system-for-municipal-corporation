export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full border border-slate-300 rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900
                   transition"
      />
    </div>
  );
}
