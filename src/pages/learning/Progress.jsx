import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
  FaChartLine,
  FaRedo,
  FaTrophy,
  FaGamepad,
} from "react-icons/fa";

const modules = [
  {
    title: "2D Transformations",
    description: "Translation, rotation and scaling",
  },
  {
    title: "Line Drawing",
    description: "DDA and Bresenham algorithms",
  },
  {
    title: "Circle Drawing",
    description: "Midpoint Circle Algorithm",
  },
  {
    title: "Line Clipping",
    description: "Cohen-Sutherland algorithm",
  },
  {
    title: "Bezier Curves",
    description: "Cubic Bezier curves and control points",
  },
  {
    title: "3D Graphics",
    description: "3D transformations and perspective",
  },
];

function Progress() {
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("graphilearn_completed_modules")) || []
      );
    } catch {
      return [];
    }
  });

  const [quizScore, setQuizScore] = useState(() => {
    const savedScore = localStorage.getItem("graphilearn_quiz_score");

    return savedScore ? Number(savedScore) : null;
  });

  const [activityScore, setActivityScore] = useState(() => {
    try {
      const savedActivity = localStorage.getItem("graphilearn_activity_score");

      return savedActivity ? JSON.parse(savedActivity) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "graphilearn_completed_modules",
      JSON.stringify(completedModules),
    );
  }, [completedModules]);

  const completedCount = completedModules.length;

  const moduleProgress = Math.round((completedCount / modules.length) * 100);

  const quizProgress =
    quizScore !== null ? Math.round((quizScore / 8) * 100) : 0;

  const activityProgress =
    activityScore !== null && activityScore.total > 0
      ? Math.round((activityScore.score / activityScore.total) * 100)
      : 0;

  // Overall progress includes:
  // 1. Course Modules
  // 2. Quiz
  // 3. Interactive Activity
  const overallProgress = Math.round(
    (moduleProgress + quizProgress + activityProgress) / 3,
  );

  const toggleModule = (title) => {
    setCompletedModules((current) => {
      if (current.includes(title)) {
        return current.filter((item) => item !== title);
      }

      return [...current, title];
    });
  };

  const resetProgress = () => {
    setCompletedModules([]);

    localStorage.removeItem("graphilearn_completed_modules");
    localStorage.removeItem("graphilearn_quiz_score");
    localStorage.removeItem("graphilearn_activity_score");

    setQuizScore(null);
    setActivityScore(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-400">
            GraphiLearn • Your Learning Journey
          </p>

          <h1 className="mt-2 text-3xl font-bold">Learning Progress</h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Track completed modules, quiz performance and interactive activity
            performance as you learn Computer Graphics.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Overall Progress */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_220px] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <FaChartLine />
                </div>

                <div>
                  <p className="text-sm text-slate-400">Overall Progress</p>

                  <h2 className="text-2xl font-bold">Keep learning!</h2>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Course completion
                  </span>

                  <span className="font-bold text-blue-400">
                    {overallProgress}%
                  </span>
                </div>

                <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${overallProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-slate-800">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400">
                  {overallProgress}%
                </p>

                <p className="text-xs text-slate-500">Complete</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FaBookOpen />}
            value={`${completedCount}/${modules.length}`}
            label="Modules Completed"
          />

          <StatCard
            icon={<FaTrophy />}
            value={quizScore !== null ? `${quizScore}/8` : "--"}
            label="Quiz Score"
          />

          <StatCard
            icon={<FaGamepad />}
            value={
              activityScore
                ? `${activityScore.score}/${activityScore.total}`
                : "--"
            }
            label="Interactive Activity"
          />

          <StatCard
            icon={<FaCheckCircle />}
            value={`${moduleProgress}%`}
            label="Module Progress"
          />
        </section>

        {/* Modules */}
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Course Modules
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your Learning Progress
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {modules.map((module) => {
              const completed = completedModules.includes(module.title);

              return (
                <div
                  key={module.title}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        completed
                          ? "bg-green-500/10 text-green-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      <FaCheckCircle />
                    </div>

                    <div>
                      <h3 className="font-semibold">{module.title}</h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleModule(module.title)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      completed
                        ? "border border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                        : "bg-blue-600 text-white hover:bg-blue-500"
                    }`}
                  >
                    {completed ? "Completed" : "Mark Complete"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quiz */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-purple-400">
                Knowledge Check
              </p>

              <h2 className="mt-1 text-xl font-bold">Computer Graphics Quiz</h2>

              <p className="mt-2 text-sm text-slate-400">
                {quizScore !== null
                  ? `Your latest score is ${quizScore}/8.`
                  : "Complete the quiz to see your score here."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/learn/quiz")}
              className="rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              {quizScore !== null ? "Retake Quiz" : "Start Quiz"}
            </button>
          </div>

          {quizScore !== null && (
            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Quiz performance</span>

                <span className="text-purple-400">{quizProgress}%</span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-purple-600"
                  style={{
                    width: `${quizProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Interactive Activity */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-400">
                Interactive Practice
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Concept Practice Activity
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {activityScore
                  ? `Your latest score is ${activityScore.score}/${activityScore.total}.`
                  : "Complete the interactive activity to see your score here."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/learn")}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
            >
              {activityScore ? "Practice Again" : "Start Activity"}
            </button>
          </div>

          {activityScore && (
            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Activity performance</span>

                <span className="text-blue-400">{activityProgress}%</span>
              </div>

              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${activityProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Reset */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={resetProgress}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
          >
            <FaRedo />
            Reset Progress
          </button>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-bold">{value}</p>

          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default Progress;
