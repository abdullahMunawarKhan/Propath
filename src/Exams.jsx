import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { useNavigate } from 'react-router-dom';
import examData from './examData';

// ✅ Safely parse resource links
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
    <div className="min-h-screen p-6 bg-blue-50 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">🎓 Competitive Exams</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examData.map((exam) => (
          <div
            key={exam.name}
            className="bg-white shadow-md p-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            <h2 className="text-xl font-bold text-blue-800">{exam.name}</h2>
            <p><strong>Eligibility:</strong> {exam.eligibility}</p>
            <p><strong>Becomes:</strong> {exam.outcome}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => openModal(exam)}
                className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                More Info
              </button>

              <button
                onClick={() => handleSave(exam.name)}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Saved Exams */}
      <div className="mt-8 text-center">
        <button
          onClick={() => alert(`Saved Exams : ${savedExams.join(', ') || 'None'}`)}
          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          📌 View Saved Exams
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white max-w-md w-full max-h-[80vh] overflow-y-auto rounded-lg p-6 shadow-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <h2 className="text-xl font-bold mb-4">{selectedExam.name} – Details</h2>
            <p><strong>Eligibility:</strong> {selectedExam.eligibility}</p>
            <p><strong>Career Outcome:</strong> {selectedExam.outcome}</p>
            <p><strong>Pattern:</strong> {selectedExam.pattern}</p>
            <p><strong>Syllabus:</strong> {selectedExam.syllabus}</p>

            {/* ✅ Clickable Resources */}
            <div className="mt-2">
              <strong>Resources:</strong>
              <ul className="list-disc ml-6 mt-1">
                {parseResources(selectedExam.resources).map((link, index) => (
                  <li key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Resource {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
