import React, { FC } from 'react';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InstitutionFiltering from './InstitutionFiltering';
import { Resource } from '../../types/resource.types';

const StyledFilterBox = styled.div`
  margin-top: 2rem;
  background-color: ${Colors.ExploreResourcesPageOptionFiler};
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width4};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.values.xl + 'px'}) {
    width: ${({ theme }) => theme.breakpoints.values.sm + 'px'};
    margin-top: 0rem;
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const StyledAccordion = styled(Accordion)`
  border: none;
  background-color: inherit;
  width: inherit;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  display: flex;
`;

const FilterSearchOptions = () => {
  return (
    <StyledFilterBox>
      {window.innerWidth < 1920 && (
        <StyledAccordion component={'aside'}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-box-options"
            id="filter-box-options-header">
            <Typography variant="h2">Filter</Typography>{' '}
          </AccordionSummary>
          <StyledAccordionDetails>
            <InstitutionFiltering />
            <Typography>Incomming filter boxes</Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
      )}
      {window.innerWidth > 1920 && <Typography variant="h2">Filter</Typography>}
    </StyledFilterBox>
  );
};

export default FilterSearchOptions;
