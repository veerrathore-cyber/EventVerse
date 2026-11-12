import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            
            // Token aur Role dono save karo
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role); // Ye nayi line hai
            
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="split-layout">
            <div className="split-left"></div>
            <div className="split-right">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>Login to EventVerse</h2>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;