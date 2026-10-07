import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { FaArrowLeft, FaCheckCircle, FaRedo } from "react-icons/fa";

const MODULE_NAME = "3D Graphics";
const STORAGE_KEY = "graphilearn_completed_modules";

function Cube({ rotation, scale }) {
  return (
    <mesh
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale.x, scale.y, scale.z]}
    >
      <boxGeometry args={[2, 2, 2]} />

      <meshStandardMaterial color="#3b82f6" metalness={0.25} roughness={0.35} />
    </mesh>
  );
}

function ThreeDGraphics() {
  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [scale, setScale] = useState({
    x: 1,
    y: 1,
    z: 1,
  });

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

  // Save module completion
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

  const updateRotation = (axis, value) => {
    setRotation((current) => ({
      ...current,
      [axis]: Number(value),
    }));

    // Interaction completes module
    markComplete();
  };

  const updateScale = (axis, value) => {
    setScale((current) => ({
      ...current,
      [axis]: Number(value),
    }));

    // Interaction completes module
    markComplete();
  };

  const reset = () => {
    setRotation({
      x: 0,
      y: 0,
      z: 0,
    });

    setScale({
      x: 1,
      y: 1,
      z: 1,
    });
  };

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

              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Interactive Graphics Lab
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                3D Graphics & Transformations
              </h1>

              <p className="mt-2 max-w-3xl text-slate-400">
                Explore 3D rotation and scaling using an interactive WebGL cube.
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
          {/* 3D Scene */}

          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="font-semibold">Interactive 3D Scene</h2>

              <p className="text-sm text-slate-400">
                Drag to rotate the camera and use the controls to transform the
                cube.
              </p>
            </div>

            <div className="h-[450px]">
              <Canvas>
                <PerspectiveCamera makeDefault position={[5, 4, 6]} />

                <ambientLight intensity={1.2} />

                <directionalLight position={[5, 5, 5]} intensity={2} />

                <Cube rotation={rotation} scale={scale} />

                <gridHelper args={[12, 12]} position={[0, -1.5, 0]} />

                <axesHelper args={[3]} />

                <OrbitControls />
              </Canvas>
            </div>
          </section>

          {/* Controls */}

          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="font-semibold">Transformation Controls</h2>

            {/* Rotation */}

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-indigo-400">
                Rotation
              </h3>

              <Slider
                label="Rotate X"
                value={rotation.x}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                onChange={(value) => updateRotation("x", value)}
              />

              <Slider
                label="Rotate Y"
                value={rotation.y}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                onChange={(value) => updateRotation("y", value)}
              />

              <Slider
                label="Rotate Z"
                value={rotation.z}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                onChange={(value) => updateRotation("z", value)}
              />
            </div>

            {/* Scaling */}

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-indigo-400">Scaling</h3>

              <Slider
                label="Scale X"
                value={scale.x}
                min={0.5}
                max={2.5}
                step={0.1}
                onChange={(value) => updateScale("x", value)}
              />

              <Slider
                label="Scale Y"
                value={scale.y}
                min={0.5}
                max={2.5}
                step={0.1}
                onChange={(value) => updateScale("y", value)}
              />

              <Slider
                label="Scale Z"
                value={scale.z}
                min={0.5}
                max={2.5}
                step={0.1}
                onChange={(value) => updateScale("z", value)}
              />
            </div>

            {/* Reset */}

            <button
              type="button"
              onClick={reset}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold transition hover:bg-slate-800"
            >
              <FaRedo />
              Reset Transformations
            </button>
          </aside>
        </div>

        {/* Explanation */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">3D Transformations</h2>

          <p className="mt-3 leading-7 text-slate-400">
            In 3D computer graphics, objects can be transformed along the X, Y
            and Z axes. Rotation changes the orientation of an object, while
            scaling changes its size.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Concept
              title="Rotation"
              text="Rotate an object around the X, Y or Z axis."
            />

            <Concept
              title="Scaling"
              text="Increase or decrease the size of the object independently along each axis."
            />

            <Concept
              title="Perspective"
              text="The camera creates a 3D perspective view where objects farther away appear smaller."
            />
          </div>
        </section>

        {/* Module Progress */}

        <section className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Module Progress
              </p>

              <h2 className="mt-2 text-xl font-bold">3D Graphics</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Use the rotation or scaling controls to interact with the 3D
                object and complete this module.
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

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm text-slate-300">{label}</label>

        <span className="font-mono text-xs text-slate-400">
          {value.toFixed(2)}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full accent-indigo-500"
      />
    </div>
  );
}

function Concept({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <h3 className="font-semibold text-indigo-400">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

export default ThreeDGraphics;
