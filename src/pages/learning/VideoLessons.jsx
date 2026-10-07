import { FaArrowLeft, FaPlay } from "react-icons/fa";

const videos = [
  {
    title: "DDA Line Drawing Algorithm",
    description:
      "Learn how the Digital Differential Analyzer algorithm calculates and plots pixels to draw a line.",
    videoId: "l_yxIfgyeEA",
    duration: "Line Drawing",
    path: "/graphics/dda",
  },
  {
    title: "Bresenham Line Drawing Algorithm",
    description:
      "Understand Bresenham's efficient integer-based approach for selecting pixels along a line.",
    videoId: "TYb2wjONB_0",
    duration: "Line Drawing",
    path: "/graphics/bresenham",
  },
  {
    title: "2D Transformation: Translation",
    description:
      "Learn how translation moves a 2D object along the X and Y axes.",
    videoId: "Z7Wgtg6aI7Y",
    duration: "2D Transformation",
    path: "/graphics/transformations",
  },
  {
    title: "2D Transformation: Rotation",
    description:
      "Understand how rotation changes the orientation of a 2D object around a reference point.",
    videoId: "7wgSixkAYwU",
    duration: "2D Transformation",
    path: "/graphics/transformations",
  },
  {
    title: "2D Transformation: Scaling",
    description:
      "Learn how scaling increases or decreases the size of an object along the coordinate axes.",
    videoId: "3CyTlQJtuag",
    duration: "2D Transformation",
    path: "/graphics/transformations",
  },
  {
    title: "Cohen-Sutherland Line Clipping",
    description:
      "Learn how the Cohen-Sutherland algorithm determines the visible portion of a line inside a clipping window.",
    videoId: "sOelocTmtxg",
    duration: "Clipping",
    path: "/graphics/clipping",
  },
  {
    title: "Basic 3D Transformations",
    description:
      "Understand the basic concepts of transformations applied to objects in three-dimensional graphics.",
    videoId: "gFaknR1spWg",
    duration: "3D Graphics",
    path: "/graphics/3d",
  },
];

function VideoLessons() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}

      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <button
            type="button"
            onClick={() => (window.location.href = "/learn")}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FaArrowLeft />
            Back to Learning Hub
          </button>

          <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
            Multimedia Learning
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Video Lessons</h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Reinforce Computer Graphics concepts through visual demonstrations
            and video-based explanations.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Introduction */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-xl">
              <FaPlay />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Learn Through Video</h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                Video lessons provide another way to understand Computer
                Graphics concepts. Watch the demonstrations and then practice
                the same concepts using GraphiLearn's interactive simulations.
              </p>
            </div>
          </div>
        </section>

        {/* Video Grid */}

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
              Video Library
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Computer Graphics Lessons
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Watch a lesson and then practice the same concept using the
              GraphiLearn interactive simulator.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <article
                key={video.title}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-purple-500/40"
              >
                {/* Video */}

                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* Information */}

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                      {video.duration}
                    </span>

                    <FaPlay className="text-purple-400" />
                  </div>

                  <h3 className="mt-4 text-xl font-bold">{video.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {video.description}
                  </p>

                  {/* Practice Button */}

                  <button
                    type="button"
                    onClick={() => (window.location.href = video.path)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                  >
                    Practice Interactive Simulation
                    <FaPlay className="text-xs" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Learning Workflow */}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Recommended Learning Workflow</h2>

          <p className="mt-2 text-sm text-slate-400">
            Follow the same learning process for every topic.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Step
              number="01"
              title="Watch"
              text="Watch the video explanation."
            />

            <Step
              number="02"
              title="Understand"
              text="Read the concept and formula."
            />

            <Step
              number="03"
              title="Interact"
              text="Run the GraphiLearn simulation."
            />

            <Step
              number="04"
              title="Practice"
              text="Test your knowledge with the quiz."
            />
          </div>
        </section>

        {/* Back to Learning */}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => (window.location.href = "/learn")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
          >
            <FaArrowLeft />
            Back to Learning Hub
          </button>
        </div>
      </main>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/20 text-xs font-bold text-purple-400">
        {number}
      </div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default VideoLessons;
