import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// Replace with your deployed domain
const hostname = 'https://propathguider.vercel.app'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname,
      routes: [
        '/',                // Welcome
        '/login',           // Login
        '/signup',          // Signup
        '/student-info',    // Student Info Form
        '/dashboard',       // Dashboard
        '/quiz',            // Quiz
        '/explore',         // Explore
        '/result',          // Result
        '/roadmaps',        // Roadmaps
        '/exams',           // Exams
        '/update-password', // Update Password
      ],
    }),
  ],
})
