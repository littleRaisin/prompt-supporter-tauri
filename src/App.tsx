import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      {/* Routes will be added here */}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Prompt Supporter</h1>
      </div>
    </BrowserRouter>
  );
}

export default App;
