import React, { useEffect, useRef, useState } from 'react';
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
import { WorklistRequest } from '../../types/Worklist.types';
import { getWorkListItemDOI, getWorkListItemsOwnership, getWorkListReports } from '../../api/workListApi';
import {
  filterWorkListWithoutResources,
  getWorkListWithResourceAndOwnersAttached,
  getWorkListWithResourceAttached,
  sortWorkListByDate,
} from '../../utils/workList';

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
  const [isLoadingDOI, setIsLoadingDOI] = useState(false);
  const [loadingErrorDOI, setLoadingErrorDOI] = useState<Error>();
  const [workListDOIs, setWorkListDOIs] = useState<WorklistRequest[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [loadingErrorReports, setLoadingErrorReports] = useState<Error>();
  const [workListReports, setWorkListReports] = useState<WorklistRequest[]>([]);
  const [isLoadingOwnership, setIsLoadingOwnership] = useState(false);
  const [loadingOwnershipError, setLoadingOwnershipError] = useState<Error>();
  const [workListOwnership, setWorkListOwnership] = useState<WorklistRequest[]>([]);
  const mountedRef = useRef(true);

  const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchDOis = async () => {
      try {
        if (!mountedRef.current) return null;
        setIsLoadingDOI(true);
        setLoadingErrorDOI(undefined);
        const workListDoiResponse = await getWorkListItemDOI();
        const workListTotal = await getWorkListWithResourceAttached(workListDoiResponse.data);
        if (!mountedRef.current) return null;
        setWorkListDOIs(sortWorkListByDate(filterWorkListWithoutResources(workListTotal)));
      } catch (error) {
        if (!mountedRef.current) return null;
        setLoadingErrorReports(error);
      } finally {
        if (mountedRef.current) {
          setIsLoadingDOI(false);
        }
      }
    };
    const fetchReports = async () => {
      try {
        if (!mountedRef.current) return null;
        setIsLoadingReports(true);
        setLoadingErrorReports(undefined);
        const workListReportResponse = await getWorkListReports();
        //does not filter out worklist items without resource in case of complaints of harassment or GDPR violations
        const workListTotal = await getWorkListWithResourceAttached(workListReportResponse.data);
        if (!mountedRef.current) return null;
        setWorkListReports(sortWorkListByDate(workListTotal));
      } catch (error) {
        if (!mountedRef.current) return null;
        setLoadingErrorReports(error);
      } finally {
        if (mountedRef.current) {
          setIsLoadingReports(false);
        }
      }
    };
    const fetchOwnerships = async () => {
      try {
        if (!mountedRef.current) return null;
        setIsLoadingOwnership(true);
        setLoadingOwnershipError(undefined);
        const workListResponse = await getWorkListItemsOwnership();
        const workListTotal = await getWorkListWithResourceAndOwnersAttached(workListResponse.data);
        if (!mountedRef.current) return null;
        setWorkListOwnership(sortWorkListByDate(filterWorkListWithoutResources(workListTotal)));
      } catch (error) {
        if (!mountedRef.current) return null;
        setLoadingOwnershipError(error);
      } finally {
        if (mountedRef.current) {
          setIsLoadingOwnership(false);
        }
      }
    };

    fetchDOis();
    fetchReports();
    fetchOwnerships();
  }, []);

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
              <DOIRequestList
                setWorkListDoi={setWorkListDOIs}
                workListDOI={workListDOIs}
                isLoading={isLoadingDOI}
                loadingError={loadingErrorDOI}
              />
            </StyledWrapper>
          </StyledTabPanel>
          <StyledTabPanel value={OwnershipRequestTab}>
            <StyledWrapper>
              <OwnershipRequestList
                setWorkListOwnership={setWorkListOwnership}
                workListOwnership={workListOwnership}
                loadingError={loadingOwnershipError}
                isLoading={isLoadingOwnership}
              />
            </StyledWrapper>
          </StyledTabPanel>
          {user.institutionAuthorities?.isEditor && (
            <StyledTabPanel value={ReportsTab}>
              <StyledWrapper>
                <ReportList
                  setWorkListReport={setWorkListReports}
                  workListReport={workListReports}
                  isLoading={isLoadingReports}
                  loadingError={loadingErrorReports}
                />
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
          <DOIRequestList
            setWorkListDoi={setWorkListDOIs}
            workListDOI={workListDOIs}
            isLoading={isLoadingDOI}
            loadingError={loadingErrorDOI}
          />
        </StyledWrapper>
      )}
      {user.institutionAuthorities?.isEditor && !user.institutionAuthorities.isCurator && (
        <StyledWrapper>
          <Typography variant="h2" gutterBottom>
            {t('work_list.reports')}
          </Typography>
          <ReportList
            setWorkListReport={setWorkListReports}
            workListReport={workListReports}
            isLoading={isLoadingReports}
            loadingError={loadingErrorReports}
          />
        </StyledWrapper>
      )}
    </StyledContentWrapperLarge>
  );
};

export default CuratorOrEditorPrivateRoute(WorkListPage);
