import { Skeleton } from '@mui/material';

type Props = {
  width: string;
  height: string;
};

export const ROUNDED_LOADER = ({ width, height }: Props) => {
  return (
    <>
      <Skeleton variant="rounded" width={width} height={height} />
    </>
  );
};
