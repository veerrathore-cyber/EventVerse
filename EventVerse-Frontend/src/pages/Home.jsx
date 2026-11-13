import { useState, useEffect } from 'react';
import API from '../api';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState('All');
    
    // Pagination states
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const categories = ['All', 'Web', 'AI', 'Cyber Security', 'Startup', 'Cloud', 'Other'];
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchEvents();
    }, [category, page]);

    const fetchEvents = async () => {
        try {
            // API call with page parameter
            const res = await API.get(`/events/all?category=${category}&page=${page}`);
            setEvents(res.data.events);
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

    const handleCategoryChange = (c) => {
        setCategory(c);
        setPage(1); // Reset to page 1 when filter changes
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

            {/* Professional Numbered Pagination UI */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', paddingBottom: '40px' }}>
                <div style={{ display: 'inline-flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'white' }}>
                    
                    {/* Previous Button */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        style={{
                            padding: '8px 16px', border: 'none', borderRight: '1px solid #ddd',
                            backgroundColor: 'white', color: page === 1 ? '#999' : '#007bff',
                            cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '16px'
                        }}
                    >
                        Previous
                    </button>

                    {/* Dynamic Page Numbers (1, 2, 3...) */}
                    {[...Array(totalPages || 1)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                style={{
                                    padding: '8px 16px', border: 'none', borderRight: '1px solid #ddd',
                                    backgroundColor: page === pageNum ? '#007bff' : 'white',
                                    color: page === pageNum ? 'white' : '#007bff',
                                    cursor: 'pointer', fontSize: '16px'
                                }}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* Next Button */}
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        style={{
                            padding: '8px 16px', border: 'none',
                            backgroundColor: 'white', color: page === totalPages ? '#999' : '#007bff',
                            cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '16px'
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Home;