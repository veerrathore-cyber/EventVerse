import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyCollection() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchMyBookings();
    }
  }, [token, navigate]);

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/events/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data.events);
    } catch (error) {
      console.error(error);
    }
  };

  const unbookEvent = async (eventId) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/events/unbook/${eventId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message);
      fetchMyBookings(); 
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed!");
    }
  };

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '32px' }}>🎟️ My Collection</h2>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e1e5eb' }}>
            <h3 style={{ color: '#57606f' }}>Booking empty</h3>
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} style={{ backgroundColor: 'white', padding: '25px', margin: '15px 0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e1e5eb' }}>
              <h3 style={{ marginTop: 0, color: '#1e3c72', fontSize: '24px' }}>{event.title}</h3>
              <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5' }}>{event.description}</p>
              <p style={{ fontWeight: '500', color: '#333' }}>📍 Location: {event.location} &nbsp;|&nbsp; 🪑 Seats: {event.totalSeats}</p>
              
              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button onClick={() => unbookEvent(event._id)} style={{ padding: '10px 20px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(255, 71, 87, 0.3)' }}>
                  ❌ Cancel Booking
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyCollection;