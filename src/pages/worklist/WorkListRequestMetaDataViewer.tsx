import React, { FC, useState } from 'react';
import { Button, Grid, Link, Typography } from '@material-ui/core';
import { WorklistRequest } from '../../types/Worklist.types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface WorkListRequestMetaDataViewerProps {
  workListRequest: WorklistRequest;
}

const WorkListRequestMetaDataViewer: FC<WorkListRequestMetaDataViewerProps> = ({ workListRequest }) => {
  const { t } = useTranslation();
  const [showLongText, setShowLongText] = useState(false);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3">
          <Link
            href={`/resources/${workListRequest.resourceIdentifier}`}
            data-testid={`request-item-title-${workListRequest.resourceIdentifier}`}>
            {workListRequest.resource?.features.dlr_title ?? workListRequest.resourceIdentifier}
          </Link>
        </Typography>
      </Grid>
      {!workListRequest.resource?.features.dlr_title && (
        <Grid item xs={12}>
          <Typography>{t('work_list.possible_deleted')}</Typography>
        </Grid>
      )}
      <Grid item xs={12} sm={6}>
        <Typography variant="caption">{t('work_list.submitter')}</Typography>
        <Typography data-testid={`request-item-submitter-${workListRequest.resourceIdentifier}`}>
          {workListRequest.submitter}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="caption">{t('work_list.submitted')}</Typography>
        <Typography data-testid={`request-item-submitted-${workListRequest.resourceIdentifier}`}>
          {format(new Date(workListRequest.submittedDate), 'dd.MM.yyyy')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="caption">{t('work_list.comment')}</Typography>
        {workListRequest.description.length >= 150 && !showLongText && (
          <>
            <Typography data-testid={`request-item-comment-short-${workListRequest.resourceIdentifier}`}>
              {workListRequest.description.slice(0, 150)}...
            </Typography>
            <Button
              data-testid={`request-item-comment-read-more-button-${workListRequest.resourceIdentifier}`}
              color="primary"
              onClick={() => setShowLongText(true)}>
              {t('work_list.read_more')}
            </Button>
          </>
        )}
        {workListRequest.description.length >= 150 && showLongText && (
          <>
            <Typography data-testid={`request-item-comment-long-${workListRequest.resourceIdentifier}`}>
              {workListRequest.description}
            </Typography>
            <Button aria-label={t('work_list.shorten_comments')} color="primary" onClick={() => setShowLongText(false)}>
              {t('work_list.hide')}
            </Button>
          </>
        )}
        {workListRequest.description.length < 150 && (
          <Typography data-testid={`request-item-comment-long-${workListRequest.resourceIdentifier}`}>
            {workListRequest.description}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default WorkListRequestMetaDataViewer;
