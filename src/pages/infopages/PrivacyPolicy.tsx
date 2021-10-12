import React from 'react';
import { useTranslation } from 'react-i18next';

import { StyledContentWrapper } from '../../components/styled/Wrappers';
import { Link, List, ListItem } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <StyledContentWrapper>
      <PageHeader>{t('privacy_policy.heading')}</PageHeader>
      <nav>
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
      </nav>
    </StyledContentWrapper>
  );
};

export default PrivacyPolicy;
