import React, { FC, useState } from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

//kommer med en pull fra master
const StyledRadioBoxWrapper = styled.div`
  width: 80%;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 90%;
  }
  display: block;
  padding-bottom: 2rem;
`;

const StyledAccordionTypeDivHeader = styled.div`
  display: flex;
  padding-bottom: 0.5rem;
  align-items: center;
  cursor: pointer;
`;

const StyledDisabledAccordionTypeDivHeader = styled.div`
  display: flex;
  padding-bottom: 0.5rem;
  align-items: center;
`;

interface AccordionRadioGroupProps {
  ariaDescription: string;
  title: string;
  disabled: boolean;
}

const AccoridionRadioGroup: FC<AccordionRadioGroupProps> = ({ ariaDescription, title, children, disabled }) => {
  const [showRadioDetails, setShowRadioDetails] = useState(false);

  return (
    <StyledRadioBoxWrapper>
      {!disabled && (
        <StyledAccordionTypeDivHeader id={`${ariaDescription}-header`}>
          <Button
            aria-controls={ariaDescription}
            size="large"
            onClick={() => setShowRadioDetails(!showRadioDetails)}
            color="primary"
            endIcon={!showRadioDetails ? <ExpandMoreIcon /> : <ExpandLessIcon />}>
            <Typography variant="h6">{title}</Typography>
          </Button>
        </StyledAccordionTypeDivHeader>
      )}
      {disabled && (
        <StyledDisabledAccordionTypeDivHeader id={`${ariaDescription}-header`}>
          <Button aria-controls={ariaDescription} size="large" disabled color="primary" endIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{title}</Typography>
          </Button>
        </StyledDisabledAccordionTypeDivHeader>
      )}

      {showRadioDetails && !disabled && <div id={ariaDescription}>{children}</div>}
    </StyledRadioBoxWrapper>
  );
};
export default AccoridionRadioGroup;
