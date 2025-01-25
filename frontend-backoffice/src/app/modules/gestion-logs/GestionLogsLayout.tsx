/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './GestionLogs.css';

const GestionLogsLayout: FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { GestionLogsLayout };
