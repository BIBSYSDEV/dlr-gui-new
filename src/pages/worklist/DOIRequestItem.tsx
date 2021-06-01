import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { WorklistDOIRequest } from '../../types/Worklist.types';
import { Button, CircularProgress, Grid, Link, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface Props {
  backgroundColor: string;
}

const StyledListItemWrapper: any = styled.li<Props>`
  width: 100%;
  max-width: ${StyleWidths.width5};
  background-color: ${(props: any) => props.backgroundColor || Colors.UnitTurquoise_20percent};
  padding: 1rem;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

interface DOIRequestItemProps {
  workListRequestDOI: WorklistDOIRequest;
  deleteRequest: (ResourceIdentifier: string) => void;
  createDOI: (ResourceIdentifier: string) => void;
}

const DOIRequestItem: FC<DOIRequestItemProps> = ({ workListRequestDOI, deleteRequest, createDOI }) => {
  const [isBusy, setIsBusy] = useState(false);
  const [showLongText, setShowLongText] = useState(false);
  const { t } = useTranslation();
  return (
    <StyledListItemWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3">
                <Link href={`/resource/${workListRequestDOI.resourceIdentifier}`}>
                  {workListRequestDOI.resource?.features.dlr_title ?? workListRequestDOI.resourceIdentifier}
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">{t('work_list.submitter')}</Typography>
              <Typography>{workListRequestDOI.submitter}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">{t('work_list.submitted')}</Typography>
              <Typography>{format(new Date(workListRequestDOI.submittedDate), 'dd.MM.yyyy')}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption">{t('work_list.comment')}</Typography>
              {workListRequestDOI.description.length >= 150 && !showLongText && (
                <>
                  <Typography>{workListRequestDOI.description.slice(0, 150)}...</Typography>
                  <Button color="primary" onClick={() => setShowLongText(true)}>
                    {t('work_list.read_more')}
                  </Button>
                </>
              )}
              {workListRequestDOI.description.length >= 150 && showLongText && (
                <>
                  <Typography>{workListRequestDOI.description}</Typography>
                  <Button color="primary" onClick={() => setShowLongText(false)}>
                    {t('work_list.hide')}
                  </Button>
                </>
              )}
              {workListRequestDOI.description.length < 150 && <Typography>{workListRequestDOI.description}</Typography>}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setIsBusy(true);
              createDOI(workListRequestDOI.resourceIdentifier);
            }}>
            {t('work_list.create_doi')}
          </Button>
        </Grid>

        <Grid item>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="secondary"
            onClick={() => {
              setIsBusy(true);
              deleteRequest(workListRequestDOI.resourceIdentifier);
            }}>
            {t('work_list.delete_request')}
          </Button>
        </Grid>
        {isBusy && <CircularProgress size="1rem" />}
      </Grid>
    </StyledListItemWrapper>
  );
};

export default DOIRequestItem;
