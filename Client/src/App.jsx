import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import MyCollection from './pages/MyCollection';

function App() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/collection" element={<MyCollection />} />
      </Routes>
    </div>
  );
}

export default App;