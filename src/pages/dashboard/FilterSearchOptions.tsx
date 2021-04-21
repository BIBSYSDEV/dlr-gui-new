import React, { Dispatch, FC, SetStateAction, useEffect, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors, DeviceWidths } from '../../themes/mainTheme';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import InstitutionFiltering from './InstitutionFiltering';
import { QueryObject } from '../../types/search.types';
import ResourceTypeFiltering from './ResourceTypeFiltering';
import LicenseFiltering from './LicenseFiltering';
import TagFiltering from './TagFiltering';

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
  padding-top: 1.5rem;
  padding-left: 1rem;
  background-color: ${Colors.ExploreResourcesPageOptionFiler};
  width: 17rem;
  display: flex;
  flex-direction: column;
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  display: flex;
  flex-direction: column;
  margin-top: 0;
`;

const StyledTagFilteringWrapper = styled.div`
  margin-top: 1rem;
`;

const StyledAccordionFilterBoxesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 1rem;
  fieldset {
    margin-right: 6rem;
    margin-top: 0;
  }
`;

interface FilterSearchOptionsProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const FilterSearchOptions: FC<FilterSearchOptionsProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const width = useWindowWidth();
  const [numberOfFilters, setNumberOfFilters] = useState(0);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  useEffect(() => {
    const numFilters =
      queryObject.institutions.length +
      queryObject.resourceTypes.length +
      queryObject.licenses.length +
      queryObject.tags.length;
    setNumberOfFilters(numFilters);
    setIsFiltersExpanded(numFilters > 0);
  }, [queryObject]);

  const filterHeader = () => (
    <Typography variant="h2">
      {t('dashboard.filter')}
      {numberOfFilters > 0 && ` (${numberOfFilters} ${t('dashboard.enabled')})`}
    </Typography>
  );

  const handleChange = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  return (
    <div>
      {width >= DeviceWidths.lg ? (
        <StyledSideBar>
          {filterHeader()}
          <StyledTagFilteringWrapper>
            <TagFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
          </StyledTagFilteringWrapper>
          <InstitutionFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
          <ResourceTypeFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
          <LicenseFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
        </StyledSideBar>
      ) : (
        <StyledAccordion expanded={isFiltersExpanded} onChange={handleChange}>
          <AccordionSummary
            data-testid="expand-filtering-options"
            expandIcon={<ExpandMoreIcon />}
            aria-controls="filter-box-options"
            id="filter-box-options-header">
            {filterHeader()}
          </AccordionSummary>
          <StyledAccordionDetails>
            <TagFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
            <StyledAccordionFilterBoxesWrapper>
              <InstitutionFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
              <ResourceTypeFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
              <LicenseFiltering queryObject={queryObject} setQueryObject={setQueryObject} />
            </StyledAccordionFilterBoxesWrapper>
          </StyledAccordionDetails>
        </StyledAccordion>
      )}
    </div>
  );
};
export default FilterSearchOptions;
