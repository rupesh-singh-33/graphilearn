import {
  FaBookOpen,
  FaChartLine,
  FaCube,
  FaDrawPolygon,
  FaGamepad,
  FaLayerGroup,
  FaPlay,
} from "react-icons/fa";

import Navbar from "./components/layout/Navbar";
import Button from "./components/common/Button";
import StatCard from "./components/common/StatCard";
import TopicCard from "./components/learning/TopicCard";

const topics = [
  {
    title: "2D Transformations",
    description:
      "Learn translation, rotation, scaling, reflection and shearing.",
    icon: <FaLayerGroup />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Line Drawing Algorithms",
    description: "Visualize DDA and Bresenham algorithms pixel by pixel.",
    icon: <FaChartLine />,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Circle Drawing",
    description: "Understand the Midpoint Circle Drawing Algorithm.",
    icon: <FaDrawPolygon />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Clipping Algorithms",
    description: "Explore Cohen-Sutherland line clipping interactively.",
    icon: <FaBookOpen />,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Bezier Curves",
    description: "Create and manipulate curves using control points.",
    icon: <FaGamepad />,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "3D Graphics",
    description: "Explore 3D transformations and perspective projection.",
    icon: <FaCube />,
    color: "from-indigo-500 to-blue-600",
  },
];

const stats = [
  {
    value: "06",
    label: "Learning Modules",
  },
  {
    value: "05+",
    label: "CG Algorithms",
  },
  {
    value: "10+",
    label: "Interactive Labs",
  },
  {
    value: "∞",
    label: "Practice Opportunities",
  },
];

function App() {
  const handleExplore = (title) => {
    if (title === "2D Transformations") {
      window.location.href = "/graphics/transformations";
    }

    if (title === "Line Drawing Algorithms") {
      window.location.href = "/graphics/dda";
    }

    if (title === "Circle Drawing") {
      window.location.href = "/graphics/circle";
    }

    if (title === "Clipping Algorithms") {
      window.location.href = "/graphics/clipping";
    }

    if (title === "Bezier Curves") {
      window.location.href = "/graphics/bezier";
    }

    if (title === "3D Graphics") {
      window.location.href = "/graphics/3d";
    }
  };

  const handleExploreTopics = () => {
    document.getElementById("topics")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Hero Section */}
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Computer Graphics Learning Platform
            </div>

            <h2 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
              Learn Computer Graphics
              <span className="block text-blue-400">
                by seeing it in action.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Understand graphics concepts through interactive simulations,
              animations, visual algorithms and hands-on activities instead of
              static notes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {/* Start Learning */}
              <Button onClick={() => (window.location.href = "/learn")}>
                <span className="flex items-center gap-2">
                  <FaPlay />
                  Start Learning
                </span>
              </Button>

              {/* Explore Topics */}
              <Button variant="secondary" onClick={handleExploreTopics}>
                Explore Topics
              </Button>
            </div>
          </div>

          {/* Graphics Preview */}
          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="absolute h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative">
              <div className="h-48 w-48 rotate-12 rounded-3xl border-2 border-blue-400/70 bg-blue-500/10 shadow-2xl shadow-blue-500/20">
                <div className="flex h-full items-center justify-center -rotate-12">
                  <FaCube className="text-7xl text-blue-400" />
                </div>
              </div>

              <div className="absolute -bottom-8 -left-12 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">
                <span className="text-slate-400">Interactive</span>

                <p className="font-semibold text-white">3D Visualization</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </section>

        {/* Learning Modules */}
        <section id="topics" className="mt-20">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Learning Modules
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              Explore Computer Graphics
            </h3>

            <p className="mt-2 max-w-2xl text-slate-400">
              Choose a topic and learn through explanations, visualizations and
              interactive experiments.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.title}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
                color={topic.color}
                onExplore={() => handleExplore(topic.title)}
              />
            ))}
          </div>
        </section>

        {/* Quiz CTA */}
        <section
          id="quiz"
          className="my-20 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 text-center md:p-12"
        >
          <h3 className="text-3xl font-bold">Ready to test your knowledge?</h3>

          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Complete interactive lessons and challenge yourself with topic-wise
            Computer Graphics quizzes.
          </p>

          <div className="mt-6">
            <Button onClick={() => (window.location.href = "/learn/quiz")}>
              Take a Quiz
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
