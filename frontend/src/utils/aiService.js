const API_BASE = import.meta.env.VITE_API_URL || '';

export const getAIRecommendations = async (userQuery, language = 'en') => {
  try {
    const response = await fetch(`${API_BASE}/api/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery, language }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      response: "I'm having trouble connecting to the AI service right now. Simba Supermarket still has the best products in Kigali!",
      searchKeywords: [],
    };
  }
};
