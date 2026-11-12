import { useState, useEffect } from 'react';
import API from '../api';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [category, setCategory] = useState('All');
    const categories = ['All', 'Web', 'AI', 'Cyber Security', 'Startup', 'Cloud', 'Other'];
    
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchEvents();
    }, [category]);

    const fetchEvents = async () => {
        try {
            const res = await API.get(`/events/all?category=${category}`);
            setEvents(res.data.events);
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

    return (
        <div className="container">
            <div className="filters">
                {categories.map(c => (
                    <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
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
        </div>
    );
};

export default Home;