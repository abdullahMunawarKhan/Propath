import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import jsPDF from 'jspdf';
import { useChatbaseBot } from '../utils/useChatbaseBot';

const Roadmaps = () => {
  useChatbaseBot();
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [roadmaps, setRoadmaps] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;
      const { data, error } = await supabase
        .from('students')
        .select('domain')
        .eq('user_id', userId)
        .single();
      if (!error && data?.domain) {
        // only convert domain names to uppercase
        setSelectedDomains(data.domain.map(d => d.toUpperCase()));
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (selectedDomains.length === 0) return;

    (async () => {
      setLoading(true);
      const roads = {};

      for (const domain of selectedDomains) {
        const upperDomain = domain.toUpperCase(); // ensure uppercase for query
        const { data, error } = await supabase
          .from('roadmaps')
          .select('roadmap_steps')
          .eq('domain', upperDomain)
          .single();

        if (error || !data) {
          roads[upperDomain] = ["Not available"];
        } else {
          // keep roadmap steps as they are
          roads[upperDomain] = data.roadmap_steps || ["Not available"];
        }
      }

      setRoadmaps(roads);
      setLoading(false);
    })();
  }, [selectedDomains]);

  const handleSaveRoadmaps = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    // ensure only domains are uppercase when saving
    const upperDomains = selectedDomains.map(d => d.toUpperCase());
    const roadmapPoints = {};
    upperDomains.forEach(domain => {
      roadmapPoints[domain] = roadmaps[domain] || [];
    });

    const { error } = await supabase.from('saved_roadmaps').insert({
      user_id: userId,
      domains: upperDomains, // uppercase domains
      roadmap_points: roadmapPoints, // steps unchanged
    });

    if (!error) {
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
      const upperDomain = domain.toUpperCase();
      doc.setFontSize(14);
      doc.text(`${idx + 1}. ${upperDomain}`, 14, y);
      y += 8;

      // roadmap steps remain original case
      (roadmaps[upperDomain] || []).forEach((step) => {
        doc.setFontSize(12);
        doc.text(`- ${step}`, 18, y);
        y += 6;
      });

      y += 10;
    });

    doc.save('career_roadmaps.pdf');
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-gray-50 rounded-xl shadow-sm">
      <h2 className="text-center text-2xl font-bold mb-8 text-gray-800">
        Your Selected Career Roadmaps
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 my-10">Loading...</div>
      ) : selectedDomains.length === 0 ? (
        <div className="text-center text-gray-500 my-10">
          No career domains selected yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedDomains.map((domain) => {
            const upperDomain = domain.toUpperCase();
            return (
              <div
                key={upperDomain}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-purple-700 mb-3">
                  {upperDomain}
                </h3>
                <ol className="list-decimal pl-5 text-gray-700 space-y-2">
                  {(roadmaps[upperDomain] || []).map((step, i) => (
                    <li
                      key={i}
                      className={step === "Not available" ? "text-gray-400 italic" : ""}
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={handleSaveRoadmaps}
          disabled={selectedDomains.length === 0 || loading}
          className="px-6 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Save Roadmaps
        </button>
        <button
          onClick={handleExportPDF}
          disabled={selectedDomains.length === 0 || loading}
          className="px-6 py-2 rounded-md border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Export PDF
        </button>
      </div>

      {saved && (
        <div className="mt-6 text-center text-green-600 font-semibold">
          Roadmaps saved successfully!
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
