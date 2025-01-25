import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './GestionCustomer.css';

const GestionCustomerLayout: FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { GestionCustomerLayout };
