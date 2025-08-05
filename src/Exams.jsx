import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { useNavigate } from 'react-router-dom';
import examData from './examData';

const parseResources = (resourceString) => {
  if (!resourceString) return [];
  if (Array.isArray(resourceString)) return resourceString;
  return String(resourceString).split(',').map(link => link.trim());
};

const Exams = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [savedExams, setSavedExams] = useState([]);

  useEffect(() => {
    const fetchSavedExams = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data } = await supabase
        .from('saved_exams')
        .select('exam_name')
        .eq('user_id', userData.user.id);

      if (data) {
        setSavedExams(data.map((entry) => entry.exam_name));
      }
    };

    fetchSavedExams();
  }, []);

  const handleSave = async (examName) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    if (savedExams.includes(examName)) {
      alert('This exam is already saved!');
      return;
    }

    const { error } = await supabase
      .from('saved_exams')
      .insert({ user_id: userData.user.id, exam_name: examName });

    if (!error) {
      setSavedExams([...savedExams, examName]);
      alert('Exam saved successfully!');
    } else {
      console.error('Save error:', error);
    }
  };

  const openModal = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedExam(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 px-4 sm:px-6 lg:px-8 py-6 relative font-[LilitaOne] text-[#0D0D0D]">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-6 left-6 bg-[#34495e] hover:bg-[#2c3e50] text-white px-5 py-2 rounded-full shadow-md font-semibold text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Back to Dashboard"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-blue-900 mt-14 sm:mt-20">
        🎓 Competitive Exams
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {examData.map((exam) => (
          <div
            key={exam.name}
            className="bg-white shadow-md p-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition duration-300 flex flex-col justify-between"
            role="region"
            aria-labelledby={`exam-${exam.name.replace(/\s+/g, '-')}`}
            tabIndex={0}
          >
            <h2
              id={`exam-${exam.name.replace(/\s+/g, '-')}`}
              className="text-lg sm:text-xl font-bold text-blue-800 mb-2"
            >
              {exam.name}
            </h2>
            <p className="text-sm mb-1"><strong>Eligibility:</strong> {exam.eligibility}</p>
            <p className="text-sm mb-4"><strong>Becomes:</strong> {exam.outcome}</p>

            <div className="flex justify-between mt-auto">
              <button
                onClick={() => openModal(exam)}
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`More info about ${exam.name}`}
              >
                More Info
              </button>

              <button
                onClick={() => handleSave(exam.name)}
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label={`Save ${exam.name} exam`}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Saved Exams */}
      <div className="mt-10 text-center">
        <button
          onClick={() =>
            alert(`Saved Exams: ${savedExams.length > 0 ? savedExams.join(', ') : 'None'}`)
          }
          className="bg-yellow-500 text-white px-6 py-3 rounded-full shadow hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="View saved exams"
        >
          📌 View Saved Exams
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedExam && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exam-detail-title"
        >
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl relative scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <h2
              id="exam-detail-title"
              className="text-xl font-bold mb-4 text-center text-blue-900"
            >
              {selectedExam.name} – Details
            </h2>
            <p className="text-sm mb-2"><strong>Eligibility:</strong> {selectedExam.eligibility}</p>
            <p className="text-sm mb-2"><strong>Career Outcome:</strong> {selectedExam.outcome}</p>
            <p className="text-sm mb-2"><strong>Pattern:</strong> {selectedExam.pattern}</p>
            <p className="text-sm mb-4"><strong>Syllabus:</strong> {selectedExam.syllabus}</p>

            {/* Clickable Resource Links */}
            <div>
              <strong className="text-sm">Resources:</strong>
              <ul className="list-disc ml-6 mt-1 space-y-1">
                {parseResources(selectedExam.resources).map((link, index) => (
                  <li key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline text-sm hover:text-indigo-800"
                    >
                      Resource {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Close exam details modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
