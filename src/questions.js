const questions = [
  {
    id: 1,
    domain: 'Engineering',
    question: 'What does a resistor do in an electrical circuit?',
    options: ['Stores energy', 'Resists current flow', 'Amplifies signals', 'Converts current to voltage'],
    answer: 'Resists current flow',
  },
  {
    id: 2,
    domain: 'Medicine',
    question: 'Which organ is affected',
    options: ['Heart', 'Liver', 'Lungs', 'Kidney'],
    answer: 'Liver',
  },
  {
    id: 3,
    domain: 'Design',
    question: 'What is the principle of contrast in design?',
    options: ['Using similar elements', 'Using repetition', 'Using different elements to create emphasis', 'Using balance only'],
    answer: 'Using different elements to create emphasis',
  },
  {
    id:4,
    domain: 'Engineering',
    question:'What is first law of newton.',
    options: ['every actions has equal and opposite reaction','law of inertia','force =masss*acceleration','dont know'],
    answer:'law of inertia',
  },
   {
    id:5,
    domain:'common',
    question: '5+3=28,9+1=810, 8+6=214 then 7+3=?',
    options:['410','37',,'710','410'],
    answer:'410',
  },
  
  {
    id:8,
    domain:'common',
    question: "If A is the brother of B and B is the sister of C, then C is A's:",
    options:['brother','Sister','Brother or sister','Father'],
    answer:'Brother or Sister',
  },
  {
    id:6,
    domain:'common',
    question: 'If you face East and turn right, what direction are you facing now?',
    options:['North','South','West','South-west'],
    answer:'South',
  },
 
  {
    id:7,
    domain:'common',
    question: 'If CAT = DBU, then DOG = ?',
    options:['DPH','EPH','EOH','EPG'],
    answer:'EPH',
  },
  // {
  //   id:9,
  //   domain:'Engineering',
  //   question: ' ',
  //   options:[],
  //   answer:'',
  // },
  {
    id:10,
    domain:'common',
    question: 'A vehicle travels from point A to point B at a speed of 50 km/h and returns from B to A by another route which is 20% longer than the first. If the average speed for the whole journey is 40 km/h, find the speed of the vehicle on the return journey. ',
    options:['32 km/hr','35 km/hr','30km/hr','28 km/hr',],
    answer:'32 km/hr',
  },
  // {
  //   id:11,
  //   domain:["common"],
  //   question: ' ',
  //   options:[],
  //   answer:'',
  // },
  // {
  //   id:12,
  //   domain:["common"],
  //   question: ' ',
  //   options:[],
  //   answer:'',
  // },
{
    id: 9,
    domain: 'Digital Creator Economy',
    question: 'Which platform is primarily used for short-form video content by creators?',
    options: ['YouTube', 'Instagram', 'TikTok', 'Facebook'],
    answer: 'TikTok',
  },
  {
    id: 10,
    domain: 'Digital Creator Economy',
    question: 'What is considered a key metric in influencer marketing?',
    options: ['Likes', 'Shares', 'Engagement rate', 'Followers only'],
    answer: 'Engagement rate',
  },

  {
    id: 11,
    domain: 'Creative Media & Entertainment',
    question: 'Which of the following is a post-production activity in film?',
    options: ['Casting', 'Scripting', 'Editing', 'Location scouting'],
    answer: 'Editing',
  },
  {
    id: 12,
    domain: 'Creative Media & Entertainment',
    question: 'Which tool is widely used for video editing?',
    options: ['AutoCAD', 'Final Cut Pro', 'Canva', 'Photoshop'],
    answer: 'Final Cut Pro',
  },

  {
    id: 13,
    domain: 'Event & Experience Management',
    question: 'What is the first step in planning an event?',
    options: ['Catering', 'Venue booking', 'Goal setting', 'Lighting'],
    answer: 'Goal setting',
  },
  {
    id: 14,
    domain: 'Event & Experience Management',
    question: 'Which tool is commonly used for event ticketing?',
    options: ['Slack', 'Zoom', 'Eventbrite', 'Figma'],
    answer: 'Eventbrite',
  },

  {
    id: 15,
    domain: 'Sports & Fitness Career',
    question: 'Which certification is essential for personal trainers?',
    options: ['CPT', 'MBA', 'MD', 'CA'],
    answer: 'CPT',
  },
  {
    id: 16,
    domain: 'Sports & Fitness Career',
    question: 'Cardio training primarily improves what?',
    options: ['Flexibility', 'Muscular strength', 'Endurance', 'Balance'],
    answer: 'Endurance',
  },

  {
    id: 17,
    domain: 'Fashion & Luxury Industry',
    question: 'Which city is known as the fashion capital of the world?',
    options: ['New York', 'Paris', 'London', 'Tokyo'],
    answer: 'Paris',
  },
  {
    id: 18,
    domain: 'Fashion & Luxury Industry',
    question: 'What does haute couture mean?',
    options: ['Fast fashion', 'Ready to wear', 'High-end custom fashion', 'Vintage style'],
    answer: 'High-end custom fashion',
  },

  {
    id: 19,
    domain: 'Culinary Arts & Food Innovation',
    question: 'What is sous-vide cooking?',
    options: ['Grilling over flame', 'Deep frying', 'Cooking food in vacuum-sealed bags in water bath', 'Baking at high temp'],
    answer: 'Cooking food in vacuum-sealed bags in water bath',
  },
  {
    id: 20,
    domain: 'Culinary Arts & Food Innovation',
    question: 'Which cuisine is known for sushi?',
    options: ['Chinese', 'Thai', 'Japanese', 'Korean'],
    answer: 'Japanese',
  },

  {
    id: 21,
    domain: 'Travel & Tourism Careers',
    question: 'Which job involves planning travel for clients?',
    options: ['Pilot', 'Travel Agent', 'Chef', 'Hotel Manager'],
    answer: 'Travel Agent',
  },
  {
    id: 22,
    domain: 'Travel & Tourism Careers',
    question: 'Which of these is a UNESCO World Heritage site?',
    options: ['Eiffel Tower', 'Statue of Liberty', 'Great Wall of China', 'Hollywood Sign'],
    answer: 'Great Wall of China',
  },

  {
    id: 23,
    domain: 'Digital Marketing & Branding',
    question: 'Which is a key SEO factor?',
    options: ['Image size', 'Backlinks', 'Color scheme', 'Fonts used'],
    answer: 'Backlinks',
  },
  {
    id: 24,
    domain: 'Digital Marketing & Branding',
    question: 'What does PPC stand for?',
    options: ['Pay Per Click', 'Private Product Campaign', 'Post-Promotion Content', 'Paid Promotion Cost'],
    answer: 'Pay Per Click',
  },

  {
    id: 25,
    domain: 'Psychology & Coaching',
    question: 'What is cognitive behavioral therapy (CBT) mainly used for?',
    options: ['Dieting', 'Mental health treatment', 'Sports training', 'Public speaking'],
    answer: 'Mental health treatment',
  },
  {
    id: 26,
    domain: 'Psychology & Coaching',
    question: 'Which skill is crucial for a life coach?',
    options: ['Coding', 'Empathy', 'Drawing', 'Driving'],
    answer: 'Empathy',
  },

  {
    id: 27,
    domain: 'Finance & Investments',
    question: 'What is the stock market?',
    options: ['A place to buy goods', 'A banking system', 'A marketplace for buying and selling stocks', 'An insurance agency'],
    answer: 'A marketplace for buying and selling stocks',
  },
  {
    id: 28,
    domain: 'Finance & Investments',
    question: 'What does ROI stand for?',
    options: ['Rate of Inflation', 'Return on Investment', 'Record of Income', 'Revenue Over Investment'],
    answer: 'Return on Investment',
  },

  {
    id: 29,
    domain: 'Art, Design & Creativity',
    question: 'What is a common medium in digital art?',
    options: ['Chalk', 'Oil', 'Tablet and stylus', 'Clay'],
    answer: 'Tablet and stylus',
  },
  {
    id: 30,
    domain: 'Art, Design & Creativity',
    question: 'Which principle helps guide visual hierarchy?',
    options: ['Symmetry', 'Color theory', 'Contrast', 'Texture'],
    answer: 'Contrast',
  },

  {
    id: 31,
    domain: 'Entrepreneurship & Startups',
    question: 'What is a startup pitch?',
    options: ['Business report', 'Investor presentation', 'Code snippet', 'Resume'],
    answer: 'Investor presentation',
  },
  {
    id: 32,
    domain: 'Entrepreneurship & Startups',
    question: 'What is an MVP in startups?',
    options: ['Most Valuable Plan', 'Minimum Viable Product', 'Marketing Value Proposition', 'Major Venture Plan'],
    answer: 'Minimum Viable Product',
  },



{
  id: 33,
  domain: 'NDA',
  question: 'Which of the following is the longest bone in the human body?',
  options: ['Femur', 'Tibia', 'Humerus', 'Radius'],
  answer: 'Femur',
},
{
  id: 34,
  domain: 'NDA',
  question: 'Which planet is known as the Red Planet?',
  options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
  answer: 'Mars',
},
{
  id: 35,
  domain: 'NDA',
  question: 'What is the SI unit of force?',
  options: ['Joule', 'Pascal', 'Newton', 'Watt'],
  answer: 'Newton',
},

// Army
{
  id: 36,
  domain: 'Army',
  question: 'Who is the Supreme Commander of the Indian Armed Forces?',
  options: ['Chief of Army Staff', 'Prime Minister', 'President of India', 'Defense Minister'],
  answer: 'President of India',
},
{
  id: 37,
  domain: 'Army',
  question: 'The regimental motto of the Indian Army is:',
  options: ['Service Before Self', 'Bharat Mata ki Jai', 'Jai Jawan Jai Kisan', 'Duty, Honour, Courage'],
  answer: 'Service Before Self',
},
{
  id: 38,
  domain: 'Army',
  question: 'Which medal is awarded for gallantry during peacetime?',
  options: ['Param Vir Chakra', 'Ashoka Chakra', 'Vir Chakra', 'Shaurya Chakra'],
  answer: 'Ashoka Chakra',
},

// UPSC
{
  id: 39,
  domain: 'UPSC',
  question: 'Who was the first President of India?',
  options: ['Dr. B.R. Ambedkar', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad', 'Sardar Patel'],
  answer: 'Dr. Rajendra Prasad',
},
{
  id: 40,
  domain: 'UPSC',
  question: 'Which Article of the Constitution deals with Fundamental Rights?',
  options: ['Article 370', 'Article 14-32', 'Article 51A', 'Article 21A'],
  answer: 'Article 14-32',
},
{
  id: 41,
  domain: 'UPSC',
  question: 'The "Directive Principles of State Policy" are inspired from which country?',
  options: ['USA', 'Ireland', 'UK', 'Canada'],
  answer: 'Ireland',
},


];

export default questions;