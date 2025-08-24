import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with secret keys from environment (server-side only)
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Function to call Perplexity API for roadmap generation (replace with actual Perplexity API details)
async function generateRoadmapFromPerplexity(domain) {
  // Example Perplexity API call - adjust as per official docs
  const response = await fetch('https://api.perplexity.ai/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,  
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `Provide a detailed, step-by-step career roadmap for the domain "${domain}".`,
    }),
  });

  const data = await response.json();
  const answer = data.answer || "";

  // Parse response text into steps array (simple split by lines, trim and remove numbering)
  const steps = answer
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/^\d+\.?\s*/, '').replace(/^[-*]\s*/, ''));

  return steps;
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

    // 2. Otherwise generate roadmap from Perplexity API
    const aiRoadmap = await generateRoadmapFromPerplexity(domain);

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
