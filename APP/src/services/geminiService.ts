const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5174/api';

export const generateNaijaTagline = async (movieTitle: string, movieDescription: string): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE}/generate-tagline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: movieTitle, description: movieDescription })
    });
    if (!res.ok) return 'A must-watch for the weekend!';
    const data = await res.json();
    return data.tagline || 'A must-watch for the weekend!';
  } catch {
    return 'The vibiest movie in Naija right now!';
  }
};
