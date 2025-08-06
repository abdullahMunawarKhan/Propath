import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useChatbaseBot } from './utils/useChatbaseBot';

const Result = () => {
  useChatbaseBot();
  const [feedback, setFeedback] = useState(null);
  const [iqScore, setIqScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;

      if (!userId || sessionError) {
        console.error('User not authenticated', sessionError);
        setLoading(false);
        return;
      }

      // Fetch latest quiz results
      const { data, error } = await supabase
        .from('quiz_results')
        .select('result')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      } else {
        const latest = data?.[0];
        const result = latest?.result || [];

        // Extract 'common' domain score for IQ calculation
        const commonEntry = result.find(r => r.domain === 'common');
        const commonScore = commonEntry ? commonEntry.score : 0;
        setIqScore(commonScore);

        setFeedback(result);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleSaveResult = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    const userId = sessionData?.user?.id;

    if (!userId || sessionError || !feedback) {
      setSaveStatus('Failed to save result. Try again.');
      return;
    }

    const { error } = await supabase.from('quiz_results').insert({
      user_id: userId,
      result: feedback,
      iq_score: iqScore,
      submitted_at: new Date(),
    });

    if (error) {
      console.error('Error saving result:', error.message);
      setSaveStatus('Failed to save result.');
    } else {
      setSaveStatus('Result saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const renderIqMessage = () => {
    if (iqScore === 5) {
      return (
        <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-6 text-center text-base sm:text-lg font-semibold shadow-sm border border-green-300">
          🧠 Excellent IQ! Outstanding performance in common questions.
        </div>
      );
    }
    if (iqScore >= 3) {
      return (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg mb-6 text-center text-base sm:text-lg font-semibold shadow-sm border border-yellow-300">
          🙂 Good IQ! Solid performance in common questions.
        </div>
      );
    }
    if (iqScore >= 0) {
      return (
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-6 text-center text-base sm:text-lg font-semibold shadow-sm border border-red-300">
          ⚠️ Need to improve IQ. Keep practicing your skills.
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 sm:py-12 relative font-[LilitaOne] text-[#0D0D0D]">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-5 left-5 bg-[#34495e] hover:bg-[#2c3e50] text-white px-5 py-2 rounded-full shadow-lg font-semibold text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Back to Dashboard"
      >
        ← Back
      </button>

      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10 mt-16 sm:mt-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
          🎯 Your Career Domain Feedback
        </h1>

        {loading ? (
          <div
            className="text-center text-blue-500 animate-pulse text-base sm:text-lg"
            role="status"
            aria-live="polite"
          >
            Loading your feedback...
          </div>
        ) : (
          <>
            {renderIqMessage()}

            {feedback && feedback.length > 0 ? (
              <ul className="space-y-4 sm:space-y-5">
                {feedback
                  .filter(({ domain }) => domain !== 'common')
                  .map(({ domain, message }) => (
                    <li
                      key={domain}
                      className="p-4 sm:p-5 rounded-xl shadow-sm border border-blue-100 bg-blue-50 hover:bg-blue-100 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                        <span className="text-base sm:text-lg font-semibold text-blue-800">
                          {domain}
                        </span>
                        <span
                          className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${
                            message.includes('confident')
                              ? 'bg-green-200 text-green-800'
                              : message.includes('exploring')
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {message}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 text-base sm:text-lg">
                No feedback available yet.
              </p>
            )}
          </>
        )}

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleSaveResult}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-xl transition text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save Result
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-xl transition text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {saveStatus && (
          <div
            className="text-center mt-4 text-green-700 font-medium text-sm sm:text-base"
            role="alert"
          >
            {saveStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
