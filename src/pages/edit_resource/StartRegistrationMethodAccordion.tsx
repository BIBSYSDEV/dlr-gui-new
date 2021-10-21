import React, { FC, ReactNode } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const StyledPublicationAccordion = styled(Accordion)`
  width: 50rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    max-width: 90vw;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  min-height: 5rem;
  align-items: center;
`;

const StyledIcon = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  flex-direction: column;
`;

interface StartRegistrationMethodAccordionProps {
  headerLabel: string;
  icon: ReactNode;
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  ariaControls: string;
  children?: ReactNode;
  dataTestId?: string;
}

const StartRegistrationMethodAccordion: FC<StartRegistrationMethodAccordionProps> = ({
  headerLabel,
  icon,
  expanded,
  onChange,
  children,
  ariaControls,
  dataTestId,
}) => {
  return (
    <StyledPublicationAccordion expanded={expanded} onChange={onChange}>
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={ariaControls} data-testid={dataTestId}>
        <StyledIcon>{icon}</StyledIcon>
        <Typography variant="h6">{headerLabel}</Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledPublicationAccordion>
  );
};

export default StartRegistrationMethodAccordion;
