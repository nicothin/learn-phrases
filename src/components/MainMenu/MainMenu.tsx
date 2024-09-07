import { NavLink } from 'react-router-dom';

import './MainMenu.css';
import '../../assets/btn-circle.css';
import '../../assets/menu.css';

import { DropButton } from '../DropButton/DropButton';

export function MainMenu() {
  return (
    <nav className="main-menu">
      <DropButton
        className="main-menu__dropdown"
        buttonContent={
          <>
            <p className="main-menu__title" title="Learn phrases">
              LP
            </p>
            <svg className="main-menu__burger" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <rect width="16" height="2" x="1" y="2" ry="1" />
              <rect width="16" height="2" x="1" y="14" ry="1" />
              <rect width="16" height="2" x="1" y="8" ry="1" />
            </svg>
          </>
        }
        buttonClassName="main-menu__button  btn-circle"
      >
        <ul className="main-menu__list  menu">
          <li>
            <NavLink to="/">Learn</NavLink>
          </li>
          <li>
            <NavLink to="/admin">Admin</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/settings">Settings</NavLink>
          </li>
        </ul>
      </DropButton>
    </nav>
  );
}
