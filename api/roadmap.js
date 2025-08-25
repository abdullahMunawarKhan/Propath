import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (update variable names as per your deployment environment)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, // or process.env.SUPABASE_URL
  process.env.VITE_SUPABASE_ANON_KEY // or process.env.SUPABASE_ANON_KEY
);

// Function to call Gemini API for roadmap generation
async function generateRoadmapFromGemini(domain) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: `List 5 step-by-step career roadmap points for the domain "${domain}". Reply as a plain numbered or bulleted list.`
          }]
        }]
      })
    }
  );
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Parse steps as array, remove numbers/bullets
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, ''));
}


export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: 'Missing domain parameter' });

  try {
    // 1. Check if roadmap already in Supabase DB
    const { data, error } = await supabase
      .from('roadmaps')
      .select('roadmap_steps')
      .eq('domain', domain)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Unexpected DB error
      return res.status(500).json({ error: error.message });
    }

    if (data) {
      // Existing roadmap found - return it
      return res.status(200).json({ roadmap: data.roadmap_steps });
    }


    // const aiRoadmap = await generateRoadmapFromPerplexity(domain);
    const aiRoadmap = await generateRoadmapFromGemini(domain);


    // 3. Store generated roadmap in Supabase for caching
    const { error: insertError } = await supabase
      .from('roadmaps')
      .insert({ domain, roadmap_steps: aiRoadmap });

    if (insertError) {
      console.error('Error saving generated roadmap:', insertError.message);
      // Don't block user; continue with response
    }

    return res.status(200).json({ roadmap: aiRoadmap });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


