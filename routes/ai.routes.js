// portfolio-backend/routes/ai.routes.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// Initialize the Gemini API with your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── POST /api/ai/polish (The Magic Polish Button) ───
router.post('/polish', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Please write some text to polish first.' });
    }

    // 1. Choose the model (gemini-2.5-flash is extremely fast and perfect for text tasks)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Define the exact instructions for the AI
    const prompt = `
      You are an expert technical writer and editor for a software engineering student's portfolio. 
      Take the following draft text and rewrite it to be clean, engaging, and professional. 
      Fix any grammar or spelling mistakes. 
      Keep the tone authentic, slightly casual, but smart (like a "vibe coder"). 
      Do NOT add extra pleasantries or conversational filler (like "Here is your text"). Just return the polished text itself.

      Draft text: "${text}"
    `;

    // 3. Send the prompt to Gemini and wait for the magic
    const result = await model.generateContent(prompt);
    const polishedText = result.response.text();

    // 4. Send the cleaned text back to the frontend
    res.json({ polishedText });

  } catch (err) {
    console.error('❌ GEMINI AI ERROR:', err.message);
    res.status(500).json({ message: 'Failed to polish text. Check server logs.' });
  }
});

module.exports = router;