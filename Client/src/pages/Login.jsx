import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        localStorage.setItem('userId', res.data.user.id);
        navigate('/');
      } else {
        await axios.post('http://localhost:3000/api/auth/register', { name, email, password });
        alert("Registration Successful! Ab login karo.");
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Kuch galat ho gaya!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', backgroundColor: '#f4f6f9', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '450px', padding: '40px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#1e3c72', marginBottom: '30px', fontSize: '28px' }}>
          {isLogin ? 'Welcome Back 👋' : 'Create Account ✨'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <input type="text" placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0', outline: 'none' }} />
          )}
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0', outline: 'none' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ced6e0', outline: 'none' }} />
          
          <button type="submit" style={{ padding: '12px', background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '8px', marginTop: '10px', boxShadow: '0 4px 10px rgba(42, 82, 152, 0.3)' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '25px', cursor: 'pointer', color: '#57606f', fontSize: '15px' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? (
            <>Don't have an account? <span style={{ color: '#2a5298', fontWeight: 'bold' }}>Register here</span></>
          ) : (
            <>Already have an account? <span style={{ color: '#2a5298', fontWeight: 'bold' }}>Login here</span></>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;