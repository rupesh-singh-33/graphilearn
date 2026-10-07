import { FaGraduationCap } from "react-icons/fa";

function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl">
            <FaGraduationCap />
          </div>

          <div>
            <h1 className="text-xl font-bold">GraphiLearn</h1>

            <p className="text-xs text-slate-400">
              Interactive Computer Graphics
            </p>
          </div>
        </div>

        <nav className="hidden gap-7 text-sm text-slate-300 md:flex">
          <a href="/" className="text-blue-400">
            Dashboard
          </a>

          <a href="/learn" className="hover:text-white">
            Learn
          </a>

          <a href="/learn/quiz" className="hover:text-white">
            Quiz
          </a>

          <a href="/learn/progress" className="hover:text-white">
            Progress
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
