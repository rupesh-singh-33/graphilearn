import { useEffect, useRef, useState } from "react";

import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
  FaPlay,
  FaRedo,
  FaVolumeUp,
} from "react-icons/fa";

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 420;
const GRID_SIZE = 30;

const MODULE_NAME = "2D Transformations";

function TransformationsLesson() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [translationX, setTranslationX] = useState(0);
  const [translationY, setTranslationY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check whether this module is already completed
  useEffect(() => {
    const completedModules = JSON.parse(
      localStorage.getItem("graphilearn_completed_modules") || "[]",
    );

    setIsCompleted(completedModules.includes(MODULE_NAME));
  }, []);

  // Cleanup animation and narration when leaving page
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const reset = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setTranslationX(0);
    setTranslationY(0);
    setRotation(0);
    setScale(1);
    setIsAnimating(false);
  };

  const animateTransformation = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    const startTime = performance.now();
    const duration = 1200;

    const startValues = {
      x: translationX,
      y: translationY,
      rotation,
      scale,
    };

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setTranslationX(startValues.x + 80 * eased);
      setTranslationY(startValues.y - 40 * eased);
      setRotation(startValues.rotation + 180 * eased);
      setScale(startValues.scale + 0.5 * eased);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const speakLesson = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      stopLesson();
      return;
    }

    const text =
      "Welcome to the two dimensional transformations lesson. " +
      "A transformation changes the position, orientation, or size of an object. " +
      "Translation moves an object from one position to another. " +
      "Rotation changes the orientation of an object. " +
      "Scaling changes the size of an object. " +
      "These transformations are fundamental concepts in computer graphics.";

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 1;

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(speech);
  };

  const stopLesson = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  const markLessonComplete = () => {
    const completedModules = JSON.parse(
      localStorage.getItem("graphilearn_completed_modules") || "[]",
    );

    if (!completedModules.includes(MODULE_NAME)) {
      completedModules.push(MODULE_NAME);

      localStorage.setItem(
        "graphilearn_completed_modules",
        JSON.stringify(completedModules),
      );
    }

    setIsCompleted(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    // Grid
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

    // Axes
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

    // Original object
    ctx.save();

    ctx.translate(centerX, centerY);

    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);

    ctx.strokeRect(-60, -60, 120, 120);

    ctx.restore();

    // Transformed object
    ctx.save();

    ctx.translate(centerX + translationX, centerY + translationY);

    ctx.rotate((rotation * Math.PI) / 180);

    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(59, 130, 246, 0.25)";

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 4;
    ctx.setLineDash([]);

    ctx.fillRect(-60, -60, 120, 120);
    ctx.strokeRect(-60, -60, 120, 120);

    ctx.restore();

    // Labels
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#94a3b8";

    ctx.fillText("Original Object", centerX - 55, centerY + 90);

    ctx.fillStyle = "#60a5fa";

    ctx.fillText(
      "Transformed Object",
      centerX + translationX - 65,
      centerY + translationY + 90,
    );
  }, [translationX, translationY, rotation, scale]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <button
            type="button"
            onClick={() => (window.location.href = "/learn")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FaArrowLeft />
            Back to Learning Hub
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
              <FaBookOpen />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Interactive Lesson
              </p>

              <h1 className="text-3xl font-bold">2D Transformations</h1>
            </div>
          </div>

          <p className="mt-3 max-w-3xl text-slate-400">
            Learn how computer graphics objects can be moved, rotated and
            resized using mathematical transformations.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Concept */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-400">
                Step 1 • Understand
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                What are 2D Transformations?
              </h2>
            </div>

            {/* Narration */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={speakLesson}
                className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold transition hover:bg-slate-800"
              >
                <FaVolumeUp />

                {isSpeaking ? "Stop Narration" : "Listen to Lesson"}
              </button>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopLesson}
                  className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold transition hover:bg-red-500"
                >
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>

          <p className="mt-4 max-w-4xl leading-7 text-slate-400">
            A transformation changes the position, orientation or size of a
            graphical object. In computer graphics, transformations are commonly
            represented using mathematical equations and matrices.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ConceptCard
              title="Translation"
              formula="x' = x + Tx"
              description="Moves an object from one position to another."
            />

            <ConceptCard
              title="Rotation"
              formula="θ → new orientation"
              description="Rotates an object around a reference point."
            />

            <ConceptCard
              title="Scaling"
              formula="x' = Sx · x"
              description="Changes the size of an object."
            />
          </div>
        </section>

        {/* Interactive Visualization */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <p className="text-sm font-semibold text-blue-400">
              Step 2 • Visualize
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Interactive Transformation Lab
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Adjust the controls and observe the object change in real time.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px]">
            {/* Canvas */}
            <div className="overflow-x-auto p-5">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="mx-auto block rounded-xl border border-slate-800"
              />
            </div>

            {/* Controls */}
            <aside className="border-t border-slate-800 p-6 lg:border-l lg:border-t-0">
              <h3 className="font-semibold">Transformation Controls</h3>

              <Slider
                label="Translation X"
                value={translationX}
                min={-150}
                max={150}
                step={1}
                onChange={setTranslationX}
              />

              <Slider
                label="Translation Y"
                value={translationY}
                min={-100}
                max={100}
                step={1}
                onChange={setTranslationY}
              />

              <Slider
                label="Rotation"
                value={rotation}
                min={-180}
                max={180}
                step={1}
                onChange={setRotation}
                suffix="°"
              />

              <Slider
                label="Scale"
                value={scale}
                min={0.5}
                max={2}
                step={0.1}
                onChange={setScale}
              />

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={animateTransformation}
                  disabled={isAnimating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaPlay />

                  {isAnimating ? "Animating..." : "Play Animation"}
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
            </aside>
          </div>
        </section>

        {/* Multimedia */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold text-purple-400">
            Step 2.5 • Multimedia
          </p>

          <h2 className="mt-2 text-2xl font-bold">Visual Learning Resources</h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Use visual demonstrations together with the interactive simulator to
            understand how transformations work.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Diagram */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex h-52 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
                <div className="relative h-32 w-32 rotate-12 border-4 border-blue-500 bg-blue-500/10">
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-slate-400">
                    Rotation
                  </span>

                  <span className="absolute -right-16 top-1/2 text-xs text-slate-400">
                    Scale
                  </span>

                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-400">
                    Translation →
                  </span>
                </div>
              </div>

              <h3 className="mt-4 font-semibold">
                Transformation Visualization
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Translation moves an object, rotation changes its orientation,
                and scaling changes its size.
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950">
                <div className="text-center">
                  <div className="text-5xl">🎥</div>

                  <h3 className="mt-4 font-semibold text-slate-200">
                    Transformation Video
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Educational video will be added here.
                  </p>

                  <span className="mt-4 inline-block rounded-full bg-slate-800 px-4 py-2 text-xs text-slate-400">
                    Video Resource
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activity */}
        <section className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <p className="text-sm font-semibold text-blue-400">
            Step 3 • Interactive Activity
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Experiment with the Object
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Try rotating the object by 90°, move it along the X axis, and then
            increase its scale. Observe how each transformation affects the
            final position and shape.
          </p>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Current transformation</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Value label="X" value={Math.round(translationX)} />

              <Value label="Y" value={Math.round(translationY)} />

              <Value label="Rotation" value={`${Math.round(rotation)}°`} />

              <Value label="Scale" value={scale.toFixed(1)} />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Lesson Summary</h2>

              <p className="mt-2 text-sm text-slate-500">
                Review the important concepts before marking this module
                complete.
              </p>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                <FaCheckCircle />
                Completed
              </div>
            )}
          </div>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
            <li>✓ Translation changes an object's position.</li>

            <li>✓ Rotation changes an object's orientation.</li>

            <li>✓ Scaling changes an object's size.</li>

            <li>✓ Multiple transformations can be combined.</li>
          </ul>

          <button
            type="button"
            onClick={markLessonComplete}
            disabled={isCompleted}
            className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-700"
          >
            <FaCheckCircle />

            {isCompleted ? "Lesson Completed" : "Mark Lesson Complete"}
          </button>
        </section>
      </main>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, suffix = "" }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm text-slate-300">{label}</label>

        <span className="font-mono text-xs text-blue-400">
          {typeof value === "number" ? value.toFixed(step < 1 ? 1 : 0) : value}

          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-500"
      />
    </div>
  );
}

function ConceptCard({ title, formula, description }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="font-semibold text-blue-400">{title}</h3>

      <p className="mt-3 font-mono text-sm text-slate-300">{formula}</p>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function Value({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-lg font-bold text-blue-400">{value}</p>
    </div>
  );
}

export default TransformationsLesson;
