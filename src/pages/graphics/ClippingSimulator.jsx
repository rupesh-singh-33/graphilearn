import { useEffect, useRef, useState } from "react";

import { FaArrowLeft, FaCheckCircle, FaPlay, FaRedo } from "react-icons/fa";

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 450;

const CLIP_LEFT = 220;
const CLIP_TOP = 110;
const CLIP_RIGHT = 480;
const CLIP_BOTTOM = 340;

const MODULE_NAME = "Line Clipping";
const STORAGE_KEY = "graphilearn_completed_modules";

function getCode(x, y) {
  let code = 0;

  if (x < CLIP_LEFT) code |= 1;
  if (x > CLIP_RIGHT) code |= 2;
  if (y < CLIP_TOP) code |= 4;
  if (y > CLIP_BOTTOM) code |= 8;

  return code;
}

function codeToBinary(code) {
  return code.toString(2).padStart(4, "0");
}

function calculateClipping(x1, y1, x2, y2) {
  let xStart = x1;
  let yStart = y1;
  let xEnd = x2;
  let yEnd = y2;

  let code1 = getCode(xStart, yStart);
  let code2 = getCode(xEnd, yEnd);

  const steps = [];

  while (true) {
    if ((code1 | code2) === 0) {
      steps.push({
        type: "accept",
        x1: xStart,
        y1: yStart,
        x2: xEnd,
        y2: yEnd,
      });

      return {
        accepted: true,
        x1: xStart,
        y1: yStart,
        x2: xEnd,
        y2: yEnd,
        steps,
      };
    }

    if ((code1 & code2) !== 0) {
      steps.push({
        type: "reject",
      });

      return {
        accepted: false,
        steps,
      };
    }

    const outsideCode = code1 !== 0 ? code1 : code2;

    let x;
    let y;

    if (outsideCode & 8) {
      x = xStart + ((xEnd - xStart) * (CLIP_BOTTOM - yStart)) / (yEnd - yStart);

      y = CLIP_BOTTOM;
    } else if (outsideCode & 4) {
      x = xStart + ((xEnd - xStart) * (CLIP_TOP - yStart)) / (yEnd - yStart);

      y = CLIP_TOP;
    } else if (outsideCode & 2) {
      y = yStart + ((yEnd - yStart) * (CLIP_RIGHT - xStart)) / (xEnd - xStart);

      x = CLIP_RIGHT;
    } else {
      y = yStart + ((yEnd - yStart) * (CLIP_LEFT - xStart)) / (xEnd - xStart);

      x = CLIP_LEFT;
    }

    steps.push({
      type: "clip",
      x1: xStart,
      y1: yStart,
      x2: xEnd,
      y2: yEnd,
      intersectionX: x,
      intersectionY: y,
    });

    if (outsideCode === code1) {
      xStart = x;
      yStart = y;
      code1 = getCode(xStart, yStart);
    } else {
      xEnd = x;
      yEnd = y;
      code2 = getCode(xEnd, yEnd);
    }
  }
}

