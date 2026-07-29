export default function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  type = "text",
  placeholder,
  as = "input",
  children,
}) {

  const showError = touched && error;

  const baseClasses = `w-full px-4 py-2.5 rounded-xl bg-white/5 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors ${
    showError
      ? "border-fuchsia-400/60 focus:border-fuchsia-400"
      : "border-white/10 focus:border-indigo-400/50"
  }`;

  return (
    <div>
      <label htmlFor={name} className="text-sm text-zinc-400 mb-1 block">
        {label}
      </label>

      {as === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={baseClasses}
        >
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${baseClasses} min-h-[80px] resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}

      {showError && (
        <p className="text-fuchsia-400 text-xs mt-1.5 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}