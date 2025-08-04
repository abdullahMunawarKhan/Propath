import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import { useChatbaseBot } from './utils/useChatbaseBot';
import './styles.css'; // Ensure you apply Lilita or remove if unused

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
        navigate('/Login');
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
      navigate('/Login');
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600" style={{ fontFamily: 'sans-serif' }}>Loading your dashboard...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg relative" style={{ fontFamily: 'sans-serif' }}>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-md shadow hover:scale-105 transition"
        style={{ fontFamily: "'Nova Round', cursive" }}
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800" style={{ fontFamily: "'Nova Round', cursive" }}>
        Welcome,&nbsp;
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {student?.name}
        </span>
      </h1>

      {/* Profile Box */}
      <div className="p-[3px] rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-inner" style={{ fontFamily: 'sans-serif' }}>
          <h2 className="text-lg font-semibold mb-2">👤 Your Profile:</h2>
          <p><strong>Name:</strong> {student?.name}</p>
          <p><strong>Class Level:</strong> {student?.class_level}</p>
          <p><strong>Stream:</strong> {student?.stream}</p>
          <p><strong>Domains:</strong> {student?.domain?.join(', ') || 'None selected'}</p>

          <button
            onClick={() => navigate('/student-info')}
            className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md shadow hover:scale-105 transition"
            style={{ fontFamily: "'Nova Round', cursive" }}
          >
            Edit Info
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center text-lg">
        <button
          onClick={() => setShowQuizModal(true)}
          className="bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb] text-black py-3 px-6 rounded-full shadow-md hover:scale-105 transition"
          style={{ fontFamily: "'Nova Round', cursive" }}
        >
          📝 Take Quiz
        </button>

        <button
          onClick={() => navigate('/Explore')}
          className="bg-gradient-to-r from-[#89f7fe] to-[#66a6ff] text-black py-3 px-6 rounded-full shadow-md hover:scale-105 transition"
          style={{ fontFamily: "'Nova Round', cursive" }}
        >
          🔍 Explore Domains
        </button>

        <button
          onClick={() => navigate('/Roadmaps')}
          className="bg-gradient-to-r from-[#c2e9fb] to-[#a1c4fd] text-black py-3 px-6 rounded-full shadow-md hover:scale-105 transition"
          style={{ fontFamily: "'Nova Round', cursive" }}
        >
          🗺 Career Roadmaps
        </button>

        <button
          onClick={() => navigate('/exams')}
          className="bg-gradient-to-r from-[#fccb90] to-[#d57eeb] text-black py-3 px-6 rounded-full shadow-md hover:scale-105 transition"
          style={{ fontFamily: "'Nova Round', cursive" }}
        >
          🏛 Competitive Exams
        </button>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white w-full max-w-lg p-6 rounded-lg shadow-lg animate-fade-in-down">
            <button
              onClick={() => setShowQuizModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4" style={{ fontFamily: 'sans-serif' }}>Quiz Instructions</h2>

            <ul className="list-disc list-outside text-gray-800 text-[20px] space-y-2 mb-6 ml-6" style={{ fontFamily: 'sans-serif' }}>
              <li>The quiz is domain-based and tailored to your selected interests.</li>
              <li>Includes both subject-based and general reasoning questions.</li>
              <li>No going back—each answer must be final within the timer limit.</li>
              <li>Your result helps build personalized roadmaps and career paths.</li>
            </ul>

            <div className="flex justify-center">
              <button
                onClick={() => navigate('/Quiz')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded shadow hover:scale-105 transition"
                style={{ fontFamily: "'Nova Round', cursive" }}
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
