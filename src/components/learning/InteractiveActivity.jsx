import { useState } from "react";
import { FaCheckCircle, FaRedo, FaTrophy } from "react-icons/fa";

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
    if (!selectedAnswer) return;

    setIsChecked(true);

    if (selectedAnswer === question.answer) {
      setScore((current) => current + 1);
    }
  };

  const nextQuestion = () => {
    if (!isChecked) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((current) => current + 1);
      setSelectedAnswer("");
      setIsChecked(false);
    } else {
      const finalScore = score + (selectedAnswer === question.answer ? 1 : 0);

      localStorage.setItem(
        "graphilearn_activity_score",
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
    const finalScore = JSON.parse(
      localStorage.getItem("graphilearn_activity_score") ||
        '{"score":0,"total":4}',
    );

    const percentage = Math.round((finalScore.score / finalScore.total) * 100);

    return (
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10 text-3xl text-yellow-400">
            <FaTrophy />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-purple-400">
            Activity Completed
          </p>

          <h2 className="mt-2 text-2xl font-bold">Great job!</h2>

          <p className="mt-3 text-slate-400">
            You completed the interactive Computer Graphics activity.
          </p>

          <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <p className="text-sm text-slate-500">Your Score</p>

            <p className="mt-2 text-4xl font-bold text-purple-400">
              {finalScore.score}/{finalScore.total}
            </p>

            <p className="mt-2 text-sm text-slate-400">{percentage}% correct</p>
          </div>

          <button
            type="button"
            onClick={restart}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold transition hover:bg-purple-500"
          >
            <FaRedo />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-400">
            Interactive Activity
          </p>

          <h2 className="mt-2 text-2xl font-bold">Test Your Understanding</h2>

          <p className="mt-2 text-sm text-slate-400">
            Answer the questions and check your Computer Graphics knowledge.
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300">
          Question {currentQuestion + 1} / {questions.length}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-purple-600 transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

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
                    ? "border-green-500/40 bg-green-500/10 text-green-400"
                    : isWrong
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : isSelected
                        ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                        : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isChecked && (
          <div
            className={`mt-5 rounded-2xl border p-4 ${
              selectedAnswer === question.answer
                ? "border-green-500/20 bg-green-500/10"
                : "border-red-500/20 bg-red-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <FaCheckCircle
                className={`mt-1 shrink-0 ${
                  selectedAnswer === question.answer
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              />

              <div>
                <p className="font-semibold">
                  {selectedAnswer === question.answer
                    ? "Correct!"
                    : "Not quite."}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          {!isChecked ? (
            <button
              type="button"
              onClick={checkAnswer}
              disabled={!selectedAnswer}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                selectedAnswer
                  ? "bg-purple-600 text-white hover:bg-purple-500"
                  : "cursor-not-allowed bg-slate-800 text-slate-500"
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={nextQuestion}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Activity"
                : "Next Question"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default InteractiveActivity;
