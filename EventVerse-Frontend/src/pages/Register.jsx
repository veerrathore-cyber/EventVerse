import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', { name, email, password, role: 'student'});
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="split-layout">
            <div className="split-left" style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1770&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}></div>
            <div className="split-right">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Join EventVerse</h2>
                    <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;