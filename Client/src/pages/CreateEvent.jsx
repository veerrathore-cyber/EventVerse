import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Pehle login karo bhai!");
      return;
    }
    try {
      await axios.post(
        'http://localhost:3000/api/events/create',
        { title, description, date, totalSeats: Number(totalSeats), location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("New Event is Created Successfully!");
      navigate('/');
    } catch (error) {
      alert("Error: you are not admin!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', backgroundColor: '#f4f6f9', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '550px', padding: '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', borderTop: '6px solid #2a5298' }}>
        <h2 style={{ textAlign: 'center', color: '#1e3c72', marginBottom: '30px', fontSize: '28px' }}>📝 Create New Event</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0' }} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0', minHeight: '100px', resize: 'vertical' }} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0' }} />
          <input type="number" placeholder="Total Seats" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0' }} />
          <input type="text" placeholder="Location / Room No" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0' }} />
          
          <button type="submit" style={{ padding: '14px', background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '8px', marginTop: '10px', boxShadow: '0 4px 10px rgba(42, 82, 152, 0.3)' }}>
            🚀 Publish Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;