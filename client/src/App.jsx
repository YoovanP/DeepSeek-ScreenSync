import { useState } from 'react';
import Host from './components/Host';
import Viewer from './components/Viewer';
import './styles.css';

function App() {
  const [mode, setMode] = useState(null);
  const [roomId, setRoomId] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      {!mode ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold mb-8">Watch Together</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setMode('host')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Host a Session
            </button>
            <button 
              onClick={() => setMode('join')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Join a Session
            </button>
          </div>
        </div>
      ) : mode === 'host' ? (
        <Host roomId={roomId} setRoomId={setRoomId} />
      ) : (
        <Viewer roomId={roomId} setRoomId={setRoomId} />
      )}
    </div>
  );
}

export default App;