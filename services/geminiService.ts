
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const generateNaijaTagline = async (movieTitle: string, movieDescription: string): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE}/generate-tagline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: movieTitle, description: movieDescription })
    });
    if (!res.ok) {
      return "A must-watch for the weekend!";
    }
    const data = await res.json();
    return data.tagline || "A must-watch for the weekend!";
  } catch (error) {
    return "The vibiest movie in Naija right now!";
  }
};

export const getAIPicks = async (prompt: string): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE}/generate-tagline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'AI Picks', description: prompt })
    });
    if (!res.ok) {
      return "AI not configured.";
    }
    const data = await res.json();
    return data.tagline || "";
  } catch (error) {
    return "Error getting AI insights";
  }
}
