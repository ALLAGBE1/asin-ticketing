import { Skeleton } from '@mui/material';
// import ContentLoader from 'react-content-loader'
// import {FC} from 'react'

export const CIRCULAR_LOADER: React.FC = () => {
  return (
    <>
      <Skeleton variant="circular" width={40} height={40} />
    </>
  );
};
