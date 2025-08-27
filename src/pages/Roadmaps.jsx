import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import jsPDF from 'jspdf';
import { useChatbaseBot } from '../utils/useChatbaseBot';
import { generateRoadmap } from '../utils/geminiAPI';

const Roadmaps = () => {
  useChatbaseBot();

  const [selectedDomains, setSelectedDomains] = useState([]);
  const [roadmaps, setRoadmaps] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generatingDomains, setGeneratingDomains] = useState(new Set());

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
        // Convert domain names to uppercase for consistency
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
        const upperDomain = domain.toUpperCase(); // Ensure uppercase for query

        try {
          // First, try to get from Supabase roadmaps table
          const { data, error } = await supabase
            .from('roadmaps')
            .select('roadmap_steps')
            .eq('domain', upperDomain)
            .single();

          if (error || !data) {
            // Domain not found in database, generate with Google AI Studio API
            console.log(`Domain ${upperDomain} not found in database, generating with AI...`);

            // Set loading state for this specific domain
            setGeneratingDomains(prev => new Set(prev).add(upperDomain));

            try {
              // Generate roadmap using Gemini API
              const generatedSteps = await generateRoadmap(upperDomain);

              // Store the generated roadmap in Supabase for future use
              const { error: insertError } = await supabase
                .from('roadmaps')
                .upsert(
                  {
                    domain: upperDomain.toUpperCase(), // Ensure domain is uppercase
                    roadmap_steps: generatedSteps // Keep steps as provided by API
                  },
                  { onConflict: 'domain' } // Handle conflict on domain column
                );

              if (insertError) {
                console.error('Error storing roadmap in Supabase:', insertError);
              } else {
                console.log(`Successfully stored roadmap for ${upperDomain} in Supabase`);
              }

              // Update local state with generated steps
              roads[upperDomain] = generatedSteps;

            } catch (aiError) {
              console.error(`Error generating roadmap for ${upperDomain}:`, aiError);
              roads[upperDomain] = ["Unable to generate roadmap. Please try again later."];
            } finally {
              // Remove loading state for this domain
              setGeneratingDomains(prev => {
                const newSet = new Set(prev);
                newSet.delete(upperDomain);
                return newSet;
              });
            }
          } else {
            // Domain found in database, use cached data
            console.log(`Found cached roadmap for ${upperDomain}`);
            roads[upperDomain] = data.roadmap_steps || ["Not available"];
          }
        } catch (error) {
          console.error(`Error processing domain ${upperDomain}:`, error);
          roads[upperDomain] = ["Error loading roadmap"];
        }
      }

      setRoadmaps(roads);
      setLoading(false);
    })();
  }, [selectedDomains]);

  const handleSaveRoadmaps = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    // Ensure only domains are uppercase when saving
    const upperDomains = selectedDomains.map(d => d.toUpperCase());
    const roadmapPoints = {};

    upperDomains.forEach(domain => {
      roadmapPoints[domain] = roadmaps[domain] || [];
    });

    const { error } = await supabase
      .from('saved_roadmaps')
      .insert({
        user_id: userId,
        domains: upperDomains, // Uppercase domains
        roadmap_points: roadmapPoints, // Steps unchanged
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
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const bottomMargin = 20;

    selectedDomains.forEach((domain, idx) => {
      const upperDomain = domain.toUpperCase();
      doc.setFontSize(14);

      // Check if adding the domain title will exceed page height, add page if needed
      if (y + 10 > pageHeight - bottomMargin) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${idx + 1}. ${upperDomain}`, 14, y);
      y += 8;

      (roadmaps[upperDomain] || []).forEach((step) => {
        doc.setFontSize(12);

        // Check if adding the step will exceed page height, add page if needed
        if (y + 8 > pageHeight - bottomMargin) {
          doc.addPage();
          y = 20;
        }

        const splitText = doc.splitTextToSize(`- ${step}`, 180); // split long text lines for width ~180
        doc.text(splitText, 18, y);
        y += splitText.length * 6; // increment y by the number of lines * line height
      });
      y += 10;
    });

    doc.save('career_roadmaps.pdf');
  };


  if (loading && selectedDomains.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Career Roadmaps</h1>
        <p className="text-gray-600">AI-powered personalized career guidance</p>
      </div>

      {selectedDomains.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No domains selected</h2>
          <p className="text-gray-500">Please select your domains from your profile to view roadmaps.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {selectedDomains.map((domain) => {
            const upperDomain = domain.toUpperCase();
            const isGenerating = generatingDomains.has(upperDomain);
            const steps = roadmaps[upperDomain] || [];

            return (
              <div
                key={upperDomain}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">{upperDomain}</h3>
                  {isGenerating && (
                    <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                      <div className="animate-pulse mr-2">🤖</div>
                      AI Generating...
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {isGenerating ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                      <p className="text-gray-600 font-medium">Generating personalized roadmap...</p>
                      <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {steps.length === 0 || (steps.length === 1 && steps[0] === "Not available") ? (
                        <div className="text-center py-6">
                          <div className="text-gray-400 text-4xl mb-2">⚠️</div>
                          <p className="text-gray-500">No roadmap available</p>
                        </div>
                      ) : (
                        steps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 leading-relaxed">{step}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      {selectedDomains.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleSaveRoadmaps}
            disabled={loading || generatingDomains.size > 0}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${saved
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
              }`}
          >
            {saved ? '✅ Saved!' : 'Save Roadmaps'}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={loading || generatingDomains.size > 0}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
          >
            📄 Export PDF
          </button>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            Roadmaps saved successfully!
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && selectedDomains.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg font-semibold text-gray-700">Processing roadmaps...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmaps;