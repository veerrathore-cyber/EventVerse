import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', totalSeats: '', category: 'Web'
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/events/create', formData);
            alert('Event Created Successfully! 🎉');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <div className="split-layout">
            <div className="split-left" style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1712&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
                }}></div>
            <div className="split-right">
                <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: '420px' }}>
                    <h2>Create New Event</h2>
                    <input type="text" name="title" placeholder="Event Title" onChange={handleChange} required />
                    <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
                    <input type="date" name="date" onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                    <input type="number" name="totalSeats" placeholder="Total Seats" onChange={handleChange} required />
                    <select name="category" onChange={handleChange}>
                        <option value="Web">Web</option>
                        <option value="AI">AI</option>
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="Startup">Startup</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Other">Other</option>
                    </select>
                    <button type="submit">Post Event</button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;