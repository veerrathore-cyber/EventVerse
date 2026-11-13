import { useState, useEffect } from 'react';
import API from '../api';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState('All');
    
    // NEW: Pagination ke liye state add kiya
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const categories = ['All', 'Web', 'AI', 'Cyber Security', 'Startup', 'Cloud', 'Other'];
    const role = localStorage.getItem('role');

    // NEW: category ya page change hone par events dobara fetch honge
    useEffect(() => {
        fetchEvents();
    }, [category, page]);

    const fetchEvents = async () => {
        try {
            // NEW: API link mein page number add kar diya
            const res = await API.get(`/events/all?category=${category}&page=${page}`);
            setEvents(res.data.events);
            // Backend se aane wale total pages ko state mein set karna
            setTotalPages(res.data.totalPages || 1); 
        } catch (error) {
            console.error(error);
        }
    };

    const bookEvent = async (id) => {
        try {
            const res = await API.post(`/events/book/${id}`);
            alert(res.data.message);
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Booking Failed');
        }
    };

    const deleteEvent = async (id) => {
        if(window.confirm("Are you sure you want to delete this event?")) {
            try {
                await API.delete(`/events/delete/${id}`);
                fetchEvents(); 
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    };

    // Jab user filter change kare, toh page wapas 1 par chala jaye
    const handleCategoryChange = (c) => {
        setCategory(c);
        setPage(1);
    };

    return (
        <div className="container">
            <div className="filters">
                {categories.map(c => (
                    <button key={c} className={category === c ? 'active' : ''} onClick={() => handleCategoryChange(c)}>
                        {c}
                    </button>
                ))}
            </div>
            
            <div className="event-grid">
                {events.map(event => (
                    <div key={event._id} className="event-card">
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <br />
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Available Seats:</strong> {event.totalSeats - event.bookedStudents.length}</p>
                        
                        <button className="book-btn" onClick={() => bookEvent(event._id)}>Book Seat</button>
                        
                        {role === 'admin' && (
                            <button 
                                className="book-btn red-glass" 
                                onClick={() => deleteEvent(event._id)}
                            >
                                Delete Event
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* NEW: Pagination Buttons UI */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px', paddingBottom: '20px' }}>
                <button 
                    className="book-btn" 
                    disabled={page === 1} 
                    onClick={() => setPage(page - 1)}
                    style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                    Previous
                </button>
                
                <span style={{ display: 'flex', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>
                    Page {page} of {totalPages}
                </span>
                
                <button 
                    className="book-btn" 
                    disabled={page === totalPages} 
                    onClick={() => setPage(page + 1)}
                    style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default Home;