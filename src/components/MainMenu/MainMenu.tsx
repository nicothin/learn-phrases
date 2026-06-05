import { NavLink } from 'react-router-dom';

import './MainMenu.css';

import { DropButton, Icon, Menu } from '@shared/components';

const navItems = [
  <NavLink to="/">Learn</NavLink>,
  <NavLink to="/admin">Admin</NavLink>,
  <NavLink to="/about">About</NavLink>,
  <NavLink to="/settings">Settings</NavLink>,
];

export function MainMenu() {
  return (
    <nav className="main-menu">
      <DropButton
        className="main-menu__dropdown"
        buttonContent={
          <>
            <span className="main-menu__title" title="Learn phrases">
              LP
            </span>
            <Icon className="main-menu__burger" name="burger" />
          </>
        }
        buttonClassName="main-menu__button"
        buttonVariant="secondary"
        buttonCircle
      >
        <Menu className="main-menu__list" items={navItems} />
      </DropButton>
    </nav>
  );
}
