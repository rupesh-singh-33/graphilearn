function TopicCard({ title, description, icon, color, onExplore }) {
  return (
    <article className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-600">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-lg`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>

      <p className="mt-3 min-h-14 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <button
        type="button"
        onClick={onExplore}
        className="mt-5 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
      >
        Explore module →
      </button>
    </article>
  );
}

export default TopicCard;
