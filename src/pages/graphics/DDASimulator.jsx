import { useEffect, useRef, useState } from "react";

import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
  FaPlay,
  FaRedo,
} from "react-icons/fa";

const GRID_SIZE = 25;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 450;

const MODULE_NAME = "Line Drawing";
const STORAGE_KEY = "graphilearn_completed_modules";

function DDASimulator() {
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

  /* ----------------------------------
     CHECK MODULE COMPLETION
  ---------------------------------- */

  useEffect(() => {
    const completedModules = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );

    setIsCompleted(completedModules.includes(MODULE_NAME));
  }, []);

  /* ----------------------------------
     CLEANUP TIMER
  ---------------------------------- */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /* ----------------------------------
     GENERATE DDA PIXELS
  ---------------------------------- */

  const generateDDA = () => {
    const x1 = Number(startX);
    const y1 = Number(startY);

    const x2 = Number(endX);
    const y2 = Number(endY);

    const dx = x2 - x1;
    const dy = y2 - y1;

    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    if (steps === 0) {
      return [
        {
          x: x1,
          y: y1,
          exactX: x1,
          exactY: y1,
        },
      ];
    }

    const xIncrement = dx / steps;
    const yIncrement = dy / steps;

    const generatedPixels = [];

    let x = x1;
    let y = y1;

    for (let i = 0; i <= steps; i++) {
      generatedPixels.push({
        x: Math.round(x),
        y: Math.round(y),
        exactX: x,
        exactY: y,
      });

      x += xIncrement;
      y += yIncrement;
    }

    return generatedPixels;
  };

  /* ----------------------------------
     START ANIMATION
  ---------------------------------- */

  const startAnimation = () => {
    if (isRunning) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const generatedPixels = generateDDA();

    setPixels(generatedPixels);
    setCurrentStep(0);
    setIsRunning(true);
  };

  /* ----------------------------------
     PIXEL-BY-PIXEL ANIMATION
  ---------------------------------- */

  useEffect(() => {
    if (!isRunning) return;

    if (pixels.length === 0) return;

    if (currentStep >= pixels.length - 1) {
      setIsRunning(false);
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

  /* ----------------------------------
     MARK MODULE COMPLETE
  ---------------------------------- */

  const markComplete = () => {
    const completedModules = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );

    if (!completedModules.includes(MODULE_NAME)) {
      const updatedModules = [...completedModules, MODULE_NAME];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedModules));
    }

    setIsCompleted(true);
  };

  /* ----------------------------------
     AUTO COMPLETE AFTER ANIMATION
  ---------------------------------- */

  useEffect(() => {
    if (!isRunning && pixels.length > 0 && currentStep === pixels.length - 1) {
      markComplete();
    }
  }, [currentStep, pixels.length, isRunning]);

  /* ----------------------------------
     RESET
  ---------------------------------- */

  const reset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPixels([]);
    setCurrentStep(-1);
    setIsRunning(false);
  };

  /* ----------------------------------
     DDA CALCULATIONS
  ---------------------------------- */

  const dx = Number(endX) - Number(startX);

  const dy = Number(endY) - Number(startY);

  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  const xIncrement = steps === 0 ? 0 : dx / steps;

  const yIncrement = steps === 0 ? 0 : dy / steps;

  /* ----------------------------------
     CANVAS DRAWING
  ---------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    /* Clear canvas */

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    /* Background */

    ctx.fillStyle = "#020617";

    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const originX = 60;
    const originY = CANVAS_HEIGHT - 50;

    /* ----------------------------------
       GRID
    ---------------------------------- */

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

    /* ----------------------------------
       AXES
    ---------------------------------- */

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    /* Y Axis */

    ctx.beginPath();

    ctx.moveTo(originX, 20);

    ctx.lineTo(originX, CANVAS_HEIGHT - 20);

    ctx.stroke();

    /* X Axis */

    ctx.beginPath();

    ctx.moveTo(originX, originY);

    ctx.lineTo(CANVAS_WIDTH - 20, originY);

    ctx.stroke();

    /* ----------------------------------
       AXIS LABELS
    ---------------------------------- */

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";

    ctx.fillText("Y", originX - 18, 30);

    ctx.fillText("X", CANVAS_WIDTH - 30, originY + 20);

    /* ----------------------------------
       COORDINATE NUMBERS
    ---------------------------------- */

    for (let i = 0; i <= 24; i++) {
      const px = originX + i * GRID_SIZE;

      const py = originY - i * GRID_SIZE;

      ctx.fillText(String(i), px - 3, originY + 15);

      ctx.fillText(String(i), originX - 20, py + 4);
    }

    /* ----------------------------------
       VISIBLE PIXELS
    ---------------------------------- */

    const visiblePixels =
      currentStep >= 0 ? pixels.slice(0, currentStep + 1) : [];

    visiblePixels.forEach((pixel, index) => {
      const px = originX + pixel.x * GRID_SIZE;

      const py = originY - pixel.y * GRID_SIZE;

      /* Current pixel = yellow
           Previous pixels = blue */

      ctx.fillStyle =
        index === visiblePixels.length - 1 ? "#facc15" : "#60a5fa";

      ctx.fillRect(px - 6, py - 6, 12, 12);
    });

    /* ----------------------------------
       START POINT
    ---------------------------------- */

    if (pixels.length > 0) {
      const first = pixels[0];

      const px = originX + first.x * GRID_SIZE;

      const py = originY - first.y * GRID_SIZE;

      ctx.fillStyle = "#22c55e";

      ctx.beginPath();

      ctx.arc(px, py, 5, 0, Math.PI * 2);

      ctx.fill();
    }

    /* ----------------------------------
       END POINT
    ---------------------------------- */

    if (pixels.length > 0) {
      const last = pixels[pixels.length - 1];

      const px = originX + last.x * GRID_SIZE;

      const py = originY - last.y * GRID_SIZE;

      ctx.fillStyle = "#ef4444";

      ctx.beginPath();

      ctx.arc(px, py, 5, 0, Math.PI * 2);

      ctx.fill();
    }
  }, [pixels, currentStep]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ----------------------------------
          HEADER
      ---------------------------------- */}

      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <button
            type="button"
            onClick={() => (window.location.href = "/learn")}
            className="mb-5 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FaArrowLeft />
            Back to Learning Hub
          </button>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Interactive Graphics Lab
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">DDA Line Drawing Algorithm</h1>

            {isCompleted && (
              <span className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                <FaCheckCircle />
                Completed
              </span>
            )}
          </div>

          <p className="mt-2 max-w-3xl text-slate-400">
            Visualize how the Digital Differential Analyzer algorithm generates
            a line pixel by pixel.
          </p>
        </div>
      </header>

      {/* ----------------------------------
          MAIN
      ---------------------------------- */}

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ----------------------------------
              CANVAS
          ---------------------------------- */}

          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="font-semibold">Pixel Visualization</h2>

              <p className="text-sm text-slate-400">
                Green = start point • Red = end point • Yellow = current pixel
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

          {/* ----------------------------------
              CONTROLS
          ---------------------------------- */}

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

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={startAnimation}
                disabled={isRunning}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
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

            {/* ----------------------------------
                CALCULATIONS
            ---------------------------------- */}

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="font-semibold">DDA Calculations</h3>

              <div className="mt-4 space-y-3 text-sm">
                <Calculation label="dx" value={dx} />

                <Calculation label="dy" value={dy} />

                <Calculation label="Steps" value={steps} />

                <Calculation
                  label="X Increment"
                  value={xIncrement.toFixed(2)}
                />

                <Calculation
                  label="Y Increment"
                  value={yIncrement.toFixed(2)}
                />
              </div>
            </div>

            {/* ----------------------------------
                CURRENT PIXEL
            ---------------------------------- */}

            {currentStep >= 0 && (
              <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="text-sm text-slate-400">Current Pixel</p>

                <p className="mt-1 font-bold text-yellow-400">
                  Step {currentStep + 1} / {pixels.length}
                </p>

                {pixels[currentStep] && (
                  <p className="mt-1 text-xs text-slate-500">
                    Pixel: ({pixels[currentStep].x}, {pixels[currentStep].y})
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* ----------------------------------
            EXPLANATION
        ---------------------------------- */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FaBookOpen />
            </div>

            <div>
              <h2 className="text-xl font-bold">How DDA Works</h2>

              <p className="text-sm text-slate-400">
                Step-by-step algorithm explanation
              </p>
            </div>
          </div>

          <ol className="mt-5 space-y-3 text-slate-400">
            <li>
              <strong className="text-white">1.</strong> Calculate the
              difference between the end and starting coordinates.
            </li>

            <li>
              <strong className="text-white">2.</strong> Determine the number of
              steps using the larger absolute difference.
            </li>

            <li>
              <strong className="text-white">3.</strong> Calculate the X and Y
              increments.
            </li>

            <li>
              <strong className="text-white">4.</strong> Increment X and Y for
              every step.
            </li>

            <li>
              <strong className="text-white">5.</strong> Round the coordinates
              and plot the corresponding pixel.
            </li>
          </ol>
        </section>

        {/* ----------------------------------
            COMPLETION
        ---------------------------------- */}

        <section className="mt-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Module Progress
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {isCompleted
                  ? "DDA module completed"
                  : "Complete the DDA module"}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Run the interactive algorithm to complete this learning module
                and update your progress.
              </p>
            </div>

            {isCompleted ? (
              <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-3 font-semibold text-green-400">
                <FaCheckCircle />
                Completed
              </div>
            ) : (
              <div className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-400">
                Run Algorithm to Complete
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ----------------------------------
   NUMBER INPUT
---------------------------------- */

function NumberInput({ label, value, onChange }) {
  return (
    <label className="text-sm">
      <span className="mb-2 block text-slate-400">{label}</span>

      <input
        type="number"
        value={value}
        min="0"
        max="24"
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
      />
    </label>
  );
}

/* ----------------------------------
   CALCULATION
---------------------------------- */

function Calculation({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400">{label}</span>

      <span className="font-mono text-blue-400">{value}</span>
    </div>
  );
}

export default DDASimulator;
