import { Skeleton } from '@mui/material';
// import ContentLoader from 'react-content-loader'
// import {FC} from 'react'

export const TEXT_LOADER: React.FC = () => {
  return (
    <>
      <Skeleton
        animation="wave"
        variant="text"
        width={'100%'}
        sx={{ fontSize: '1rem' }}
      />
    </>
  );
};
