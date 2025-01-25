import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './GestionUtilisateurs.css';

const GestionUtilisateursLayout: FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { GestionUtilisateursLayout };
