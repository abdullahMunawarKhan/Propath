import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import questionsData from './questions';

const Quiz = ({ user }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [timer, setTimer] = useState(60);
  const [answers, setAnswers] = useState([]);
  const [commonCorrectCount, setCommonCorrectCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchDomainsAndQuestions = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('domain')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching domains:', error.message);
        return;
      }

      const selectedDomains = data?.domain || [];

      // FILTER: include if domain === 'common' or in selected domains
      const filteredQuestions = questionsData.filter(
        (q) => q.domain === 'common' || selectedDomains.includes(q.domain)
      );

      // RANDOMIZE ORDER
      const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    };

    fetchDomainsAndQuestions();
  }, [user]);

  useEffect(() => {
    if (timer <= 0) {
      handleNext(); // auto next
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleNext = async () => {
    if (!selectedOption) return;

    const currentQ = questions[currentIdx];
    const isCorrect = selectedOption === currentQ.answer;

    if (isCorrect && currentQ.domain === 'common') {
      setCommonCorrectCount((prev) => prev + 1);
    }

    setAnswers((prev) => [...prev, { domain: currentQ.domain, isCorrect }]);
    setSelectedOption('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTimer(60);
    } else {
      await finishQuiz({ isFinal: true, lastAnswer: { domain: currentQ.domain, isCorrect } });
    }
  };

  const finishQuiz = async ({ isFinal = false, lastAnswer = null }) => {
    const allAnswers = [...answers];
    let finalCommonCorrect = commonCorrectCount;

    if (isFinal && lastAnswer) {
      allAnswers.push(lastAnswer);
      if (lastAnswer.isCorrect && lastAnswer.domain === 'common') {
        finalCommonCorrect += 1;
      }
    }

    const domainFeedback = {};

    allAnswers.forEach((ans) => {
      if (ans.domain === 'common') return;

      if (!domainFeedback[ans.domain]) {
        domainFeedback[ans.domain] = { correct: 0, total: 0 };
      }
      domainFeedback[ans.domain].total += 1;
      if (ans.isCorrect) domainFeedback[ans.domain].correct += 1;
    });

    const feedback = {};
    for (const domain in domainFeedback) {
      const { correct, total } = domainFeedback[domain];
      const percent = (correct / total) * 100;

      if (percent >= 70) {
        feedback[domain] = 'Strong Interest and Understanding';
      } else if (percent >= 40) {
        feedback[domain] = 'Moderate Fit – Can Explore Further';
      } else {
        feedback[domain] = 'Needs Improvement or Less Interest';
      }
    }

    // SAVE TO Supabase
    const { error } = await supabase.from('quiz_results').insert({
      user_id: user.id,
      feedback,
      iq_score: finalCommonCorrect,
    });

    if (error) {
      console.error('Error saving quiz results:', error.message);
      return;
    }

    navigate('/result', { state: { feedback, iq_score: finalCommonCorrect } });
  };

  const handleLeaveQuiz = () => {
    if (!selectedOption) return;

    const currentQ = questions[currentIdx];
    const isCorrect = selectedOption === currentQ.answer;
    const lastAnswer = { domain: currentQ.domain, isCorrect };

    if (window.confirm('Quiz will auto submit. Are you sure you want to leave now?')) {
      finishQuiz({ isFinal: true, lastAnswer });
    }
  };

  if (!user) return <div className="text-center mt-10 text-lg">User not found.</div>;
  if (questions.length === 0) return <div className="text-center mt-10 text-lg">Loading quiz questions...</div>;

  const current = questions[currentIdx];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Question {currentIdx + 1} of {questions.length}
          </h2>
          <span className="text-sm font-mono text-red-600">⏱ {timer}s</span>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-1000"
            style={{ width: `${(timer / 30) * 100}% ` }}
          ></div>
        </div>

        {/* Question */}
        <h3 className="text-xl font-bold text-black mb-4">{current.question}</h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {current.options.map((option, idx) => (
            <label
              key={idx}
              className={`block text-black text-lg pl-2 py-3 border rounded-xl cursor-pointer transition duration-300 ${
                selectedOption === option
                  ? 'bg-blue-100 border-blue-500 text-blue-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <input
                type="radio"
                name="option"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
                className="mr-3"
              />
              {option}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={handleLeaveQuiz}
            className="w-full sm:w-1/2 bg-red-600 text-white py-2 px-4 rounded-xl font-semibold transition hover:bg-red-700"
          >
            Submit Now & Leave
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="w-full sm:w-1/2 bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold transition hover:bg-blue-700 disabled:opacity-50"
          >
            {currentIdx === questions.length - 1 ? 'Submit Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;