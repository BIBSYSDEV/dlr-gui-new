import React, { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors, DeviceWidths } from '../../themes/mainTheme';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import InstitutionFiltering from './InstitutionFiltering';

function useWindowWidth() {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return width;
}

const StyledAccordion = styled(Accordion)`
  background-color: ${Colors.ExploreResourcesPageOptionFiler};
  border: none;
  & .MuiPaper-elevation1 {
    box-shadow: none;
  }
`;

const StyledSideBar = styled.div`
  background-color: ${Colors.ExploreResourcesPageOptionFiler};
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  display: flex;
`;

const FilterSearchOptions = () => {
  const { t } = useTranslation();
  const width = useWindowWidth();

  return (
    <div>
      {width > DeviceWidths.lg ? (
        <StyledSideBar>
          <Typography variant="h2">{t('dashboard.filter')}</Typography>
          <InstitutionFiltering />
        </StyledSideBar>
      ) : (
        <StyledAccordion>
          <AccordionSummary
            data-testid="expand-filtering-options"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-box-options"
            id="filter-box-options-header">
            <Typography variant="h2">{t('dashboard.filter')}</Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            <InstitutionFiltering />
          </StyledAccordionDetails>
        </StyledAccordion>
      )}
    </div>
  );
};
export default FilterSearchOptions;
