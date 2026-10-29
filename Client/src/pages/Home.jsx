import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  const categories = ['All', 'Web', 'AI', 'Cyber Security', 'Startup', 'Cloud'];

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    fetchEvents();
  }, [page, category]); 

  const fetchEvents = async () => {
    try {
      const url = `http://localhost:3000/api/events/all?page=${page}&limit=6${category !== 'All' ? `&category=${category}` : ''}`;
      const res = await axios.get(url);
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const bookEvent = async (eventId) => {
    if (!token) return navigate('/login');
    try {
      await axios.post(`http://localhost:3000/api/events/book/${eventId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed!");
    }
  };

  const unbookEvent = async (eventId) => {
    if (!token) return navigate('/login');
    try {
      await axios.post(`http://localhost:3000/api/events/unbook/${eventId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed!");
    }
  };

  return (
    <>
      <div style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      <div className="container">
        {role === 'admin' ? (
          <div className="dashboard-header">
            <h6 style={{ color: '#2d5a3f', letterSpacing: '1px', margin: '1.5rem 0 0.5rem 0' }}>● COMMUNITY OVERVIEW</h6>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin dashboard.</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>One view of the community and everything being shared.</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{events.length}</div>
                <div className="stat-label">Total Listings</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {events.reduce((total, event) => total + event.totalSeats, 0)}
                </div>
                <div className="stat-label">Total Seats Capacity</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {events.reduce((total, event) => total + event.bookedStudents.length, 0)}
                </div>
                <div className="stat-label">Total Bookings</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-header" style={{ marginTop: '1.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Explore Events</h1>
          </div>
        )}

        <div className="category-bar">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)}
              className={`btn-category ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666', fontSize: '1.2rem' }}>
            No events found for "{category}". Try another category!
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => {
              const isBooked = token && event.bookedStudents && event.bookedStudents.some(student => student._id === userId);

              return (
                <div key={event._id} className="event-card">
                  <div className="card-image-placeholder">
                    {role === 'admin' && <span className="admin-badge">ADMIN VIEW</span>}
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{event.title}</h3>
                    <p className="card-desc">{event.description}</p>
                    
                    <div className="card-meta">
                      <span>📍 {event.location}</span>
                      <span>🪑 {event.bookedStudents.length} / {event.totalSeats} Booked</span>
                    </div>
                    
                    {!isBooked && role !== 'admin' && (
                      <button onClick={() => bookEvent(event._id)} className="btn-primary" style={{width: '100%'}}>Book Seat</button>
                    )}
                    {isBooked && role !== 'admin' && (
                      <button onClick={() => unbookEvent(event._id)} className="btn-danger" style={{width: '100%'}}>Cancel Booking</button>
                    )}

                    {role === 'admin' && (
                      <div className="student-list">
                        <strong style={{fontSize: '0.85rem', color: '#2d5a3f'}}>Registered Users:</strong>
                        <ul>
                          {event.bookedStudents.map((student) => (
                            <li key={student._id}>{student.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn-page" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
            <span style={{ fontWeight: '600' }}>Page {page} of {totalPages}</span>
            <button className="btn-page" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;