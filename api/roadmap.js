import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (update variable names as per your deployment environment)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, // or process.env.SUPABASE_URL
  process.env.VITE_SUPABASE_ANON_KEY // or process.env.SUPABASE_ANON_KEY
);

// Function to call OpenRouter API for roadmap generation
async function generateRoadmapFromOpenRouter(domain) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "openchat/openchat-3.5", // Choose a free, fast model  
      messages: [
        { role: "system", content: "You are an expert Indian career guide assistant." },
        { role: "user", content: `List 5 step-by-step roadmap points for building a successful career in the field: "${domain}". Reply as a plain numbered or bulleted list.` }
      ],
    }),
  });

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";

  // Parse lines to remove numbers/bullets and produce an array of steps
  const steps = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
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

    // 2. Otherwise generate roadmap from OpenRouter
    const aiRoadmap = await generateRoadmapFromOpenRouter(domain);

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


