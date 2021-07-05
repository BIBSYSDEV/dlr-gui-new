import styled from 'styled-components';
import NormalText from '../NormalText';
import RadioGroup from '@material-ui/core/RadioGroup';
import { Colors, StyleWidths } from '../../themes/mainTheme';

export const StyledInformationWrapper = styled.div`
  width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  padding-top: 4rem;
  padding-bottom: 1rem;
`;

export const StyledProgressWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 2rem;
`;

export const StyledFullPageProgressWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: center;
`;

export const StyledNormalTextPreWrapped = styled(NormalText)`
  white-space: pre-wrap;
`;

export const StyledSchemaPart = styled.div`
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledSchemaPartColored = styled(StyledSchemaPart)`
  background-color: ${(props) => props.color};
`;

export const StyledFeatureWrapper = styled.div`
  padding: 0.5rem 0;
`;

export const StyledContentWrapper = styled.div`
  width: 100%;
  max-width: ${StyleWidths.width3};
`;

export const StyledContentWrapperMedium = styled.div`
  width: 100%;
  max-width: ${StyleWidths.width4};
`;

export const StyledContentWrapperLarge = styled.div`
  width: 100%;
  max-width: ${StyleWidths.width5};
  padding: 0 2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding: 0 0;
  }
`;

export const StyledRadioBoxWrapper = styled.div`
  margin-top: 2rem;
  display: block;
  padding-bottom: 2rem;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  margin-left: 4rem;
  padding-top: 0.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-left: 0;
  }
`;

export const StyledFieldsWrapper = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: flex;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: block;
  }
  align-items: flex-end;
  margin-top: 2.5rem;
`;

export const StyledPaginationWrapper = styled.div`
  margin: 1rem 0 1rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;

  & .MuiPaginationItem-root {
    border-radius: 0;
    color: ${Colors.Primary};
    font-weight: 700;
  }

  & .Mui-selected {
    color: ${Colors.Background};
  }
`;
