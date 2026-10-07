function Button({ children, variant = "primary", type = "button", onClick }) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-500",
    secondary:
      "border border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl px-6 py-3 font-semibold transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
