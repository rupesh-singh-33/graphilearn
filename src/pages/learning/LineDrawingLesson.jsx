import { FaArrowLeft, FaBookOpen, FaCode, FaPlay } from "react-icons/fa";

function LineDrawingLesson() {
  const openDDA = () => {
    window.location.href = "/graphics/dda";
  };

  const openBresenham = () => {
    window.location.href = "/graphics/bresenham";
  };

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

          <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
            Learning Module
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Line Drawing Algorithms
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Learn how computer graphics algorithms convert a mathematical line
            into pixels on a raster display.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Introduction */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xl">
              <FaBookOpen />
            </div>

            <div>
              <h2 className="text-2xl font-bold">What is Line Drawing?</h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                Line drawing algorithms are used in computer graphics to
                determine which pixels should be activated to represent a
                straight line between two points.
              </p>

              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                In this module, you can learn and interact with two classic
                algorithms: DDA and Bresenham's Line Drawing Algorithm.
              </p>
            </div>
          </div>
        </section>

        {/* Algorithms */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
              Interactive Algorithms
            </p>

            <h2 className="mt-2 text-2xl font-bold">Choose an Algorithm</h2>

            <p className="mt-2 text-slate-400">
              Run each algorithm step-by-step and observe how individual pixels
              are selected.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* DDA */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl">
                <FaPlay />
              </div>

              <h3 className="mt-5 text-2xl font-bold">DDA Algorithm</h3>

              <p className="mt-3 leading-7 text-slate-400">
                Learn the Digital Differential Analyzer algorithm and visualize
                how it calculates intermediate points to draw a line.
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-400">
                <p>• Uses incremental calculations</p>
                <p>• Generates pixels step-by-step</p>
                <p>• Interactive canvas visualization</p>
              </div>

              <button
                type="button"
                onClick={openDDA}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
              >
                Open DDA Simulator
                <FaPlay className="text-sm" />
              </button>
            </article>

            {/* Bresenham */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-violet-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-xl">
                <FaCode />
              </div>

              <h3 className="mt-5 text-2xl font-bold">Bresenham Algorithm</h3>

              <p className="mt-3 leading-7 text-slate-400">
                Understand how Bresenham efficiently selects pixels using
                integer arithmetic and an error term.
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-400">
                <p>• Uses integer arithmetic</p>
                <p>• Efficient pixel selection</p>
                <p>• Interactive step-by-step visualization</p>
              </div>

              <button
                type="button"
                onClick={openBresenham}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500"
              >
                Open Bresenham Simulator
                <FaPlay className="text-sm" />
              </button>
            </article>
          </div>
        </section>

        {/* Comparison */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">DDA vs Bresenham</h2>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-300">
                  <th className="px-4 py-3">Feature</th>

                  <th className="px-4 py-3">DDA</th>

                  <th className="px-4 py-3">Bresenham</th>
                </tr>
              </thead>

              <tbody className="text-slate-400">
                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white">
                    Calculation
                  </td>

                  <td className="px-4 py-3">Incremental</td>

                  <td className="px-4 py-3">Integer-based</td>
                </tr>

                <tr className="border-b border-slate-800">
                  <td className="px-4 py-3 font-medium text-white">
                    Pixel Selection
                  </td>

                  <td className="px-4 py-3">Based on calculated coordinates</td>

                  <td className="px-4 py-3">Based on error value</td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-medium text-white">
                    Visualization
                  </td>

                  <td className="px-4 py-3">Step-by-step</td>

                  <td className="px-4 py-3">Step-by-step</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LineDrawingLesson;
