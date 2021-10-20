import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const StyledRadioBoxWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  display: block;
  padding-bottom: 2rem;
`;

const StyledButton = styled(Button)`
  padding: 0;
`;

const StyledTypography = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
`;

interface AccordionRadioGroupProps {
  ariaDescription: string;
  title: string;
  expanded: boolean;
}

const AccoridionRadioGroup: FC<AccordionRadioGroupProps> = ({ ariaDescription, title, children, expanded }) => {
  const [showRadioDetails, setShowRadioDetails] = useState(expanded);

  useEffect(() => {
    setShowRadioDetails(expanded);
  }, [expanded]);

  return (
    <StyledRadioBoxWrapper>
      <StyledButton
        aria-controls={ariaDescription}
        onClick={() => setShowRadioDetails(!showRadioDetails)}
        color="primary"
        endIcon={!showRadioDetails ? <ExpandMoreIcon /> : <ExpandLessIcon />}>
        <StyledTypography>{title}</StyledTypography>
      </StyledButton>
      {showRadioDetails && <div id={ariaDescription}>{children}</div>}
    </StyledRadioBoxWrapper>
  );
};
export default AccoridionRadioGroup;
