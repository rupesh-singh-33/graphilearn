import { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaBookOpen,
  FaChartBar,
  FaChartLine,
  FaCircle,
  FaCube,
  FaDrawPolygon,
  FaPlay,
  FaVolumeUp,
  FaPause,
  FaStop,
} from "react-icons/fa";
import InteractiveActivity from "../../components/learning/InteractiveActivity";

const modules = [
  {
    title: "2D Transformations",
    description:
      "Understand translation, rotation, scaling, reflection and shearing through interactive visualizations.",
    level: "Beginner",
    duration: "10 min",
    icon: <FaDrawPolygon />,
    color: "from-blue-500 to-cyan-500",
    path: "/learn/transformations",
  },
  {
    title: "Line Drawing",
    description: "Visualize DDA and Bresenham algorithms pixel by pixel.",
    level: "Beginner",
    duration: "10 min",
    icon: <FaChartLine />,
    color: "from-violet-500 to-purple-500",
    path: "/learn/line-drawing",
  },
  {
    title: "Circle Drawing",
    description:
      "Explore the Midpoint Circle Drawing Algorithm and eight-way symmetry.",
    level: "Intermediate",
    duration: "10 min",
    icon: <FaCircle />,
    color: "from-emerald-500 to-teal-500",
    path: "/graphics/circle",
  },
  {
    title: "Line Clipping",
    description:
      "Learn how Cohen-Sutherland determines which portion of a line should be visible.",
    level: "Intermediate",
    duration: "12 min",
    icon: <FaBookOpen />,
    color: "from-orange-500 to-amber-500",
    path: "/graphics/clipping",
  },
  {
    title: "Bezier Curves",
    description:
      "Understand control points, parameter t and cubic Bezier curve generation.",
    level: "Intermediate",
    duration: "15 min",
    icon: <FaPlay />,
    color: "from-pink-500 to-rose-500",
    path: "/graphics/bezier",
  },
  {
    title: "3D Graphics",
    description:
      "Explore 3D transformations, scaling, rotation and perspective using an interactive cube.",
    level: "Advanced",
    duration: "15 min",
    icon: <FaCube />,
    color: "from-indigo-500 to-blue-600",
    path: "/graphics/3d",
  },
];

