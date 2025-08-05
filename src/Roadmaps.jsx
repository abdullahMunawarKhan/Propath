import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import roadmapData from './roadmapData';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useChatbaseBot } from './utils/useChatbaseBot';

const Roadmaps = () => {
  useChatbaseBot();
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDomains = async () => {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;

      const { data, error } = await supabase
        .from('students')
        .select('domain')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching domains:', error);
      } else {
        setSelectedDomains(data?.domain || []);
      }
    };

    fetchDomains();
  }, []);

  const handleSaveRoadmaps = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    const roadmapPoints = {};
    selectedDomains.forEach(domain => {
      roadmapPoints[domain] = roadmapData[domain] || [];
    });

    const { error } = await supabase.from('saved_roadmaps').insert({
      user_id: userId,
      domains: selectedDomains,
      roadmap_points: roadmapPoints,
    });

    if (error) {
      console.error('Error saving roadmap:', error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Career Roadmaps', 14, 20);

    let y = 30;
    selectedDomains.forEach((domain, idx) => {
      doc.setFontSize(14);
      doc.text(`${idx + 1}. ${domain}`, 14, y);
      y += 8;

      const steps = roadmapData[domain] || [];
      steps.forEach((step) => {
        doc.setFontSize(12);
        doc.text(`- ${step}`, 18, y);
        y += 6;
      });

      y += 10;
    });

    doc.save('career_roadmaps.pdf');
  };

  return (
    <div className="px-4 py-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-gray-700 text-white px-3 py-1.5 rounded hover:bg-gray-800 text-xs sm:text-sm shadow"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-indigo-700 mb-6 sm:mb-8">
          🎯 Your Career Roadmaps
        </h1>

        {selectedDomains.length === 0 ? (
          <p className="text-center text-gray-500 text-base sm:text-lg">
            Loading or no domains selected...
          </p>
        ) : (
          selectedDomains.map((domain) => (
            <div
              key={domain}
              className="mb-6 border-l-4 border-indigo-400 bg-indigo-50 rounded-md px-4 py-3 shadow-sm"
            >
              <h2 className="text-lg sm:text-2xl font-semibold text-indigo-700 mb-2">
                {domain}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm sm:text-base">
                {(roadmapData[domain] || []).map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          ))
        )}

        {/* Button Group - Responsive */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <button
            onClick={handleSaveRoadmaps}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            {saved ? '✅ Saved!' : '💾 Save Roadmaps'}
          </button>
          <button
            onClick={handleExportPDF}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            📄 Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
