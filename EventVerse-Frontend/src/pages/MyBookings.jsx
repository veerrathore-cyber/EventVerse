import { useState, useEffect } from 'react';
import API from '../api';

const MyBookings = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const res = await API.get('/events/mybookings');
            setEvents(res.data.events);
        } catch (error) {
            console.error(error);
        }
    };

    const unbookEvent = async (id) => {
        try {
            const res = await API.post(`/events/unbook/${id}`);
            alert(res.data.message);
            fetchMyBookings();
        } catch (error) {
            alert(error.response?.data?.message || 'Cancellation Failed');
        }
    };

    return (
        <div className="container">
            <h2 style={{ marginBottom: '20px', color: '#0f172a' }}>My Booked Events</h2>
            {events.length === 0 ? (
                <p>You haven't booked any events yet.</p>
            ) : (
                <div className="event-grid">
                    {events.map(event => (
                        <div key={event._id} className="event-card">
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <br />
                            <p><strong>Date:</strong> {event.date}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <button 
                                className="book-btn red-glass" 
                                onClick={() => unbookEvent(event._id)}
                            >
                                Cancel Booking
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;