import { Skeleton } from '@mui/material';
// import ContentLoader from 'react-content-loader'
// import {FC} from 'react'

export const LOADER_INPUTLOADER: React.FC = () => {
  return (
    <>
      {/* <ContentLoader
        width={400}
        height={40}
        speed={100}
        backgroundColor="#ababab"
        foregroundColor="#fafafa"
      >
        <rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      </ContentLoader> */}
      <Skeleton
        variant="rectangular"
        width="100%"
        style={{ borderRadius: '5px' }}
        height={35}
      />
    </>
  );
};
