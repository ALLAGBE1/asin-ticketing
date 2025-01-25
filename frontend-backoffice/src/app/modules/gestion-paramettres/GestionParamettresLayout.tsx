import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './GestionParamettres.css';

const GestionParamettresLayout: FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { GestionParamettresLayout };
