import React from 'react';
import { useTranslation } from 'react-i18next';
import PrivateRoute from '../../utils/routes/PrivateRoute';
//import ErrorBanner from '../../components/ErrorBanner';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';

const AdminPage = () => {
  const { t } = useTranslation();

  return (
    <StyledContentWrapperLarge>
      {/*{loadingError && <ErrorBanner userNeedsToBeLoggedIn={true} error={loadingError} />}*/}
      <PageHeader>{t('Administrator')}</PageHeader>
    </StyledContentWrapperLarge>
  );
};

export default PrivateRoute(AdminPage);
