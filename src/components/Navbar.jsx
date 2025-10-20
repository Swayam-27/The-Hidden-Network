import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="main-nav">
      <NavLink to="/" className="cursor-target">Home</NavLink>
      <NavLink to="/cases" className="cursor-target">Cases</NavLink>
      <NavLink to="/about" className="cursor-target">About</NavLink>
    </nav>
  );
};

export default Navbar;