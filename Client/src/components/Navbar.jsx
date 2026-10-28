import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 
  const role = localStorage.getItem('role'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    alert("Logout successful!");
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>🎟️ EventVerse</h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>Home</Link>
        
        {token && role === 'admin' && (
          <Link to="/create" style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>Add Event</Link>
        )}

        {token && role !== 'admin' && (
          <Link to="/collection" style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>My Collection</Link>
        )}
        
        {!token ? (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500', border: '1px solid white', padding: '5px 15px', borderRadius: '20px' }}>Login / Signup</Link>
        ) : (
          <button onClick={handleLogout} style={{ backgroundColor: '#ff4757', color: 'white', border: 'none', padding: '8px 18px', cursor: 'pointer', borderRadius: '20px', fontSize: '15px', fontWeight: 'bold' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;