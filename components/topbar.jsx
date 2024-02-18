import React from 'react';
import Link from 'next/link';

const getLinkClassName = (path, currentPath) => {
  return {
    color: currentPath === path ? '#10b981' : '#374151', // Active color or default color
    textDecoration: 'none',
    fontWeight: '500',
    margin: '0 1rem',
    borderBottom: currentPath === path ? '2px solid #10b981' : 'none' // Underline if active
  };
};

const Navbar = ({ currentPath }) => {
  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.8rem 4.25rem',
    backgroundColor: '#FFE6D4',
    boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
    color: 'brown',
    fontFamily: 'serif',
    fontSize: '23px'
  };

  return (
    <nav style={navbarStyle}>
      <Link href="/meds/hey" legacyBehavior>
        <a style={getLinkClassName("/meds/hey", currentPath)}>Meds</a>
      </Link>
      <Link href="/schedule/hey" legacyBehavior>
        <a style={getLinkClassName("/schedule/hey", currentPath)}>Visits</a>
      </Link>
    </nav>
  );
};

export default Navbar;
