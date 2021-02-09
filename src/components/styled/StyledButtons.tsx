import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { Colors } from '../../themes/mainTheme';

export const StyledDeleteButton = styled(Button)`
  color: ${Colors.Warning};
`;

export const StyledCancelButton = styled(Button)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

export const StyledConfirmButton = styled(Button)`
  margin-left: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;
