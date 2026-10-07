import { useEffect, useRef, useState } from "react";

import { FaArrowLeft, FaCheckCircle, FaPlay, FaRedo } from "react-icons/fa";

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 450;
const GRID_SIZE = 20;

const MODULE_NAME = "Circle Drawing";
const STORAGE_KEY = "graphilearn_completed_modules";

function CircleSimulator() {
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  const [radius, setRadius] = useState(8);
  const [pixels, setPixels] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
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

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Generate Midpoint Circle pixels
  const generateCircle = () => {
    const r = Number(radius);

    if (!Number.isFinite(r) || r <= 0) {
      return [];
    }

    let x = 0;
    let y = r;
    let decision = 1 - r;

    const generatedPixels = [];

    while (x <= y) {
      const points = [
        [x, y],
        [y, x],
        [-x, y],
        [-y, x],
        [-x, -y],
        [-y, -x],
        [x, -y],
        [y, -x],
      ];

      points.forEach(([px, py]) => {
        generatedPixels.push({
          x: px,
          y: py,
        });
      });

      x++;

      if (decision < 0) {
        decision += 2 * x + 1;
      } else {
        y--;
        decision += 2 * (x - y) + 1;
      }
    }

    return generatedPixels;
  };

  // Start animation
  const startAnimation = () => {
    if (isRunning) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const generatedPixels = generateCircle();

    if (generatedPixels.length === 0) {
      return;
    }

    setPixels(generatedPixels);
    setCurrentStep(0);
    setIsRunning(true);
  };

  // Pixel-by-pixel animation
  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= pixels.length - 1) {
      setIsRunning(false);

      if (pixels.length > 0) {
        markComplete();
      }

      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep((step) => step + 1);
    }, 70);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, pixels, isRunning]);

  // Save completion
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

  // Reset simulation
  const reset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPixels([]);
    setCurrentStep(-1);
    setIsRunning(false);
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

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    // -------------------------
    // Grid
    // -------------------------

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;

    for (let x = centerX; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    for (let x = centerX - GRID_SIZE; x >= 0; x -= GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    for (let y = centerY; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    for (let y = centerY - GRID_SIZE; y >= 0; y -= GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // -------------------------
    // Axes
    // -------------------------

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, CANVAS_HEIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(CANVAS_WIDTH, centerY);
    ctx.stroke();

    // -------------------------
    // Center point
    // -------------------------

    ctx.fillStyle = "#22c55e";

    ctx.beginPath();

    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);

    ctx.fill();

    // -------------------------
    // Ideal circle
    // -------------------------

    if (pixels.length > 0 && !isRunning) {
      ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
      ctx.lineWidth = 2;

      ctx.beginPath();

      ctx.arc(centerX, centerY, radius * GRID_SIZE, 0, Math.PI * 2);

      ctx.stroke();
    }

    // -------------------------
    // Visible pixels
    // -------------------------

    const visiblePixels =
      currentStep >= 0 ? pixels.slice(0, currentStep + 1) : [];

    visiblePixels.forEach((pixel, index) => {
      const px = centerX + pixel.x * GRID_SIZE;

      const py = centerY - pixel.y * GRID_SIZE;

      ctx.fillStyle =
        index === visiblePixels.length - 1 ? "#facc15" : "#34d399";

      ctx.fillRect(px - 4, py - 4, 8, 8);
    });

    // -------------------------
    // Radius guide
    // -------------------------

    if (pixels.length > 0 && currentStep >= 0 && !isRunning) {
      const radiusX = centerX + radius * GRID_SIZE;

      ctx.strokeStyle = "rgba(250, 204, 21, 0.5)";
      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(centerX, centerY);

      ctx.lineTo(radiusX, centerY);

      ctx.stroke();
    }
  }, [pixels, currentStep, radius, isRunning]);

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

              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Interactive Graphics Lab
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Midpoint Circle Drawing Algorithm
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                Visualize how a circle is generated using symmetry and a
                decision parameter.
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
              <h2 className="font-semibold">Circle Visualization</h2>

              <p className="text-sm text-slate-400">
                The algorithm uses 8-way symmetry to plot the circle.
              </p>
            </div>

            <div className="overflow-x-auto p-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="mx-auto block rounded-xl border border-slate-800"
              />
            </div>
          </section>

          {/* Controls */}

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">Circle Controls</h2>

            {/* Radius */}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-slate-300">Radius</label>

                <span className="font-semibold text-emerald-400">{radius}</span>
              </div>

              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={radius}
                disabled={isRunning}
                onChange={(event) => setRadius(Number(event.target.value))}
                className="w-full accent-emerald-500 disabled:opacity-50"
              />
            </div>

            {/* Buttons */}

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={startAnimation}
                disabled={isRunning}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaPlay />

                {isRunning ? "Drawing..." : "Start Algorithm"}
              </button>

              <button
                type="button"
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold transition hover:bg-slate-800"
              >
                <FaRedo />
                Reset
              </button>
            </div>

            {/* Algorithm Information */}

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="font-semibold">Algorithm Information</h3>

              <div className="mt-4 space-y-3 text-sm">
                <Info label="Radius" value={radius} />

                <Info label="Generated Points" value={pixels.length || "-"} />

                <Info label="Symmetry" value="8-way" />
              </div>
            </div>

            {/* Current Step */}

            {currentStep >= 0 && (
              <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="text-sm text-slate-400">Current Pixel</p>

                <p className="mt-1 font-bold text-yellow-400">
                  Step {currentStep + 1} / {pixels.length}
                </p>

                {pixels[currentStep] && (
                  <p className="mt-2 text-sm text-slate-400">
                    Coordinate:{" "}
                    <span className="font-mono text-yellow-300">
                      ({pixels[currentStep].x}, {pixels[currentStep].y})
                    </span>
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Explanation */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            How the Midpoint Circle Algorithm Works
          </h2>

          <p className="mt-3 leading-7 text-slate-400">
            The Midpoint Circle Algorithm determines which pixels should be
            plotted to approximate a circle. It uses a decision parameter and
            exploits the symmetry of a circle to calculate multiple pixels from
            a single point.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Concept
              title="1. Start"
              text="Begin at the top of the circle with x = 0 and y = radius."
            />

            <Concept
              title="2. Decision Parameter"
              text="Use the midpoint decision value to determine whether the next pixel moves horizontally or diagonally."
            />

            <Concept
              title="3. Symmetry"
              text="Reflect each calculated point across eight symmetric regions of the circle."
            />
          </div>
        </section>

        {/* Module Progress */}

        <section className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Module Progress
              </p>

              <h2 className="mt-2 text-xl font-bold">Circle Drawing</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Run the Midpoint Circle simulation to complete this learning
                module.
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

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400">{label}</span>

      <span className="font-mono text-emerald-400">{value}</span>
    </div>
  );
}

function Concept({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-emerald-400">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default CircleSimulator;
