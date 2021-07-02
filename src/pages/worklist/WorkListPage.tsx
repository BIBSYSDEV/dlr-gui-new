import React, { useState } from 'react';
import CuratorOrEditorPrivateRoute from '../../utils/routes/CuratorOrEditorPrivateRoute';
import { StyledContentWrapperLarge } from '../../components/styled/Wrappers';
import { PageHeader } from '../../components/PageHeader';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Grid, Tab, Typography } from '@material-ui/core';
import DOIRequestList from './DOIRequestList';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import ReportList from './ReportList';
import OwnershipRequestList from './OwnershipRequestList';

const StyledWrapper = styled(Grid)`
  padding: 1rem 1rem 2rem 1rem;
  margin-top: 2rem;
`;

const StyledTabPanel = styled(TabPanel)`
  &.MuiTabPanel-root {
    padding: 0;
  }
`;

const DOIRequestTab = 'DoiRequestTab';
const ReportsTab = 'ReportsTab';
const OwnershipRequestTab = 'OwnershipRequestTab';

const WorkListPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [tabValue, setTabValue] = useState(ReportsTab);

  const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    setTabValue(newValue);
  };
  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('work_list.page_title')}</PageHeader>
      {user.institutionAuthorities?.isCurator && (
        <TabContext value={tabValue}>
          <TabList
            variant="scrollable"
            scrollButtons="on"
            textColor="primary"
            indicatorColor="primary"
            onChange={handleTabChange}
            aria-label={t('work_list.aria_label_tabs')}>
            <Tab label={t('work_list.reports')} value={ReportsTab} data-testid={'reports-tab'} />
            <Tab label={t('work_list.doi_request_list')} value={DOIRequestTab} data-testid={'doi-tab'} />
            <Tab label={t('work_list.ownership_requests')} value={OwnershipRequestTab} data-testid={'ownership-tab'} />
          </TabList>

          <StyledTabPanel value={DOIRequestTab}>
            <StyledWrapper>
              <DOIRequestList />
            </StyledWrapper>
          </StyledTabPanel>
          <StyledTabPanel value={OwnershipRequestTab}>
            <StyledWrapper>
              <OwnershipRequestList />
            </StyledWrapper>
          </StyledTabPanel>
          {user.institutionAuthorities?.isEditor && (
            <StyledTabPanel value={ReportsTab}>
              <StyledWrapper>
                <ReportList />
              </StyledWrapper>
            </StyledTabPanel>
          )}
        </TabContext>
      )}
      {user.institutionAuthorities?.isCurator && !user.institutionAuthorities.isEditor && (
        <StyledWrapper>
          <Typography variant="h2" gutterBottom>
            {t('work_list.doi_request_list')}
          </Typography>
          <DOIRequestList />
        </StyledWrapper>
      )}
      {user.institutionAuthorities?.isEditor && !user.institutionAuthorities.isCurator && (
        <StyledWrapper>
          <Typography variant="h2" gutterBottom>
            {t('work_list.reports')}
          </Typography>
          <ReportList />
        </StyledWrapper>
      )}
    </StyledContentWrapperLarge>
  );
};

export default CuratorOrEditorPrivateRoute(WorkListPage);
