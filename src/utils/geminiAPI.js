import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateRoadmap = async (domain) => {
  try {
    const prompt = `Create a detailed career roadmap for ${domain} domain. 
    Provide 8-12 specific, actionable steps that someone should follow to build a career in ${domain}.
    Format each step as a clear, concise sentence.
    Focus on practical skills, learning resources, and career progression.
    
    Return only a JSON array of strings, like this example:
    ["Step 1: Learn fundamental concepts", "Step 2: Practice with projects", "Step 3: Build portfolio"]
    
    Make sure the response is valid JSON format.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to extract JSON array
    try {
      // Try to extract JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const stepsArray = JSON.parse(jsonMatch[0]);
        if (Array.isArray(stepsArray)) {
          return stepsArray;
        }
      }
      
      // Fallback: split by lines and clean
      const lines = text.split('\n')
        .filter(line => line.trim() && !line.includes('```'))
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
        .filter(line => line.length > 10);
      return lines.slice(0, 10); // Limit to 10 steps
      
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback parsing
      const lines = text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
        .filter(line => line.length > 10);
      return lines.slice(0, 8);
    }
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate roadmap');
  }
};

// Optional: Add rate limiting for API calls
export const generateRoadmapWithDelay = async (domain, delay = 1000) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return generateRoadmap(domain);
};