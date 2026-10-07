import { useEffect, useRef, useState } from "react";
import { FaUndo } from "react-icons/fa";

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 450;

function Transformations() {
  const canvasRef = useRef(null);

  const [translationX, setTranslationX] = useState(0);
  const [translationY, setTranslationY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [shearX, setShearX] = useState(0);
  const [shearY, setShearY] = useState(0);

  const resetTransformations = () => {
    setTranslationX(0);
    setTranslationY(0);
    setRotation(0);
    setScale(1);
    setShearX(0);
    setShearY(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid
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

    // Center axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT / 2);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
    ctx.stroke();

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    // Original shape
    ctx.save();

    ctx.translate(centerX, centerY);

    ctx.fillStyle = "rgba(100, 116, 139, 0.25)";
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    ctx.fillRect(-50, -50, 100, 100);
    ctx.strokeRect(-50, -50, 100, 100);

    ctx.restore();

    // Transformed shape
    ctx.save();

    ctx.translate(centerX + translationX, centerY + translationY);

    ctx.rotate((rotation * Math.PI) / 180);

    ctx.scale(scale, scale);

    ctx.transform(1, shearY / 100, shearX / 100, 1, 0, 0);

    ctx.fillStyle = "rgba(59, 130, 246, 0.45)";
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;

    ctx.fillRect(-50, -50, 100, 100);
    ctx.strokeRect(-50, -50, 100, 100);

    ctx.restore();

    // Label
    ctx.font = "14px sans-serif";

    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Original", centerX - 45, centerY + 75);

    ctx.fillStyle = "#60a5fa";
    ctx.fillText("Transformed", centerX + 55, centerY - 65);
  }, [translationX, translationY, rotation, scale, shearX, shearY]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Interactive Graphics Lab
          </p>

          <h1 className="mt-2 text-3xl font-bold">2D Transformations</h1>

          <p className="mt-2 max-w-3xl text-slate-400">
            Explore translation, rotation, scaling and shearing by transforming
            a shape in real time.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Canvas */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="font-semibold">Transformation Preview</h2>

              <p className="text-sm text-slate-400">
                Adjust the controls and observe the result.
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
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Controls</h2>

              <button
                type="button"
                onClick={resetTransformations}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
              >
                <FaUndo />
                Reset
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Translation X */}
              <Control
                label="Translation X"
                value={translationX}
                min={-200}
                max={200}
                step={1}
                onChange={setTranslationX}
                suffix="px"
              />

              {/* Translation Y */}
              <Control
                label="Translation Y"
                value={translationY}
                min={-150}
                max={150}
                step={1}
                onChange={setTranslationY}
                suffix="px"
              />

              {/* Rotation */}
              <Control
                label="Rotation"
                value={rotation}
                min={-180}
                max={180}
                step={1}
                onChange={setRotation}
                suffix="°"
              />

              {/* Scale */}
              <Control
                label="Scale"
                value={scale}
                min={0.2}
                max={3}
                step={0.1}
                onChange={setScale}
                suffix="x"
              />

              {/* Shear X */}
              <Control
                label="Shear X"
                value={shearX}
                min={-100}
                max={100}
                step={1}
                onChange={setShearX}
                suffix="%"
              />

              {/* Shear Y */}
              <Control
                label="Shear Y"
                value={shearY}
                min={-100}
                max={100}
                step={1}
                onChange={setShearY}
                suffix="%"
              />
            </div>
          </aside>
        </div>

        {/* Explanation */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">What are 2D Transformations?</h2>

          <p className="mt-3 leading-7 text-slate-400">
            A 2D transformation changes the position, size or orientation of an
            object in a two-dimensional coordinate system. Common
            transformations include translation, rotation, scaling, reflection
            and shearing.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Concept title="Translation" formula="x' = x + Tx,  y' = y + Ty" />

            <Concept title="Rotation" formula="x' = x cosθ − y sinθ" />

            <Concept title="Scaling" formula="x' = x × Sx,  y' = y × Sy" />

            <Concept title="Shearing" formula="x' = x + Shx × y" />

            <Concept
              title="Reflection"
              formula="Mirror an object across an axis"
            />

            <Concept
              title="Composition"
              formula="Multiple transformations combined"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function Control({ label, value, min, max, step, onChange, suffix }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm text-slate-300">{label}</label>

        <span className="text-sm font-semibold text-blue-400">
          {value}
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

function Concept({ title, formula }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-blue-400">{title}</h3>

      <p className="mt-2 text-sm text-slate-400">{formula}</p>
    </div>
  );
}

export default Transformations;
