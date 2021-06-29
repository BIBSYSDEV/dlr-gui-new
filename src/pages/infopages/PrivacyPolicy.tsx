import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import Card from '../../components/Card';

import { StyledInformationWrapper } from '../../components/styled/Wrappers';
import { Link, List, ListItem } from '@material-ui/core';

const StyledHeading = styled(Heading)`
  text-align: center;
  padding-bottom: 1rem;
`;

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <StyledInformationWrapper data-testid="privacy-policy" aria-label={t('privacy_policy.heading')}>
      <Card>
        <StyledHeading>{t('privacy_policy.heading')}</StyledHeading>
        <List>
          <ListItem>
            <Link
              href="https://www.unit.no/sites/default/files/media/filer/2021/06/Personvernerkl%C3%A6ring%20-%20DLR.pdf"
              target="_blank">
              {t('privacy_policy.heading')} - {t('localization.norwegian_bokmaal')}
            </Link>
          </ListItem>
          <ListItem>
            <Link
              href="https://www.unit.no/sites/default/files/media/filer/2021/06/Personvernerkl%C3%A6ring%20-%20DLR_en.pdf"
              target="_blank">
              {t('privacy_policy.heading')} - {t('localization.english')}
            </Link>
          </ListItem>
        </List>
      </Card>
    </StyledInformationWrapper>
  );
};

export default PrivacyPolicy;
