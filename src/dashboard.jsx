import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import { useChatbaseBot } from './utils/useChatbaseBot';
import './styles.css';

const Dashboard = () => {
  useChatbaseBot();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        navigate('/login');
        return;
      }

      const userId = userData.user.id;
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('name, class_level, stream, domain')
        .eq('user_id', userId)
        .single();

      if (studentError) {
        console.error('Error fetching student info:', studentError.message);
      } else {
        setStudent(studentData);
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600" role="status" aria-live="polite">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[95%] sm:max-w-2xl mx-auto mt-6 px-4 py-6 bg-white shadow-md rounded-lg relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-md text-sm shadow hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600"
        style={{ fontFamily: "'Nova Round', cursive" }}
        aria-label="Logout"
      >
        Logout
      </button>

      {/* Welcome */}
    {/* Welcome Section */}
    <h1
      className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-tight"
      style={{ fontFamily: "'Nova Round', cursive" }}
    >
    Welcome,&nbsp;
      <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-500">
        {student?.name}
      <span className="absolute -bottom-1 left-0 right-0 h-1 bg-pink-400 rounded-full blur-sm opacity-70"></span>
      </span>
    </h1>


      {/* Profile Section */}
      <div className="p-[2px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6">
        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-inner">
          <h2 className="text-lg font-semibold mb-2">👤 Your Profile:</h2>
          <p><strong>Name:</strong> {student?.name}</p>
          <p><strong>Class Level:</strong> {student?.class_level}</p>
          <p><strong>Stream:</strong> {student?.stream || 'N/A'}</p>
          <p><strong>Domains:</strong> {student?.domain?.length ? student.domain.join(', ') : 'None selected'}</p>

          <button
            onClick={() => navigate('/student-info')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md text-sm shadow hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            style={{ fontFamily: "'Nova Round', cursive" }}
          >
            Edit Info
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center text-base">
        <button
          onClick={() => setShowQuizModal(true)}
          className="bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb] text-black py-3 px-4 rounded-full shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400"
          aria-haspopup="dialog"
        >
          📝 Take Quiz
        </button>
        <button
          onClick={() => navigate('/Explore')}
          className="bg-gradient-to-r from-[#89f7fe] to-[#66a6ff] text-black py-3 px-4 rounded-full shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          🔍 Explore Domains
        </button>
        <button
          onClick={() => navigate('/Roadmaps')}
          className="bg-gradient-to-r from-[#c2e9fb] to-[#a1c4fd] text-black py-3 px-4 rounded-full shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        >
          🗺 Career Roadmaps
        </button>
        <button
          onClick={() => navigate('/exams')}
          className="bg-gradient-to-r from-[#fccb90] to-[#d57eeb] text-black py-3 px-4 rounded-full shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
        >
          🏛 Competitive Exams
        </button>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-dialog-title"
        >
          <div className="relative bg-white w-full max-w-lg p-6 rounded-lg shadow-lg animate-fade-in-down">
            <button
              onClick={() => setShowQuizModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              aria-label="Close quiz instructions"
            >
              &times;
            </button>

            <h2
              id="quiz-dialog-title"
              className="text-xl sm:text-2xl font-bold text-center text-blue-700 mb-4"
            >
              Quiz Instructions
            </h2>

            <ul className="list-disc text-[16px] sm:text-[18px] text-gray-800 space-y-2 mb-6 ml-4 sm:ml-6">
              <li>The quiz is domain-based and tailored to your interests.</li>
              <li>Includes subject and general reasoning questions.</li>
              <li>No going back—each answer must be final.</li>
              <li>Your results build personalized roadmaps.</li>
            </ul>

            <div className="flex justify-center">
              <button
                onClick={() => navigate('/Quiz')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded shadow hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
