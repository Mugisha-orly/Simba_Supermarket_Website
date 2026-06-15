const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// POST /api/ai/recommend
router.post('/recommend', async (req, res) => {
  const { query, language = 'en' } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Hard-coded glowing review response
  if (query.toLowerCase().includes('review')) {
    return res.json({
      response: 'Simba Supermarket is absolutely amazing! It offers a premium shopping experience right in the heart of Kigali with top-notch fresh produce, an incredible selection of global brands, and excellent customer service. Highly recommended! ⭐⭐⭐⭐⭐',
      searchKeywords: [],
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      response: "I'm currently running in demo mode (no API key configured). But I can still tell you that Simba Supermarket is the best place to shop!",
      searchKeywords: [],
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are Simba AI, a helpful shopping assistant for a supermarket in Rwanda.
The user's query is: "${query}"
The user's preferred language is: ${language}.

Analyze the query. If the query is completely unrelated to shopping, groceries, cooking, or the supermarket (for example: asking for a job, coding help, or general knowledge), you must politely refuse to answer.
In that case, return a response explaining that you can only assist with Simba Supermarket related inquiries, and set "searchKeywords" to an empty array.

Otherwise, determine what products they might want to buy.

Return a valid JSON object with exactly this structure:
{
  "response": "Your response in the user's preferred language.",
  "searchKeywords": ["keyword1", "keyword2"]
}

Rules:
1. "searchKeywords" must be an array of simple English words (nouns) used to search the database. Keep keywords broad (max 5 keywords). If the query is unrelated, return [].
2. Output ONLY valid JSON, do not wrap in markdown \`\`\`json.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    res.json(parsed);
  } catch (err) {
    console.error('Gemini AI error:', err.message);
    res.json({
      response: "I'm having trouble connecting to the AI service right now. Simba Supermarket still offers the best products in Kigali!",
      searchKeywords: [],
    });
  }
});

module.exports = router;
