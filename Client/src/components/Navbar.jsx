import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 
  const role = localStorage.getItem('role'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">🎟️ EventVerse</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        
        {token && role === 'admin' && (
          <Link to="/create" className="nav-link">Add Event</Link>
        )}

        {token && role !== 'admin' && (
          <Link to="/collection" className="nav-link">My Collection</Link>
        )}
        
        {!token ? (
          <Link to="/login" className="btn-primary">Login / Signup</Link>
        ) : (
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;