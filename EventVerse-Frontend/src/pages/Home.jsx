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

    // LOGIC: Sirf maximum 5 page numbers dikhane ke liye
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (totalPages > 5) {
        if (page <= 3) {
            endPage = 5;
        } else if (page >= totalPages - 2) {
            startPage = totalPages - 4;
        }
    }

    const visiblePages = [];
    for (let i = startPage; i <= (endPage || 1); i++) {
        visiblePages.push(i);
    }

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
                    // FIX: Flex aur column laga diya taaki buttons neeche push ho jayein
                    <div key={event._id} className="event-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <br />
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Available Seats:</strong> {event.totalSeats - event.bookedStudents.length}</p>
                        
                        {/* FIX: marginTop 'auto' is div ko hamesha card ke bottom par fix rakhega */}
                        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

                    {/* Dynamic Page Numbers (Fixed Limit of 5) */}
                    {visiblePages.map(pageNum => (
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
                    ))}

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