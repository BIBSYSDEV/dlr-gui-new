import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

//kommer med en pull fra master
const StyledRadioBoxWrapper = styled.div`
  width: 60%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  display: block;
  padding-bottom: 2rem;
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
      <Button
        aria-controls={ariaDescription}
        size="large"
        onClick={() => setShowRadioDetails(!showRadioDetails)}
        color="primary"
        endIcon={!showRadioDetails ? <ExpandMoreIcon /> : <ExpandLessIcon />}>
        <Typography variant="h6">{title}</Typography>
      </Button>
      {showRadioDetails && <div id={ariaDescription}>{children}</div>}
    </StyledRadioBoxWrapper>
  );
};
export default AccoridionRadioGroup;
