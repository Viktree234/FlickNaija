
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import Subscribe from './pages/Subscribe';

const App: React.FC = () => {
  const [route, setRoute] = useState<string>(window.location.hash.slice(1) || '');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  // Basic Hash Routing logic
  const renderPage = () => {
    if (route === '' || route === '/') {
      return <Home onNavigate={navigate} />;
    }
    
    if (route.startsWith('movie/')) {
      const id = parseInt(route.split('/')[1]);
      return <MovieDetails id={id} onBack={() => navigate('')} />;
    }

    if (route.startsWith('search')) {
      const urlParams = new URLSearchParams(route.split('?')[1]);
      const query = urlParams.get('q') || '';
      return <SearchResults initialQuery={query} onNavigate={navigate} />;
    }

    if (route === 'subscribe') {
      return <Subscribe />;
    }

    return <Home onNavigate={navigate} />;
  };

  return (
    <div className="bg-black text-white min-h-screen selection:bg-green-500 selection:text-black">
      {renderPage()}
    </div>
  );
};

export default App;
