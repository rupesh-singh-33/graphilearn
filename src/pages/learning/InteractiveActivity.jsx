import { useState } from "react";
import { FaCheckCircle, FaRedo, FaTrophy } from "react-icons/fa";
const ACTIVITY_STORAGE_KEY = "graphilearn_activity_score";

const questions = [
  {
    question:
      "Which transformation moves an object from one position to another without changing its shape or size?",
    options: ["Rotation", "Translation", "Scaling", "Reflection"],
    answer: "Translation",
    explanation:
      "Translation moves an object along the X and Y axes without changing its shape or size.",
  },
  {
    question:
      "Which algorithm uses an error term and integer arithmetic for line drawing?",
    options: ["DDA", "Bresenham", "Cohen-Sutherland", "Bezier"],
    answer: "Bresenham",
    explanation:
      "Bresenham's line algorithm uses integer arithmetic and an error term to efficiently select pixels.",
  },
  {
    question: "Which algorithm uses eight-way symmetry to draw a circle?",
    options: ["DDA", "Bresenham Line", "Midpoint Circle", "Cohen-Sutherland"],
    answer: "Midpoint Circle",
    explanation:
      "The Midpoint Circle Drawing Algorithm uses eight-way symmetry to generate circle pixels efficiently.",
  },
  {
    question: "Which algorithm is used for line clipping?",
    options: ["DDA", "Bresenham", "Cohen-Sutherland", "Midpoint Circle"],
    answer: "Cohen-Sutherland",
    explanation:
      "Cohen-Sutherland divides the plane into regions and uses region codes to clip lines.",
  },
];

function InteractiveActivity() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  const [score, setScore] = useState(0);

  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];

  const checkAnswer = () => {
    if (!selectedAnswer) {
      return;
    }

    setIsChecked(true);

    if (selectedAnswer === question.answer) {
      setScore((current) => current + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((current) => current + 1);

      setSelectedAnswer("");
      setIsChecked(false);
    } else {
      const finalScore = score + (selectedAnswer === question.answer ? 1 : 0);

      localStorage.setItem(
        ACTIVITY_STORAGE_KEY,
        JSON.stringify({
          score: finalScore,
          total: questions.length,
        }),
      );

      setCompleted(true);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setIsChecked(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-400">
            <FaTrophy />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Activity Complete
          </p>

          <h2 className="mt-2 text-2xl font-bold">Great Work!</h2>

          <p className="mt-3 text-slate-400">
            You scored{" "}
            <span className="font-bold text-white">
              {score} / {questions.length}
            </span>
          </p>

          <button
            type="button"
            onClick={restart}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
          >
            <FaRedo />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Interactive Activity
          </p>

          <h2 className="mt-2 text-2xl font-bold">Test Your Understanding</h2>
        </div>

        <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-400">
          Question {currentQuestion + 1} / {questions.length}
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold leading-7">{question.question}</h3>

        <div className="mt-5 grid gap-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;

            const isCorrect = isChecked && option === question.answer;

            const isWrong =
              isChecked && isSelected && option !== question.answer;

            return (
              <button
                key={option}
                type="button"
                disabled={isChecked}
                onClick={() => setSelectedAnswer(option)}
                className={`rounded-xl border p-4 text-left text-sm font-medium transition ${
                  isCorrect
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : isWrong
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : isSelected
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>

                  {isCorrect && <FaCheckCircle />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}

        {isChecked && (
          <div
            className={`mt-5 rounded-xl border p-4 ${
              selectedAnswer === question.answer
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                selectedAnswer === question.answer
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {selectedAnswer === question.answer ? "Correct!" : "Not quite!"}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Controls */}

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          {!isChecked ? (
            <button
              type="button"
              onClick={checkAnswer}
              disabled={!selectedAnswer}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Check Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={nextQuestion}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Activity"
                : "Next Question"}
            </button>
          )}

          <div className="flex items-center gap-2 text-sm text-slate-500">
            Score:
            <span className="font-semibold text-slate-300">{score}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveActivity;
