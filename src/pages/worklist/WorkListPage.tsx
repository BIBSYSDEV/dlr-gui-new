import React from 'react';
import CuratorOrEditorPrivateRoute from '../../utils/routes/CuratorOrEditorPrivateRoute';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import { useTranslation } from 'react-i18next';

const WorkListPage = () => {
  const { t } = useTranslation();
  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('work_list.page_title')}</PageHeader>
    </StyledContentWrapperLarge>
  );
};

export default CuratorOrEditorPrivateRoute(WorkListPage);
