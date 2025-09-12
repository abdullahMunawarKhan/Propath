import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import quiz, { calculateScores } from "../data/questions";
import { supabase } from "../utils/supabase";

const TOTAL_TIME = 300; // 5 minutes

const Quiz = () => {
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(TOTAL_TIME);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Fetch authenticated user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        navigate("/login");
      } else {
        setUser(data.user);
      }
    });
  }, [navigate]);

  // Filter Questions by Difficulty
  useEffect(() => {
    if (level) {
      let selected = [];
      if (level === "easy") selected = quiz.imageMcq;
      else if (level === "medium") selected = quiz.mcq;
      else if (level === "hard") selected = quiz.mixed;
      setFilteredQuestions(selected);
    }
  }, [level]);

  // Timer
  useEffect(() => {
    if (level) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [level]);

  useEffect(() => {
    if (timer === 0 && filteredQuestions.length > 0) handleSubmit();
  }, [timer]);

  useEffect(() => {
    if (
      currentQuestion >= filteredQuestions.length &&
      filteredQuestions.length > 0
    ) {
      handleSubmit();
    }
  }, [currentQuestion, filteredQuestions]);

  // Handle Answer
  const handleAnswer = (option) => {
    setSelectedOption(option);

    const domain = option.domain || null;
    const selectedValue = option.text || option.imageUrl;

    setAnswers((prev) => [
      ...prev,
      {
        question: filteredQuestions[currentQuestion].question,
        selected: selectedValue,
        domain,
      },
    ]);

    setSelectedOption(null);
    setCurrentQuestion((prev) => prev + 1);
  };

  // Submit Quiz
  const handleSubmit = async () => {
    clearInterval(timerRef.current);

    if (!user) return; // user must be loaded

    try {
      const topDomains = calculateScores(answers);

      const { error } = await supabase.from("quiz_results").insert([
        {
          user_id: user.id,
          assessment_domains: topDomains,
          submitted_at: new Date(),
        },
      ]);

      if (error) {
        console.error("Insert quiz_results failed:", error);
        alert("Failed to submit quiz results. Please try again.");
        return;
      }

      navigate("/result", {
        state: { answers, assessment_domains: topDomains },
      });
    } catch (error) {
      console.error(error);
      alert("Error submitting quiz");
    }
  };

  // Difficulty Selection
  if (!user || !level) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-50 px-4">
        {!user ? (
          <p className="text-lg font-semibold text-gray-600">
            Loading user…
          </p>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800">
              Choose Difficulty
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              {[
                { name: "Easy", type: "easy", color: "bg-purple-500", icon: "🖼️" },
                { name: "Medium", type: "medium", color: "bg-blue-500", icon: "📄" },
                { name: "Hard", type: "hard", color: "bg-pink-500", icon: "🧩" },
              ].map((lvl) => (
                <div
                  key={lvl.type}
                  onClick={() => setLevel(lvl.type)}
                  className={`${lvl.color} flex flex-col items-center justify-center w-48 h-32 rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105`}
                >
                  <span className="text-4xl mb-2">{lvl.icon}</span>
                  <span className="text-white font-semibold text-lg">
                    {lvl.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Loading State
  if (filteredQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading quiz...</p>
      </div>
    );
  }

  // Submitting State
  if (currentQuestion >= filteredQuestions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">
          Submitting your responses...
        </p>
      </div>
    );
  }

  // Quiz Page
  const question = filteredQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between text-gray-600 font-medium text-sm">
          <span>
            Question {currentQuestion + 1}/{filteredQuestions.length}
          </span>
          <span>
            Time: {Math.floor(timer / 60)}:
            {String(timer % 60).padStart(2, "0")}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          {question.question}
        </h2>

        {question.type === "imageMcq" && (
          <div className="grid gap-4 md:grid-cols-2">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              return (
                <div
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`flex items-center justify-center h-48 rounded-xl shadow-md cursor-pointer transition-transform overflow-hidden ${
                    isSelected
                      ? "scale-105 border-4 border-blue-500"
                      : "hover:scale-105"
                  }`}
                >
                  <img
                    src={option.imageUrl}
                    alt={`option-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}

        {question.type !== "imageMcq" && (
          <div className="grid gap-4 md:grid-cols-2">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              return (
                <div
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`flex items-center justify-center h-16 rounded-xl shadow-md cursor-pointer transition-transform ${
                    isSelected
                      ? "bg-blue-500 text-white scale-105"
                      : "bg-white hover:bg-blue-50"
                  }`}
                >
                  {option.text}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
