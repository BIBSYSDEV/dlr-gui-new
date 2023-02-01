import React from 'react';
import { useTranslation } from 'react-i18next';

import { StyledContentWrapper } from '../../components/styled/Wrappers';
import { Link, List, ListItem } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';
import { PRIVACY_POLICY_LINK_NORWEGIAN } from '../../utils/constants';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <StyledContentWrapper>
      <PageHeader>{t('privacy_policy.heading')}</PageHeader>
      <nav>
        <List>
          <ListItem>
            <Link underline="hover" href={PRIVACY_POLICY_LINK_NORWEGIAN} rel="noopener noreferrer" target="_blank">
              {t('privacy_policy.heading')} - {t('localization.norwegian_bokmaal')}
            </Link>
          </ListItem>
          <ListItem>
            <Link
              underline="hover"
              rel="noopener noreferrer"
              href="https://www.unit.no/dlr/personvernerklaering_eng"
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
