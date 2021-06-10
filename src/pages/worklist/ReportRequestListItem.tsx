import React, { FC } from 'react';
import { WorklistRequest } from '../../types/Worklist.types';
import styled from 'styled-components';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { Button, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import WorkListRequestMetaDataViewer from './WorkListRequestMetaDataViewer';
import BlockIcon from '@material-ui/icons/Block';

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

interface ReportListItem {
  reportWorkListRequest: WorklistRequest;
  setWorkListReport: React.Dispatch<React.SetStateAction<WorklistRequest[]>>;
}

const ReportRequestListItem: FC<ReportListItem> = ({ reportWorkListRequest, setWorkListReport }) => {
  return (
    <StyledListItemWrapper backgroundColor={Colors.DLRColdGreen1}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <WorkListRequestMetaDataViewer workListRequest={reportWorkListRequest} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                href={`/editresource/${reportWorkListRequest.resourceIdentifier}`}
                startIcon={<EditIcon />}
                variant="outlined"
                color="primary">
                Rediger ressurs
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button startIcon={<DeleteIcon />} variant="outlined" color="secondary">
                Slett ressurs
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button startIcon={<BlockIcon />} variant="outlined" color="secondary">
                Slett rapportering
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </StyledListItemWrapper>
  );
};

export default ReportRequestListItem;
