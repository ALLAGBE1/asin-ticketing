/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './GestionReporting.css';

const GestionReportingLayout: FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { GestionReportingLayout };
