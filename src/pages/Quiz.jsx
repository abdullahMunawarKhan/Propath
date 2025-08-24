import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import questions from '../data/questions';

const TOTAL_TIME = 300; // total quiz time in seconds (5 minutes)

const Quiz = ({ user }) => {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(TOTAL_TIME);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchDomainsAndPrepareQuestions = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('domain')
        .eq('user_id', user.id)
        .single();

      if (!data || error) return;

      const userDomains = data.domain || [];

      // Get domain questions based on user's selected domains
      const domainQuestions = questions.filter(q => userDomains.includes(q.domain));

      // Get 'common' domain questions
      const commonQuestions = questions.filter(q => q.domain === 'common');

      // Pick first 5 common questions
      const commonToInclude = commonQuestions.slice(0, 5);

      // Combine domain questions first, then common at end
      const combined = [...domainQuestions, ...commonToInclude];

      // Optionally limit total questions
      setFilteredQuestions(combined.slice(0, 15));
    };

    fetchDomainsAndPrepareQuestions();
  }, [user]);

  useEffect(() => {
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Submit when time runs out
    if (timer === 0 && filteredQuestions.length > 0 && currentQuestion < filteredQuestions.length) {
      handleSubmit();
    }
  }, [timer]);

  useEffect(() => {
    // Submit when last question answered
    if (currentQuestion >= filteredQuestions.length && filteredQuestions.length > 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, filteredQuestions]);

  const handleAnswer = (option) => {
    setSelectedOption(option);

    // Show selection briefly before advancing
    setTimeout(() => {
      setAnswers(prev => [...prev, { question: filteredQuestions[currentQuestion].question, selected: option }]);
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    }, 200);
  };

  const handleSubmit = async () => {
    const domainScores = {};
    let iqScore = 0;

    filteredQuestions.forEach((q, i) => {
      const selected = answers[i]?.selected;
      if (q.domain === 'common') {
        if (selected === q.answer) iqScore += 1;
      } else {
        if (selected === q.answer) {
          domainScores[q.domain] = (domainScores[q.domain] || 0) + 1;
        }
      }
    });

    const feedback = Object.entries(domainScores).map(([domain, score]) => {
      const message = score >= 3 ? 'You seem confident in this domain.' : 'Consider exploring more.';
      return { domain, score, message };
    });

    // Add common domain feedback with IQ score, separate from others
    feedback.push({
      domain: 'common',
      score: iqScore,
      message: 'IQ Section'
    });

    try {
      // Insert quiz result into quiz_results with expected columns
      const { error } = await supabase.from('quiz_results').insert([
        {
          user_id: user.id,
          feedback: feedback, // JSON column
          iq_score: iqScore,  // numeric column
          submitted_at: new Date(),
        },
      ]);

      if (error) {
        console.error('Insert quiz_results failed:', error);
        alert('Failed to submit quiz results. Please try again.');
        return;
      }

      navigate('/result');
    } catch (e) {
      console.error('Unexpected submit error:', e);
      alert('Failed to submit quiz results. Please try again.');
    }
  };

  if (filteredQuestions.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-screen text-center px-4"
        role="status"
        aria-live="polite"
      >
        <p className="text-xl font-semibold text-gray-700">
          Loading quiz questions based on your selected domains...
        </p>
      </div>
    );
  }

  if (currentQuestion >= filteredQuestions.length) {
    return (
      <div
        className="flex items-center justify-center h-screen text-center px-4"
        role="status"
        aria-live="polite"
      >
        <p className="text-xl font-semibold text-gray-700">Submitting your responses...</p>
      </div>
    );
  }

  const question = filteredQuestions[currentQuestion];

  // Calculate progress bar width percentage (100% down to 0%)
  const progressPercent = (timer / TOTAL_TIME) * 100;

  // Progress bar color: red if 10 seconds or less remain, else blue
  const progressBarColor = timer <= 10 ? 'bg-red-500' : 'bg-blue-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 px-4 py-8 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10">

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6 overflow-hidden" aria-hidden="true">
          <div
            className={`${progressBarColor} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-600" aria-live="polite">
          <p>Question {currentQuestion + 1} of {filteredQuestions.length}</p>
          <p>
            Time Left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-6">{question.question}</h2>

        <div className="grid gap-4" role="list">
          {question.options.map((option, index) => {
            const isSelected = option === selectedOption;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`text-base sm:text-lg px-4 py-3 rounded-lg shadow-md transition-transform focus:outline-none 
                  ${isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-white text-gray-900 hover:bg-pink-100'
                  }`}
                role="listitem"
                aria-label={`Answer option: ${option}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
