import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import Edit from './pages/Edit';
import FavoriteCategoryList from './pages/FavoriteCategoryList';
import { initDb } from './db';

type DbState = 'loading' | 'ready' | 'error';
type DbError = { message: string };

function App() {
  const [dbState, setDbState] = useState<DbState>('loading');
  const [dbError, setDbError] = useState<DbError | null>(null);

  useEffect(() => {
    initDb()
      .then(() => setDbState('ready'))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[App] DB initialization failed:', message);
        setDbError({ message });
        setDbState('error');
      });
  }, []);

  if (dbState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (dbState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-2">
        <p className="text-red-500 font-bold">Failed to initialize database.</p>
        {dbError && (
          <p className="text-red-400 text-sm max-w-lg text-center break-all">{dbError.message}</p>
        )}
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:promptName" element={<SearchResult />} />
          <Route path="/create" element={<Edit />} />
          <Route path="/edit/:promptName" element={<Edit />} />
          <Route path="/favorite/:category" element={<FavoriteCategoryList />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
