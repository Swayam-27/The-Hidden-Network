import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ playHover, playClick }) => {
  return (
    <nav className="main-nav">
      <NavLink
        to="/"
        className="cursor-target"
        onMouseEnter={playHover}
        onClick={playClick}
      >
        Home
      </NavLink>
      <NavLink
        to="/cases"
        className="cursor-target"
        onMouseEnter={playHover}
        onClick={playClick}
      >
        Cases
      </NavLink>
      <NavLink
        to="/about"
        className="cursor-target"
        onMouseEnter={playHover}
        onClick={playClick}
      >
        About
      </NavLink>
    </nav>
  );
};

export default Navbar;