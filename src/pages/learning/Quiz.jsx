import { useEffect, useState } from "react";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaRedo,
  FaTimesCircle,
  FaTrophy,
} from "react-icons/fa";

const questions = [
  {
    question:
      "Which transformation moves an object from one position to another?",
    options: ["Rotation", "Translation", "Scaling", "Reflection"],
    answer: "Translation",
  },
  {
    question: "Which transformation changes the orientation of an object?",
    options: ["Translation", "Scaling", "Rotation", "Clipping"],
    answer: "Rotation",
  },
  {
    question: "What does scaling change?",
    options: [
      "Object size",
      "Object color",
      "Object position only",
      "Pixel format",
    ],
    answer: "Object size",
  },
  {
    question: "Which algorithm is used for efficient line drawing?",
    options: [
      "Bresenham's Algorithm",
      "Dijkstra's Algorithm",
      "Prim's Algorithm",
      "Kruskal's Algorithm",
    ],
    answer: "Bresenham's Algorithm",
  },
  {
    question:
      "How many symmetric regions are used by the Midpoint Circle Algorithm?",
    options: ["2", "4", "6", "8"],
    answer: "8",
  },
  {
    question: "Which algorithm is used for rectangular line clipping?",
    options: ["DDA", "Cohen-Sutherland", "Bresenham", "Midpoint Circle"],
    answer: "Cohen-Sutherland",
  },
  {
    question: "How many control points are used for a cubic Bezier curve?",
    options: ["2", "3", "4", "5"],
    answer: "4",
  },
  {
    question: "Which axes are commonly used in 3D computer graphics?",
    options: ["X and Y", "X and Z", "Y and Z", "X, Y and Z"],
    answer: "X, Y and Z",
  },
];

const QUIZ_SCORE_KEY = "graphilearn_quiz_score";
const QUIZ_ATTEMPTED_KEY = "graphilearn_quiz_attempted";

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];

  // Start a fresh quiz attempt
  useEffect(() => {
    localStorage.setItem(QUIZ_SCORE_KEY, "0");
    localStorage.setItem(QUIZ_ATTEMPTED_KEY, "false");
  }, []);

  const handleAnswer = (option) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(option);

    const isCorrect = option === question.answer;

    if (isCorrect) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      // Save final score exactly once at quiz completion
      localStorage.setItem(
        QUIZ_SCORE_KEY,
        String(score + (selectedAnswer === question.answer ? 1 : 0)),
      );

      localStorage.setItem(QUIZ_ATTEMPTED_KEY, "true");

      setShowResult(true);
      return;
    }

    setCurrentQuestion((current) => current + 1);
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);

    localStorage.setItem(QUIZ_SCORE_KEY, "0");
    localStorage.setItem(QUIZ_ATTEMPTED_KEY, "false");
  };

  const percentage = Math.round((score / questions.length) * 100);

  if (showResult) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-slate-800">
          <div className="mx-auto max-w-5xl px-6 py-6">
            <button
              type="button"
              onClick={() => (window.location.href = "/learn")}
              className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <FaArrowLeft />
              Back to Learning Hub
            </button>
          </div>
        </header>

        <main className="mx-auto flex max-w-3xl justify-center px-6 py-16">
          <section className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 text-4xl text-yellow-400">
              <FaTrophy />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Quiz Completed
            </p>

            <h1 className="mt-2 text-4xl font-bold">Great Work!</h1>

            <p className="mt-4 text-slate-400">
              You completed the Computer Graphics quiz.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm text-slate-500">Your Score</p>

              <p className="mt-2 text-5xl font-bold text-blue-400">
                {score}/{questions.length}
              </p>

              <p className="mt-2 text-slate-400">{percentage}% correct</p>
            </div>

            {/* Performance message */}
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
              {percentage >= 80 && (
                <p className="font-semibold text-emerald-400">
                  Excellent! You have a strong understanding of Computer
                  Graphics. 🎉
                </p>
              )}

              {percentage >= 50 && percentage < 80 && (
                <p className="font-semibold text-yellow-400">
                  Good job! Review a few concepts and try again.
                </p>
              )}

              {percentage < 50 && (
                <p className="font-semibold text-red-400">
                  Keep practicing! Review the learning modules and attempt the
                  quiz again.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                <FaRedo />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "/learn/progress")}
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                View Progress
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-400">
            GraphiLearn • Knowledge Check
          </p>

          <h1 className="mt-2 text-3xl font-bold">Computer Graphics Quiz</h1>

          <p className="mt-2 text-slate-400">
            Test your understanding of the concepts you have learned.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="font-semibold text-blue-400">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <p className="text-sm font-semibold text-blue-400">
            Question {currentQuestion + 1}
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-9">
            {question.question}
          </h2>

          <div className="mt-8 space-y-3">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;

              const isCorrect = option === question.answer;

              let optionStyle =
                "border-slate-700 hover:border-blue-500 hover:bg-slate-800";

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  optionStyle = "border-green-500 bg-green-500/10";
                } else if (isSelected) {
                  optionStyle = "border-red-500 bg-red-500/10";
                } else {
                  optionStyle = "border-slate-800 opacity-60";
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${optionStyle}`}
                >
                  <span className="font-medium">{option}</span>

                  {selectedAnswer !== null && isCorrect && (
                    <FaCheckCircle className="text-green-400" />
                  )}

                  {selectedAnswer !== null && isSelected && !isCorrect && (
                    <FaTimesCircle className="text-red-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedAnswer !== null && (
            <div
              className={`mt-6 rounded-xl border p-4 ${
                selectedAnswer === question.answer
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <p
                className={`font-semibold ${
                  selectedAnswer === question.answer
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {selectedAnswer === question.answer
                  ? "Correct! 🎉"
                  : "Not quite."}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Correct answer:{" "}
                <span className="font-semibold text-slate-200">
                  {question.answer}
                </span>
              </p>
            </div>
          )}

          {/* Next */}
          {selectedAnswer !== null && (
            <button
              type="button"
              onClick={nextQuestion}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          )}
        </section>
      </main>
    </div>
  );
}

export default Quiz;
