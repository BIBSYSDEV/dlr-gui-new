import React from 'react';
import { StyledContentWrapper, StyledSchemaPart } from './styled/Wrappers';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const StyledRequiredFieldWrapper = styled(StyledSchemaPart)`
  padding: 1rem 1rem 2rem 1rem;
`;

/*
The aria-hidden is set to true because Material-ui sets aria-hidden=true for any "*" from the required input fields,
making this component's information only confusing for screen reader users.
 */

const RequiredFieldInformation = () => {
  return (
    <StyledRequiredFieldWrapper aria-hidden="true">
      <StyledContentWrapper>
        <Typography>Felter markert med * er påkrevd</Typography>
      </StyledContentWrapper>
    </StyledRequiredFieldWrapper>
  );
};

export default RequiredFieldInformation;
