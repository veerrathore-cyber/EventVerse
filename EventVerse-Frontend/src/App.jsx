import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import CreateEvent from './pages/CreateEvent';
import ProtectedRoute from './components/ProtectedRoute'; // Bouncer import kiya
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mybookings" element={
          <ProtectedRoute>
            <MyBookings /> 
          </ProtectedRoute>
          } />
            
        <Route path="/create-event" element={
          <ProtectedRoute adminOnly={true}>
            <CreateEvent />
          </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;