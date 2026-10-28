import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchEvents();
  }, [page]); 

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/events/all?page=${page}&limit=2`);
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const bookEvent = async (eventId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:3000/api/events/book/${eventId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message);
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed!");
    }
  };

  const unbookEvent = async (eventId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:3000/api/events/unbook/${eventId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message);
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed!");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* HERO BANNER SECTION */}
      <div style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Hackathon Event Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      <div style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px', fontSize: '32px' }}>📅 Upcoming Events & Hackathons</h2>
          
          {events.map((event) => {
            const isBooked = token && event.bookedStudents && event.bookedStudents.some(student => student._id === userId);

            return (
              <div key={event._id} style={{ backgroundColor: 'white', padding: '25px', margin: '15px 0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e1e5eb' }}>
                <h3 style={{ marginTop: 0, color: '#1e3c72', fontSize: '24px' }}>{event.title}</h3>
                <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5' }}>{event.description}</p>
                <p style={{ fontWeight: '500', color: '#333' }}>📍 Location: {event.location} &nbsp;|&nbsp; 🪑 Seats: {event.totalSeats}</p>
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  {!isBooked && role !== 'admin' && (
                    <button onClick={() => bookEvent(event._id)} style={{ padding: '10px 20px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(46, 213, 115, 0.3)' }}>
                      ✅ Book Seat
                    </button>
                  )}
                  {isBooked && role !== 'admin' && (
                    <button onClick={() => unbookEvent(event._id)} style={{ padding: '10px 20px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(255, 71, 87, 0.3)' }}>
                      ❌ Cancel Booking
                    </button>
                  )}
                </div>

                {role === 'admin' && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f2f6', borderRadius: '8px', border: '1px solid #dfe4ea' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2f3542' }}>📝 Registered Students:</h4>
                    {event.bookedStudents.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#57606f', lineHeight: '1.6' }}>
                        {event.bookedStudents.map((student) => (
                          <li key={student._id}><strong>{student.name}</strong> ({student.email})</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, color: '#a4b0be', fontStyle: 'italic' }}>Abhi tak kisi ne register nahi kiya hai.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '10px 20px', cursor: page === 1 ? 'not-allowed' : 'pointer', backgroundColor: page === 1 ? '#ced6e0' : '#1e3c72', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}>
              Previous
            </button>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2f3542' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ padding: '10px 20px', cursor: page === totalPages ? 'not-allowed' : 'pointer', backgroundColor: page === totalPages ? '#ced6e0' : '#1e3c72', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;