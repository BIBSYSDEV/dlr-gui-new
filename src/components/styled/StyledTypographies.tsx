import styled from 'styled-components';
import Typography from '@mui/material/Typography';

export const StylePopoverTypography = styled(Typography)`
  margin-bottom: 0.5rem;
`;

export const AdditionalTextForScreenReaders = styled.span`
  position: absolute !important;
  clip: rect(1px, 1px, 1px, 1px);
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  border: 0 !important;
  overflow: hidden;
  white-space: nowrap;
`;
