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
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-side">
        <div className="image-overlay">
          <h2>Code. Create. Collaborate.</h2>
          <p>Your ultimate gateway to the most exciting hackathons and tech events. Join top developers and build the future.</p>
        </div>
      </div>
      
      <div className="login-form-side">
        <div className="form-wrapper">
          <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="subtitle">
            {isLogin ? 'Enter your credentials to access your dashboard.' : 'Sign up to start booking exclusive events.'}
          </p>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
            )}
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
            
            <button type="submit" className="btn-modern">
              {isLogin ? 'Sign In to Account' : 'Register Now'}
            </button>
          </form>

          <p className="toggle-text" onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '2rem' }}>
            {isLogin ? "Don't have an account? Sign up here" : 'Already have an account? Sign in'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;