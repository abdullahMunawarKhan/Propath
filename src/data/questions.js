
// questions.js
// Career-interest quiz data + scoring + Gemini AI integration
// Make sure to set VITE_GEMINI_API_KEY in your .env file.

import { GoogleGenerativeAI } from "@google/generative-ai";

/* -----------------------------
   Utility: Shuffle helper
   ----------------------------- */
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* -----------------------------
   Quiz Data
   ----------------------------- */
const quiz = {
  mcq: shuffleArray([
    {
      id: 1,
      type: "mcq",
      question: "Which activity excites you the most?",
      options: [
        { text: "Designing or building new technology", domain: "Engineering" },
        { text: "Understanding how the human body works", domain: "Medicine" },
        { text: "Creating art, music, or writing", domain: "Art, Design & Creativity" },
        { text: "Solving puzzles or analyzing data", domain: "Science & Research" },
      ],
    },
    {
      id: 2,
      type: "mcq",
      question: "Which school subject do you enjoy the most?",
      options: [
        { text: "Mathematics or Physics", domain: "Engineering" },
        { text: "Biology or Chemistry", domain: "Medicine" },
        { text: "Literature or Fine Arts", domain: "Art, Design & Creativity" },
        { text: "Economics or Business Studies", domain: "Business & Management" },
      ],
    },
    {
      id: 3,
      type: "mcq",
      question: "What kind of problem-solving appeals to you most?",
      options: [
        { text: "Building a bridge or machine", domain: "Engineering" },
        { text: "Finding a cure for a disease", domain: "Medicine" },
        { text: "Innovating new business strategies", domain: "Business & Management" },
        { text: "Developing sustainable solutions for society", domain: "Social Sciences" },
      ],
    },
    {
      id: 4,
      type: "mcq",
      question: "If given free time, what would you prefer?",
      options: [
        { text: "Coding or experimenting with technology", domain: "Computer Science & IT" },
        { text: "Helping people with health or lifestyle", domain: "Medicine" },
        { text: "Writing, painting, or designing", domain: "Art, Design & Creativity" },
        { text: "Learning about global cultures and history", domain: "Social Sciences" },
      ],
    },
    {
      id: 5,
      type: "mcq",
      question: "What motivates you the most?",
      options: [
        { text: "Inventing or innovating new things", domain: "Engineering" },
        { text: "Making people’s lives healthier", domain: "Medicine" },
        { text: "Expressing myself creatively", domain: "Art, Design & Creativity" },
        { text: "Solving mysteries of the universe", domain: "Science & Research" },
      ],
    },
    {
      id: 6,
      type: "mcq",
      question: "Which career sounds most appealing?",
      options: [
        { text: "Software Developer or Engineer", domain: "Computer Science & IT" },
        { text: "Doctor or Surgeon", domain: "Medicine" },
        { text: "Entrepreneur or Manager", domain: "Business & Management" },
        { text: "Researcher or Scientist", domain: "Science & Research" },
      ],
    },
    {
      id: 7,
      type: "mcq",
      question: "What type of environment do you prefer working in?",
      options: [
        { text: "Laboratories or high-tech facilities", domain: "Science & Research" },
        { text: "Hospitals or healthcare centers", domain: "Medicine" },
        { text: "Studios or creative spaces", domain: "Art, Design & Creativity" },
        { text: "Corporate offices or startups", domain: "Business & Management" },
      ],
    },

    {
      id: 8,
      type: "mcq",
      question: "What’s your biggest strength?",
      options: [
        { text: "Logical thinking and problem-solving", domain: "Engineering" },
        { text: "Empathy and care for others", domain: "Medicine" },
        { text: "Creativity and imagination", domain: "Art, Design & Creativity" },
        { text: "Leadership and communication", domain: "Business & Management" },
      ],
    },
    {
      id: 9,
      type: "mcq",
      question: "Which activity would you enjoy the most?",
      options: [
        { text: "Designing a mobile app", domain: "Computer Science & IT" },
        { text: "Treating a patient", domain: "Medicine" },
        { text: "Launching a business", domain: "Business & Management" },
        { text: "Writing a book", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 10,
      type: "mcq",
      question: "What inspires you most?",
      options: [
        { text: "Technological advancements", domain: "Engineering" },
        { text: "Healthcare innovations", domain: "Medicine" },
        { text: "Artistic masterpieces", domain: "Art, Design & Creativity" },
        { text: "Scientific discoveries", domain: "Science & Research" },
      ],
    },
  ]),

  imageMcq: shuffleArray([
    {
      id: 11,
      type: "imageMcq",
      question: "Which picture appeals to you most?",
      options: [
        { imageUrl: "public/images/image1.jpg", domain: "Computer Science & IT" },
        { imageUrl: "", domain: "Medicine" },
        { imageUrl: "", domain: "Business & Management" },
        { imageUrl: "https://source.unsplash.com/featured/?artist", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 12,
      type: "imageMcq",
      question: "Which of these environments excites you most?",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?laboratory", domain: "Science & Research" },
        { imageUrl: "https://source.unsplash.com/featured/?hospital", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?startup", domain: "Business & Management" },
        { imageUrl: "https://source.unsplash.com/featured/?studio", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 13,
      type: "imageMcq",
      question: "Which project would you love to work on?",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?robotics", domain: "Engineering" },
        { imageUrl: "https://source.unsplash.com/featured/?surgery", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?design", domain: "Art, Design & Creativity" },
        { imageUrl: "https://source.unsplash.com/featured/?data", domain: "Science & Research" },
      ],
    },
    {
      id: 14,
      type: "imageMcq",
      question: "Which workspace feels best for you?",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?office", domain: "Business & Management" },
        { imageUrl: "https://source.unsplash.com/featured/?lab", domain: "Science & Research" },
        { imageUrl: "https://source.unsplash.com/featured/?coding", domain: "Computer Science & IT" },
        { imageUrl: "https://source.unsplash.com/featured/?artstudio", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 15,
      type: "imageMcq",
      question: "Pick the picture that excites you the most:",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?bridge", domain: "Engineering" },
        { imageUrl: "https://source.unsplash.com/featured/?research", domain: "Science & Research" },
        { imageUrl: "https://source.unsplash.com/featured/?hospital", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?gallery", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 16,
      type: "imageMcq",
      question: "Which innovation attracts you most?",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?ai", domain: "Computer Science & IT" },
        { imageUrl: "https://source.unsplash.com/featured/?pharmacy", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?finance", domain: "Business & Management" },
        { imageUrl: "https://source.unsplash.com/featured/?painting", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 17,
      type: "imageMcq",
      question: "Which lifestyle inspires you most?",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?engineer", domain: "Engineering" },
        { imageUrl: "https://source.unsplash.com/featured/?scientist", domain: "Science & Research" },
        { imageUrl: "https://source.unsplash.com/featured/?doctor", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?artist", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 18,
      type: "imageMcq",
      question: "What kind of success looks best to you?",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?award", domain: "Art, Design & Creativity" },
        { imageUrl: "https://source.unsplash.com/featured/?innovation", domain: "Engineering" },
        { imageUrl: "https://source.unsplash.com/featured/?healing", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?startup", domain: "Business & Management" },
      ],
    },
    {
      id: 19,
      type: "imageMcq",
      question: "Choose the field you connect with most:",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?technology", domain: "Computer Science & IT" },
        { imageUrl: "https://source.unsplash.com/featured/?biology", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?economy", domain: "Business & Management" },
        { imageUrl: "https://source.unsplash.com/featured/?creativity", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 20,
      type: "imageMcq",
      question: "Which achievement excites you most?",
      options: [
        { imageUrl: "https://source.unsplash.com/featured/?software", domain: "Computer Science & IT" },
        { imageUrl: "https://source.unsplash.com/featured/?cure", domain: "Medicine" },
        { imageUrl: "https://source.unsplash.com/featured/?startupsuccess", domain: "Business & Management" },
        { imageUrl: "https://source.unsplash.com/featured/?artwork", domain: "Art, Design & Creativity" },
      ],
    },
  ]),

  mixed: shuffleArray([
    {
      id: 21,
      type: "mixed",
      question: "Which would you rather do?",
      options: [
        { text: "Code a new app", domain: "Computer Science & IT" },
        { text: "Perform surgery", domain: "Medicine" },
        { text: "Launch a startup", domain: "Business & Management" },
        { text: "Paint a masterpiece", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 22,
      type: "mixed",
      question: "What motivates you most?",
      options: [
        { text: "Solving complex equations", domain: "Engineering" },
        { text: "Helping sick people recover", domain: "Medicine" },
        { text: "Leading a team to success", domain: "Business & Management" },
        { text: "Expressing yourself through art", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 23,
      type: "mixed",
      question: "Pick your dream recognition:",
      options: [
        { text: "Patent for innovation", domain: "Engineering" },
        { text: "Medical award", domain: "Medicine" },
        { text: "Business excellence award", domain: "Business & Management" },
        { text: "Art exhibition success", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 24,
      type: "mixed",
      question: "What excites you more?",
      options: [
        { text: "Writing complex code", domain: "Computer Science & IT" },
        { text: "Discovering new medicines", domain: "Medicine" },
        { text: "Managing organizations", domain: "Business & Management" },
        { text: "Designing creative work", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 25,
      type: "mixed",
      question: "What inspires you most?",
      options: [
        { text: "Space exploration", domain: "Science & Research" },
        { text: "Healthcare innovations", domain: "Medicine" },
        { text: "Entrepreneurial journeys", domain: "Business & Management" },
        { text: "Artistic creativity", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 26,
      type: "mixed",
      question: "What would you enjoy doing?",
      options: [
        { text: "Building machines", domain: "Engineering" },
        { text: "Discovering new treatments", domain: "Medicine" },
        { text: "Starting a new company", domain: "Business & Management" },
        { text: "Writing poetry", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 27,
      type: "mixed",
      question: "Which project excites you most?",
      options: [
        { text: "AI-powered robots", domain: "Computer Science & IT" },
        { text: "Developing vaccines", domain: "Medicine" },
        { text: "Launching e-commerce", domain: "Business & Management" },
        { text: "Making films", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 28,
      type: "mixed",
      question: "What skill defines you best?",
      options: [
        { text: "Logical thinking", domain: "Engineering" },
        { text: "Compassion", domain: "Medicine" },
        { text: "Leadership", domain: "Business & Management" },
        { text: "Creativity", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 29,
      type: "mixed",
      question: "Which success looks best?",
      options: [
        { text: "Inventing a device", domain: "Engineering" },
        { text: "Curing patients", domain: "Medicine" },
        { text: "Growing a company", domain: "Business & Management" },
        { text: "Publishing a book", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 30,
      type: "mixed",
      question: "What’s your passion?",
      options: [
        { text: "Technology", domain: "Computer Science & IT" },
        { text: "Healthcare", domain: "Medicine" },
        { text: "Entrepreneurship", domain: "Business & Management" },
        { text: "Art", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 31,
      type: "mixed",
      question: "Pick your future dream:",
      options: [
        { text: "Inventing AI", domain: "Computer Science & IT" },
        { text: "Finding cures", domain: "Medicine" },
        { text: "Running a company", domain: "Business & Management" },
        { text: "Creating art", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 32,
      type: "mixed",
      question: "What makes you feel proud?",
      options: [
        { text: "Designing solutions", domain: "Engineering" },
        { text: "Saving lives", domain: "Medicine" },
        { text: "Leading teams", domain: "Business & Management" },
        { text: "Artistic achievements", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 33,
      type: "mixed",
      question: "What’s your dream workplace?",
      options: [
        { text: "Tech company", domain: "Computer Science & IT" },
        { text: "Hospital", domain: "Medicine" },
        { text: "Corporate office", domain: "Business & Management" },
        { text: "Art studio", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 34,
      type: "mixed",
      question: "What challenges you most?",
      options: [
        { text: "Building structures", domain: "Engineering" },
        { text: "Diagnosing diseases", domain: "Medicine" },
        { text: "Managing businesses", domain: "Business & Management" },
        { text: "Expressing art", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 35,
      type: "mixed",
      question: "What inspires your work?",
      options: [
        { text: "Innovation", domain: "Engineering" },
        { text: "Compassion", domain: "Medicine" },
        { text: "Leadership", domain: "Business & Management" },
        { text: "Creativity", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 36,
      type: "mixed",
      question: "Which global impact appeals to you?",
      options: [
        { text: "Building infrastructure", domain: "Engineering" },
        { text: "Improving healthcare", domain: "Medicine" },
        { text: "Growing economy", domain: "Business & Management" },
        { text: "Promoting culture", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 37,
      type: "mixed",
      question: "Which success inspires you?",
      options: [
        { text: "Tech innovations", domain: "Computer Science & IT" },
        { text: "Medical breakthroughs", domain: "Medicine" },
        { text: "Business empires", domain: "Business & Management" },
        { text: "Art masterpieces", domain: "Art, Design & Creativity" },
      ],
    },
    {
      id: 38,
      type: "mixed",
      question: "What kind of work excites you?",
      options: [
        { text: "Engineering solutions", domain: "Engineering" },
        { text: "Healthcare services", domain: "Medicine" },
        { text: "Business growth", domain: "Business & Management" },
        { text: "Art creation", domain: "Art, Design & Creativity" },
      ],
    },
  ]),
};

/* -----------------------------
   Score calculation
   ----------------------------- */
// In ../data/questions.js

export function calculateScores(userAnswers = []) {
  const counts = {};
  userAnswers.forEach(ans => {
    if (!ans || !ans.domain) return;
    counts[ans.domain] = (counts[ans.domain] || 0) + 1;
  });

  // Sort domains by score descending, take top three
  const topThree = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([domain]) => domain);

  return topThree;
}


/* -----------------------------
   Build AI Prompt
   ----------------------------- */
export function buildCareerPrompt(scores) {
  return `You are a friendly career guidance assistant.

A user completed a career-interest quiz. Here are their domain scores:
${JSON.stringify(scores, null, 2)}

1) Identify the top 2 recommended career domains for this user (ranked).
2) For each domain, give a short motivational explanation (2-3 sentences) why it fits.
3) For each domain, list 3 specific career paths or job roles they can explore.
4) For each domain, suggest 3 concrete next steps (courses, skills, or first projects) the user can take in the next 3 months.

Keep the tone encouraging, practical, and concise.`;
}

/* -----------------------------
   Gemini AI Integration
   ----------------------------- */
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_REACT_APP_GEMINI_API_KEY
);

export async function getCareerGuidance(scores) {
  if (!import.meta.env.VITE_REACT_APP_GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY not set in environment.");
  }

  const prompt = buildCareerPrompt(scores);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/* -----------------------------
   Export quiz
   ----------------------------- */
export default quiz;
