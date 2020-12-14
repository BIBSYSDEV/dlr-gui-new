import styled from 'styled-components';
import NormalText from '../NormalText';

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

export const StyledRightAlignedButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledCenterAlignedContentWrapper = styled.div`
  display: flex;
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

export const StyledContentWrapper = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'};
`;
