import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaRedo } from "react-icons/fa";

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 450;

const INITIAL_POINTS = [
  { x: 100, y: 330 },
  { x: 220, y: 80 },
  { x: 480, y: 80 },
  { x: 600, y: 330 },
];

const MODULE_NAME = "Bezier Curves";
const STORAGE_KEY = "graphilearn_completed_modules";

function calculateBezier(points, t) {
  const mt = 1 - t;

  const x =
    mt ** 3 * points[0].x +
    3 * mt ** 2 * t * points[1].x +
    3 * mt * t ** 2 * points[2].x +
    t ** 3 * points[3].x;

  const y =
    mt ** 3 * points[0].y +
    3 * mt ** 2 * t * points[1].y +
    3 * mt * t ** 2 * points[2].y +
    t ** 3 * points[3].y;

  return { x, y };
}

function BezierSimulator() {
  const canvasRef = useRef(null);

  const [points, setPoints] = useState(INITIAL_POINTS);
  const [draggingPoint, setDraggingPoint] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check saved progress
  useEffect(() => {
    try {
      const completedModules = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]",
      );

      if (completedModules.includes(MODULE_NAME)) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Unable to read progress:", error);
    }
  }, []);

  const markComplete = () => {
    try {
      const completedModules = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]",
      );

      if (!completedModules.includes(MODULE_NAME)) {
        const updatedModules = [...completedModules, MODULE_NAME];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedModules));
      }

      setIsCompleted(true);
    } catch (error) {
      console.error("Unable to save progress:", error);
    }
  };

  const reset = () => {
    setPoints(
      INITIAL_POINTS.map((point) => ({
        ...point,
      })),
    );
    setDraggingPoint(null);
  };

  const getMousePosition = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,

      y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  };

  const handleMouseDown = (event, index) => {
    event.preventDefault();

    setDraggingPoint(index);

    // Using the simulator completes the module
    markComplete();
  };

  const handleMouseMove = (event) => {
    if (draggingPoint === null) return;

    const position = getMousePosition(event);

    const newX = Math.max(20, Math.min(CANVAS_WIDTH - 20, position.x));

    const newY = Math.max(20, Math.min(CANVAS_HEIGHT - 20, position.y));

    setPoints((currentPoints) =>
      currentPoints.map((point, index) =>
        index === draggingPoint
          ? {
              x: newX,
              y: newY,
            }
          : point,
      ),
    );
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "#020617";

    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // -------------------------
    // Grid
    // -------------------------

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;

    for (let x = 0; x <= CANVAS_WIDTH; x += 25) {
      ctx.beginPath();

      ctx.moveTo(x, 0);

      ctx.lineTo(x, CANVAS_HEIGHT);

      ctx.stroke();
    }

    for (let y = 0; y <= CANVAS_HEIGHT; y += 25) {
      ctx.beginPath();

      ctx.moveTo(0, y);

      ctx.lineTo(CANVAS_WIDTH, y);

      ctx.stroke();
    }

    // -------------------------
    // Control polygon
    // -------------------------

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    ctx.setLineDash([7, 6]);

    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();

    ctx.setLineDash([]);

    // -------------------------
    // Bezier curve
    // -------------------------

    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 5;

    ctx.beginPath();

    const firstPoint = calculateBezier(points, 0);

    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i <= 100; i++) {
      const t = i / 100;

      const point = calculateBezier(points, t);

      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();

    // -------------------------
    // Control points
    // -------------------------

    points.forEach((point, index) => {
      ctx.fillStyle =
        index === 0 || index === points.length - 1 ? "#22c55e" : "#facc15";

      ctx.beginPath();

      ctx.arc(point.x, point.y, 9, 0, Math.PI * 2);

      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";

      ctx.fillText(`P${index}`, point.x + 12, point.y - 12);
    });
  }, [points]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}

      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => (window.location.href = "/learn")}
                className="mb-4 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
              >
                <FaArrowLeft />
                Back to Learning Hub
              </button>

              <p className="text-sm font-semibold uppercase tracking-wider text-pink-400">
                Interactive Graphics Lab
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Bezier Curve Simulator
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                Drag the control points and observe how the Bezier curve changes
                in real time.
              </p>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                <FaCheckCircle />
                Module Completed
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Main Lab */}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Canvas */}

          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="font-semibold">Interactive Curve</h2>

              <p className="text-sm text-slate-400">
                Drag P0, P1, P2 or P3 to reshape the curve.
              </p>
            </div>

            <div className="overflow-x-auto p-4">
              <div className="relative mx-auto w-fit">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="block rounded-xl border border-slate-800"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />

                {points.map((point, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Control point P${index}`}
                    onMouseDown={(event) => handleMouseDown(event, index)}
                    className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full bg-transparent active:cursor-grabbing"
                    style={{
                      left: `${point.x}px`,
                      top: `${point.y}px`,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Controls */}

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">Curve Controls</h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              A cubic Bezier curve uses four control points. The first and last
              points define the endpoints, while the middle points control the
              shape.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold transition hover:bg-slate-800"
            >
              <FaRedo />
              Reset Curve
            </button>

            {/* Control Points */}

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="font-semibold">Control Points</h3>

              <div className="mt-4 space-y-3">
                {points.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-slate-800 pb-2"
                  >
                    <span className="font-semibold text-pink-400">
                      P{index}
                    </span>

                    <span className="font-mono text-sm text-slate-400">
                      ({Math.round(point.x)}, {Math.round(point.y)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Explanation */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">How a Cubic Bezier Curve Works</h2>

          <p className="mt-3 leading-7 text-slate-400">
            A cubic Bezier curve is defined by four control points. The curve is
            calculated using a parameter t that varies from 0 to 1.
          </p>

          <div className="mt-6 rounded-xl border border-pink-500/20 bg-pink-500/5 p-5">
            <p className="font-mono text-sm leading-7 text-pink-300">
              B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Concept
              title="P0 & P3"
              text="These are the starting and ending points of the curve."
            />

            <Concept
              title="P1 & P2"
              text="These control the direction and curvature of the curve."
            />

            <Concept
              title="Parameter t"
              text="As t moves from 0 to 1, the algorithm calculates points along the curve."
            />
          </div>
        </section>

        {/* Module Progress */}

        <section className="mt-6 rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-pink-400">
                Module Progress
              </p>

              <h2 className="mt-2 text-xl font-bold">Bezier Curves</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Drag any control point to interact with the Bezier curve and
                complete this module.
              </p>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ${
                isCompleted
                  ? "bg-green-500/10 text-green-400"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {isCompleted && <FaCheckCircle />}

              {isCompleted ? "Completed" : "Not Completed"}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Concept({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-pink-400">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default BezierSimulator;
