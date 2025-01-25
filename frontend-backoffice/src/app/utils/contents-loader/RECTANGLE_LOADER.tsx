import { Skeleton } from '@mui/material';

type Props = {
  width: number;
  height: number;
};

export const RECTANGLE_LOADER = ({ width, height }: Props) => {
  return (
    <>
      <Skeleton variant="rectangular" width={width} height={height} />
    </>
  );
};
