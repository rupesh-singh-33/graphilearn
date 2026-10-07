import { useEffect, useRef, useState } from "react";

import { FaArrowLeft, FaCheckCircle, FaPlay, FaRedo } from "react-icons/fa";

const GRID_SIZE = 25;

const CANVAS_WIDTH = 700;

const CANVAS_HEIGHT = 450;

const MODULE_NAME = "Line Drawing";

const STORAGE_KEY = "graphilearn_completed_modules";

function BresenhamSimulator() {
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  const [startX, setStartX] = useState(2);
  const [startY, setStartY] = useState(2);
  const [endX, setEndX] = useState(18);
  const [endY, setEndY] = useState(12);

  const [pixels, setPixels] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check whether Line Drawing module is already completed
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

  // Cleanup timer when page unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const generateBresenham = () => {
    let x1 = Number(startX);
    let y1 = Number(startY);

    const x2 = Number(endX);
    const y2 = Number(endY);

    const generatedPixels = [];

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;

    let error = dx - dy;

    while (true) {
      generatedPixels.push({
        x: x1,
        y: y1,
      });

      if (x1 === x2 && y1 === y2) {
        break;
      }

      const doubleError = 2 * error;

      if (doubleError > -dy) {
        error -= dy;
        x1 += sx;
      }

      if (doubleError < dx) {
        error += dx;
        y1 += sy;
      }
    }

    return generatedPixels;
  };

  const startAnimation = () => {
    if (isRunning) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const generatedPixels = generateBresenham();

    setPixels(generatedPixels);
    setCurrentStep(0);
    setIsRunning(true);
  };

  // Pixel-by-pixel animation
  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= pixels.length - 1) {
      setIsRunning(false);

      // Automatically mark module complete
      if (pixels.length > 0) {
        markComplete();
      }

      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep((step) => step + 1);
    }, 120);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, pixels, isRunning]);

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

    const originX = 60;
    const originY = CANVAS_HEIGHT - 50;

    // -------------------------
    // Grid
    // -------------------------

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;

    for (let x = originX; x <= CANVAS_WIDTH - 20; x += GRID_SIZE) {
      ctx.beginPath();

      ctx.moveTo(x, 20);

      ctx.lineTo(x, CANVAS_HEIGHT - 20);

      ctx.stroke();
    }

    for (let y = originY; y >= 20; y -= GRID_SIZE) {
      ctx.beginPath();

      ctx.moveTo(originX, y);

      ctx.lineTo(CANVAS_WIDTH - 20, y);

      ctx.stroke();
    }

    // -------------------------
    // Axes
    // -------------------------

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(originX, 20);

    ctx.lineTo(originX, CANVAS_HEIGHT - 20);

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(originX, originY);

    ctx.lineTo(CANVAS_WIDTH - 20, originY);

    ctx.stroke();

    // -------------------------
    // Coordinates
    // -------------------------

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";

    for (let i = 0; i <= 24; i++) {
      const px = originX + i * GRID_SIZE;

      const py = originY - i * GRID_SIZE;

      ctx.fillText(String(i), px - 3, originY + 15);

      ctx.fillText(String(i), originX - 20, py + 4);
    }

    // -------------------------
    // Start and End points
    // -------------------------

    const startPixelX = originX + Number(startX) * GRID_SIZE;

    const startPixelY = originY - Number(startY) * GRID_SIZE;

    const endPixelX = originX + Number(endX) * GRID_SIZE;

    const endPixelY = originY - Number(endY) * GRID_SIZE;

    // Start point
    ctx.beginPath();

    ctx.arc(startPixelX, startPixelY, 7, 0, Math.PI * 2);

    ctx.fillStyle = "#22c55e";

    ctx.fill();

    // End point
    ctx.beginPath();

    ctx.arc(endPixelX, endPixelY, 7, 0, Math.PI * 2);

    ctx.fillStyle = "#ef4444";

    ctx.fill();

    // -------------------------
    // Visible pixels
    // -------------------------

    const visiblePixels =
      currentStep >= 0 ? pixels.slice(0, currentStep + 1) : [];

    visiblePixels.forEach((pixel, index) => {
      const px = originX + pixel.x * GRID_SIZE;

      const py = originY - pixel.y * GRID_SIZE;

      ctx.fillStyle =
        index === visiblePixels.length - 1 ? "#facc15" : "#a78bfa";

      ctx.fillRect(px - 6, py - 6, 12, 12);
    });

    // -------------------------
    // Start / End labels
    // -------------------------

    ctx.font = "bold 12px sans-serif";

    ctx.fillStyle = "#22c55e";

    ctx.fillText("Start", startPixelX + 10, startPixelY - 10);

    ctx.fillStyle = "#ef4444";

    ctx.fillText("End", endPixelX + 10, endPixelY - 10);
  }, [pixels, currentStep, startX, startY, endX, endY]);

  const dx = Math.abs(Number(endX) - Number(startX));

  const dy = Math.abs(Number(endY) - Number(startY));

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

              <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
                Interactive Graphics Lab
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Bresenham Line Drawing Algorithm
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                Learn how Bresenham's algorithm efficiently selects pixels using
                integer calculations.
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
              <h2 className="font-semibold">Pixel Visualization</h2>

              <p className="text-sm text-slate-400">
                The yellow pixel shows the current algorithm step.
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
            <h2 className="font-semibold">Line Coordinates</h2>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <NumberInput
                label="Start X"
                value={startX}
                onChange={setStartX}
              />

              <NumberInput
                label="Start Y"
                value={startY}
                onChange={setStartY}
              />

              <NumberInput label="End X" value={endX} onChange={setEndX} />

              <NumberInput label="End Y" value={endY} onChange={setEndY} />
            </div>

            {/* Buttons */}

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={startAnimation}
                disabled={isRunning}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* Algorithm Values */}

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="font-semibold">Algorithm Values</h3>

              <div className="mt-4 space-y-3 text-sm">
                <Calculation label="|dx|" value={dx} />

                <Calculation label="|dy|" value={dy} />

                <Calculation label="Pixels" value={pixels.length || "-"} />
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
          <h2 className="text-xl font-bold">How Bresenham Works</h2>

          <p className="mt-3 leading-7 text-slate-400">
            Bresenham's line algorithm determines which pixels should be
            selected to approximate a straight line. Unlike DDA, it primarily
            uses integer arithmetic, making it efficient for raster displays.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Concept
              title="1. Calculate Differences"
              text="Find the absolute differences between the X and Y coordinates."
            />

            <Concept
              title="2. Calculate Error"
              text="Maintain an error value to decide which neighboring pixel should be selected."
            />

            <Concept
              title="3. Select Pixel"
              text="Update the coordinates and repeat until the endpoint is reached."
            />
          </div>
        </section>

        {/* Module Progress */}

        <section className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
                Module Progress
              </p>

              <h2 className="mt-2 text-xl font-bold">Line Drawing</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Run the Bresenham simulation to complete this learning module.
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

function NumberInput({ label, value, onChange }) {
  return (
    <label className="text-sm">
      <span className="mb-2 block text-slate-400">{label}</span>

      <input
        type="number"
        min="0"
        max="24"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-violet-500"
      />
    </label>
  );
}

function Calculation({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400">{label}</span>

      <span className="font-mono text-violet-400">{value}</span>
    </div>
  );
}

function Concept({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-violet-400">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default BresenhamSimulator;
