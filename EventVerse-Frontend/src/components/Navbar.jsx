import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="glass-nav">
            <h2>EventVerse</h2>
            <div>
                <Link to="/" className="nav-btn">Home</Link>
                {token ? (
                    <>
                        {role === 'admin' && (
                            <Link to="/create-event" className="nav-btn">Create Event</Link>
                        )}
                        <Link to="/mybookings" className="nav-btn">My Bookings</Link>
                        <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-btn">Login</Link>
                        <Link to="/register" className="nav-btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;