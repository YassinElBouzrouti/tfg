import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const element = document.querySelector(location.hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-[#0b1118] text-white">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default PublicLayout;
