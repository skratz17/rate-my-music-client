import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../user/UserProvider';
import { NavLink } from './NavLink';

export const NavBar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="border-b border-gray-200 py-3 px-5 flex md:flex-row flex-col justify-between 2xl:container mx-auto">
      <div className="flex md:flex-row flex-col md:justify-evenly justify-center md:items-end items-center">
        <Link className="text-emerald hover:text-emerald-dark text-7xl tracking-widest" to="/">
          <h1>RMM</h1>
        </Link>

        <NavLink to="/charts">charts</NavLink>
        <NavLink to="/lists">lists</NavLink>
        <NavLink to="/contribute">contribute</NavLink>
      </div>

      <div className="flex md:flex-row flex-col md:justify-end justify-center md:items-end items-center">
        <NavLink to="/me">{user?.user?.username}</NavLink>
        <NavLink to="/logout" className="mx-0">(logout)</NavLink>
      </div>
    </nav>
  )
};