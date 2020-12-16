import React, { FC } from 'react';
import { License } from '../types/license.types';
import List from '@material-ui/core/List';
import { Accordion, AccordionDetails, ListItem, Typography } from '@material-ui/core';
import LicenseCard from './LicenseCard';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface LicenseListProps {
  licenseList: License[];
  selectedLicenseIndex: number;
}
const ariaControlIdBase = 'lisence-list';

const StyledWrapper = styled.div`
  margin-top: 1rem;
`;

const LicenseList: FC<LicenseListProps> = ({ licenseList, selectedLicenseIndex }) => {
  const { t } = useTranslation();
  return (
    <>
      {selectedLicenseIndex >= 0 && selectedLicenseIndex < licenseList.length && (
        <StyledWrapper>
          <Typography variant="h6">{t('license.selected_license')}:</Typography>
          <LicenseCard license={licenseList[selectedLicenseIndex]} />
        </StyledWrapper>
      )}
      <StyledWrapper>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={`${ariaControlIdBase}-header`}
            aria-controls={`${ariaControlIdBase}-content`}>
            {selectedLicenseIndex >= 0 && selectedLicenseIndex < licenseList.length && (
              <Typography variant="button"> {t('license.other_options')}</Typography>
            )}
            {(selectedLicenseIndex < 0 || selectedLicenseIndex >= licenseList.length) && (
              <Typography variant="button">{t('license.possible_options')}</Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {licenseList.map((license, index) => {
                if (index !== selectedLicenseIndex) {
                  return (
                    <ListItem key={license.identifier}>
                      <LicenseCard license={license} />
                    </ListItem>
                  );
                } else return <></>;
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </StyledWrapper>
    </>
  );
};
export default LicenseList;