function LearningHub() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const speechRef = useRef(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const openModule = (path) => {
    window.location.href = path;
  };

  const narrationText = `
    Welcome to GraphiLearn, an interactive Computer Graphics learning system.
    
    Computer Graphics is the field of computer science that deals with
    creating, manipulating and displaying visual content using computers.
    
    GraphiLearn provides six interactive modules.
    
    First, 2D Transformations teaches translation, rotation, scaling,
    reflection and shearing.
    
    Second, Line Drawing introduces DDA and Bresenham algorithms
    for drawing lines pixel by pixel.
    
    Third, Circle Drawing demonstrates the Midpoint Circle Drawing Algorithm
    and eight-way symmetry.
    
    Fourth, Line Clipping explains the Cohen-Sutherland clipping algorithm.
    
    Fifth, Bezier Curves explains control points, parameter t,
    and cubic Bezier curve generation.
    
    Finally, 3D Graphics demonstrates rotation, scaling and perspective
    using an interactive three-dimensional cube.
    
    The recommended learning path is simple:
    read the concept, watch the visualization,
    interact with the simulation, and finally test your knowledge.
    
    Use the interactive modules to understand Computer Graphics
    through visualization and practice instead of static notes.
  `;

  const playNarration = () => {
    if (!("speechSynthesis" in window)) {
      alert("Speech narration is not supported in this browser.");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(narrationText);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    speech.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      speechRef.current = null;
    };

    speech.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      speechRef.current = null;
    };

    speechRef.current = speech;

    window.speechSynthesis.speak(speech);
  };

  const pauseNarration = () => {
    if (!window.speechSynthesis.speaking) {
      return;
    }

    window.speechSynthesis.pause();

    setIsPaused(true);
  };

  const stopNarration = () => {
    window.speechSynthesis.cancel();

    setIsSpeaking(false);
    setIsPaused(false);
    speechRef.current = null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}

      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </button>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            GraphiLearn • Learning Hub
          </p>

          <h1 className="mt-2 text-4xl font-bold">Learn Computer Graphics</h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Learn important Computer Graphics concepts through explanations,
            visualizations and interactive simulations instead of static notes.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Learning Introduction */}

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                <FaBookOpen />
                Interactive Learning
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                Understand concepts by seeing them in action.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                GraphiLearn combines theory with interactive experiments. Read
                the concept, observe the visualization and then interact with
                the algorithm yourself.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  📖 Theory
                </span>

                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  🎨 Visualization
                </span>

                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  ⚡ Simulation
                </span>

                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  🧠 Practice
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm text-slate-400">Learning Path</p>

              <div className="mt-5 space-y-4">
                <LearningStep number="01" text="Read the concept" />

                <LearningStep number="02" text="Watch the visualization" />

                <LearningStep number="03" text="Interact with the simulation" />

                <LearningStep number="04" text="Test your knowledge" />
              </div>
            </div>
          </div>
        </section>

        {/* Modules */}

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Course Modules
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Computer Graphics Topics
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              {modules.length} interactive modules
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <article
                key={module.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-600"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${module.color} text-lg`}
                >
                  {module.icon}
                </div>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold">{module.title}</h3>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    {module.level}
                  </span>
                </div>

                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
                  {module.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-sm text-slate-500">
                    ⏱ {module.duration}
                  </span>

                  <button
                    type="button"
                    onClick={() => openModule(module.path)}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    Start Learning
                    <FaArrowRight className="transition group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Multimedia Section */}

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
            Multimedia Learning
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Learn through multiple formats
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MediaCard
              icon="📖"
              title="Text"
              text="Clear explanations and formulas."
            />

            <MediaCard
              icon="🎨"
              title="Visuals"
              text="Diagrams and real-time graphics."
            />

            {/* Narration */}

            <div className="rounded-xl border border-blue-500/20 bg-slate-950 p-5 transition hover:border-blue-500/40">
              <div className="text-2xl">🔊</div>

              <h3 className="mt-3 font-semibold">Narration</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Listen to an audio explanation of the GraphiLearn course and its
                concepts.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={playNarration}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold transition hover:bg-blue-500"
                >
                  <FaVolumeUp />

                  {isPaused ? "Resume" : "Play"}
                </button>

                <button
                  type="button"
                  onClick={pauseNarration}
                  disabled={!isSpeaking || isPaused}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaPause />
                  Pause
                </button>

                <button
                  type="button"
                  onClick={stopNarration}
                  disabled={!isSpeaking}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaStop />
                  Stop
                </button>
              </div>

              {isSpeaking && (
                <p className="mt-3 text-xs font-medium text-blue-400">
                  🔊 Narration is playing...
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/learn/videos")}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-5 text-left transition hover:-translate-y-1 hover:border-purple-500/50"
            >
              <div className="text-2xl">🎥</div>

              <h3 className="mt-3 font-semibold">Video</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Visual demonstrations and lessons.
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-400">
                Watch Lessons
                <FaArrowRight />
              </div>
            </button>
          </div>
        </section>

        {/* Progress Section */}

        <section className="mt-10 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Your Learning Progress
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Track your Computer Graphics journey
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Check completed modules, quiz performance and your overall
                learning progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = "/learn/progress")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              View Progress
              <FaChartBar />
            </button>
          </div>
        </section>

        {/* Interactive Activity */}

        <section className="mt-10">
          <InteractiveActivity />
        </section>
      </main>
    </div>
  );
}

function LearningStep({ number, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-bold text-blue-400">
        {number}
      </div>

      <span className="text-sm text-slate-300">{text}</span>
    </div>
  );
}

function MediaCard({ icon, title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="text-2xl">{icon}</div>

      <h3 className="mt-3 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default LearningHub;
