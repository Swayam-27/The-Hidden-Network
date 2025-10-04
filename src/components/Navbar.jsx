import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="main-nav">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/cases">Cases</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
};

export default Navbar;