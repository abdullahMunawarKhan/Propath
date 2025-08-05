import React, { useState, useEffect } from 'react';
import questions from './questions';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';

const Quiz = ({ user }) => {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(300); // 5 mins
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDomains = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('domain')
        .eq('user_id', user.id)
        .single();

      if (data) {
        const userDomains = data.domain || [];
        const filtered = questions.filter(q => userDomains.includes(q.domain));
        setFilteredQuestions(filtered.slice(0, 10)); // max 10 questions
      }
    };

    fetchDomains();
  }, [user]);

  useEffect(() => {
    if (timer === 0) handleSubmit();
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (option) => {
    setAnswers(prev => [...prev, { question: filteredQuestions[currentQuestion].question, selected: option }]);
    setCurrentQuestion(prev => prev + 1);
  };

  const handleSubmit = async () => {
    const domainScores = {};

    filteredQuestions.forEach((q, i) => {
      const selected = answers[i]?.selected;
      if (selected === q.answer) {
        domainScores[q.domain] = (domainScores[q.domain] || 0) + 1;
      }
    });

    const feedback = Object.entries(domainScores).map(([domain, score]) => {
      let message = score >= 3 ? 'You seem confident in this domain.' : 'Consider exploring more.';
      return { domain, score, message };
    });

    await supabase.from('quiz_results').insert([
      {
        user_id: user.id,
        result: feedback,
        submitted_at: new Date(),
      },
    ]);

    navigate('/result');
  };

  if (filteredQuestions.length === 0) return (
    <div className="flex items-center justify-center h-screen text-center px-4">
      <p className="text-xl font-semibold text-gray-700">
        Loading quiz questions based on your selected domains...
      </p>
    </div>
  );

  if (currentQuestion >= filteredQuestions.length) {
    handleSubmit();
    return (
      <div className="flex items-center justify-center h-screen text-center px-4">
        <p className="text-xl font-semibold text-gray-700">Submitting your responses...</p>
      </div>
    );
  }

  const question = filteredQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 px-4 py-8 sm:px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <p>Question {currentQuestion + 1} of {filteredQuestions.length}</p>
          <p>Time Left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-6">{question.question}</h2>

        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="btn-gradient-purple text-base sm:text-lg"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