function ClippingSimulator() {
  const canvasRef = useRef(null);

  const [x1, setX1] = useState(120);
  const [y1, setY1] = useState(220);
  const [x2, setX2] = useState(570);
  const [y2, setY2] = useState(250);

  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
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

  const handleClip = () => {
    const clippingResult = calculateClipping(
      Number(x1),
      Number(y1),
      Number(x2),
      Number(y2),
    );

    setResult(clippingResult);
    setShowResult(true);

    // Running the clipping algorithm completes the module
    markComplete();
  };

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
    setX1(120);
    setY1(220);
    setX2(570);
    setY2(250);
    setResult(null);
    setShowResult(false);
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
    // Clipping window
    // -------------------------

    ctx.fillStyle = "rgba(59, 130, 246, 0.08)";

    ctx.fillRect(
      CLIP_LEFT,
      CLIP_TOP,
      CLIP_RIGHT - CLIP_LEFT,
      CLIP_BOTTOM - CLIP_TOP,
    );

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;

    ctx.strokeRect(
      CLIP_LEFT,
      CLIP_TOP,
      CLIP_RIGHT - CLIP_LEFT,
      CLIP_BOTTOM - CLIP_TOP,
    );

    // Window label
    ctx.fillStyle = "#60a5fa";
    ctx.font = "14px sans-serif";

    ctx.fillText("Clipping Window", CLIP_LEFT + 10, CLIP_TOP + 22);

    // -------------------------
    // Original line
    // -------------------------

    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.stroke();

    // Original start point
    ctx.fillStyle = "#f97316";

    ctx.beginPath();

    ctx.arc(x1, y1, 6, 0, Math.PI * 2);

    ctx.fill();

    // Original end point
    ctx.beginPath();

    ctx.arc(x2, y2, 6, 0, Math.PI * 2);

    ctx.fill();

    // -------------------------
    // Clipped line
    // -------------------------

    if (showResult && result?.accepted) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 6;

      ctx.beginPath();

      ctx.moveTo(result.x1, result.y1);

      ctx.lineTo(result.x2, result.y2);

      ctx.stroke();

      // Clipped start
      ctx.fillStyle = "#22c55e";

      ctx.beginPath();

      ctx.arc(result.x1, result.y1, 7, 0, Math.PI * 2);

      ctx.fill();

      // Clipped end
      ctx.beginPath();

      ctx.arc(result.x2, result.y2, 7, 0, Math.PI * 2);

      ctx.fill();
    }
  }, [x1, y1, x2, y2, result, showResult]);

  const startCode = getCode(Number(x1), Number(y1));

  const endCode = getCode(Number(x2), Number(y2));

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

              <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                Interactive Graphics Lab
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Cohen-Sutherland Line Clipping
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                Visualize how a line is clipped against a rectangular clipping
                window using region codes.
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
              <h2 className="font-semibold">Clipping Visualization</h2>

              <p className="text-sm text-slate-400">
                Orange = original line, Green = clipped line
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
            <h2 className="font-semibold">Line Controls</h2>

            <div className="mt-5 space-y-4">
              <Input label="Start X" value={x1} onChange={setX1} />

              <Input label="Start Y" value={y1} onChange={setY1} />

              <Input label="End X" value={x2} onChange={setX2} />

              <Input label="End Y" value={y2} onChange={setY2} />
            </div>

            {/* Buttons */}

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={handleClip}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold transition hover:bg-orange-500"
              >
                <FaPlay />
                Clip Line
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

            {/* Region Codes */}

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h3 className="font-semibold">Region Codes</h3>

              <div className="mt-4 space-y-3 text-sm">
                <CodeInfo label="Start Point" code={codeToBinary(startCode)} />

                <CodeInfo label="End Point" code={codeToBinary(endCode)} />
              </div>
            </div>

            {/* Result */}

            {showResult && result && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Result</p>

                <p
                  className={`mt-1 text-lg font-bold ${
                    result.accepted ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {result.accepted ? "Line Accepted" : "Line Rejected"}
                </p>

                {result.accepted && (
                  <div className="mt-3 space-y-1 text-sm text-slate-400">
                    <p>
                      Clipped Start:{" "}
                      <span className="font-mono text-green-400">
                        ({result.x1.toFixed(1)}, {result.y1.toFixed(1)})
                      </span>
                    </p>

                    <p>
                      Clipped End:{" "}
                      <span className="font-mono text-green-400">
                        ({result.x2.toFixed(1)}, {result.y2.toFixed(1)})
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Explanation */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">How Cohen-Sutherland Works</h2>

          <p className="mt-3 leading-7 text-slate-400">
            Cohen-Sutherland assigns a 4-bit region code to each endpoint of a
            line. These codes indicate whether a point lies inside, above,
            below, left, or right of the clipping window.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Concept
              title="1. Assign Codes"
              text="Each endpoint receives a four-bit region code based on its position relative to the clipping window."
            />

            <Concept
              title="2. Test the Line"
              text="If both codes are zero, the line is completely inside. If their logical AND is non-zero, the line is rejected."
            />

            <Concept
              title="3. Clip"
              text="Otherwise, calculate the intersection with the clipping boundary and repeat until the visible portion is found."
            />
          </div>
        </section>

        {/* Module Progress */}

        <section className="mt-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                Module Progress
              </p>

              <h2 className="mt-2 text-xl font-bold">Line Clipping</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Run the Cohen-Sutherland clipping algorithm to complete this
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

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">{label}</label>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
      />
    </div>
  );
}

function CodeInfo({ label, code }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400">{label}</span>

      <span className="font-mono text-orange-400">{code}</span>
    </div>
  );
}

function Concept({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-orange-400">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default ClippingSimulator;
