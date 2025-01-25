import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './GestionReclamation.css';

const GestionReclamationLayout: FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { GestionReclamationLayout };
