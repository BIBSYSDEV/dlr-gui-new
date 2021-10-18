import React, { FC, ReactNode } from 'react';
import { Typography } from '@mui/material';

interface NormalTextProps {
  children: ReactNode;
}

const NormalText: FC<NormalTextProps> = ({ children, ...props }) => (
  <Typography variant="body1" {...props}>
    {children}
  </Typography>
);

export default NormalText;
