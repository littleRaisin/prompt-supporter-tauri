import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initDb } from './db';

type DbState = 'loading' | 'ready' | 'error';

function App() {
  const [dbState, setDbState] = useState<DbState>('loading');

  useEffect(() => {
    initDb()
      .then(() => setDbState('ready'))
      .catch((err) => {
        console.error('[App] DB initialization failed:', err);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Failed to initialize database.</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      {/* Routes will be added in Step 3 */}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Prompt Supporter</h1>
      </div>
    </BrowserRouter>
  );
}

export default App;
