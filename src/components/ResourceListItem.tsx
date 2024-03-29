import React, { FC, useState } from 'react';
import { Resource } from '../types/resource.types';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import ConfirmDeleteDialog from './ConfirmDeleteDialog.';
import DeleteIcon from '@mui/icons-material/Delete';
import { Colors, StyleWidths } from '../themes/mainTheme';
import { format } from 'date-fns';
import { Link } from '@mui/material';
import ResourceTypeInfo from './ResourceTypeInfo';
import { resourcePath } from '../utils/constants';
import { generateNewUrlAndRetainLMSParams } from '../utils/lmsService';

interface Props {
  backgroundColor: string;
}

const StyledListItemWrapper: any = styled.li<Props>`
  width: 100%;
  max-width: ${StyleWidths.width5};
  background-color: ${(props: any) => props.backgroundColor || Colors.UnitTurquoise_20percent};
  padding: 1rem 1rem 0 1rem;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const StyledListItem: any = styled.div`
  width: 100%;
  max-width: ${StyleWidths.width4};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledMetaDataColumn = styled.div`
  flex: 1;
  min-width: 18rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
`;

const StyledActions: any = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const StyledThumbnailWrapper = styled.div`
  margin-bottom: 1rem;
  margin-right: 1rem;
`;

const StyledActionButton = styled(Button)`
  height: 2.25rem;
  align-self: flex-start;
  margin-left: 1.5rem;
`;

const StyledResourceTypeInfoWrapper = styled.div`
  background: ${Colors.Brighten50Percent};
  border: 1px solid ${Colors.Darken10Percent};
`;

interface ResourceListItemProps {
  resource: Resource;
  handleDelete?: () => void;
  fallbackInstitution?: string;
  backgroundColor?: string;
}

const ResourceListItem: FC<ResourceListItemProps> = ({
  resource,
  handleDelete,
  fallbackInstitution = '',
  backgroundColor,
}) => {
  const { t } = useTranslation();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <StyledListItemWrapper backgroundColor={backgroundColor}>
      <StyledListItem data-testid={`list-item-resources-${resource.identifier}`}>
        <StyledThumbnailWrapper>
          {resource.features.dlr_status_published ? (
            <Link
              tabIndex={-1}
              aria-hidden={true}
              data-testid={`thumbnail-link-to-resource-${resource.identifier}`}
              href={generateNewUrlAndRetainLMSParams(`${resourcePath}/${resource.identifier}`)}>
              <Thumbnail
                institution={resource.features.dlr_storage_id ?? fallbackInstitution}
                resourceOrContentIdentifier={resource.identifier}
              />
            </Link>
          ) : (
            <Thumbnail
              institution={resource.features.dlr_storage_id ?? fallbackInstitution}
              resourceOrContentIdentifier={resource.identifier}
            />
          )}

          <StyledResourceTypeInfoWrapper>
            <ResourceTypeInfo resource={resource} />
          </StyledResourceTypeInfoWrapper>
        </StyledThumbnailWrapper>
        <StyledMetaDataColumn>
          <Typography gutterBottom component="h2" variant="h4">
            {resource.features.dlr_status_published ? (
              <Link
                underline="hover"
                href={generateNewUrlAndRetainLMSParams(
                  `${resourcePath}/${resource.identifier}`
                )}>{`${resource.features.dlr_title}`}</Link>
            ) : (
              resource.features.dlr_title
            )}
          </Typography>
          {resource.features.dlr_status_published
            ? resource.features.dlr_time_published && (
                <Typography variant="body1" color="textPrimary">
                  {t('resource.metadata.published')}:{' '}
                  {format(new Date(resource.features.dlr_time_published), 'dd.MM.yyyy')}
                </Typography>
              )
            : resource.features.dlr_time_created && (
                <Typography variant="body1" color="textPrimary">
                  {t('resource.metadata.created')}: {format(new Date(resource.features.dlr_time_created), 'dd.MM.yyyy')}
                </Typography>
              )}

          {resource.features.dlr_access && (
            <Typography variant="body1">{t(`resource.access_types.${resource.features.dlr_access}`)}</Typography>
          )}
        </StyledMetaDataColumn>
        <StyledActions>
          <StyledActionButton
            data-testid={`edit-resource-button-${resource.identifier}`}
            color="primary"
            size="large"
            variant="outlined"
            href={generateNewUrlAndRetainLMSParams(`/editresource/${resource.identifier}`)}>
            {t('common.edit')}
          </StyledActionButton>
          {handleDelete && (
            <>
              <StyledActionButton
                data-testid={`delete-my-resources-${resource.identifier}`}
                color="secondary"
                startIcon={<DeleteIcon fontSize="large" />}
                size="large"
                variant="outlined"
                onClick={() => setShowConfirmDialog(true)}>
                {t('common.delete')}
              </StyledActionButton>
              <ConfirmDeleteDialog
                data-testid={`delete-my-resource-confirm-dialog-${resource.identifier}`}
                resourceIdentifier={resource.identifier}
                open={showConfirmDialog}
                resourceTitle={resource.features.dlr_title}
                confirmedDelete={() => {
                  setShowConfirmDialog(false);
                  handleDelete();
                }}
                abortDelete={() => {
                  setShowConfirmDialog(false);
                }}
              />
            </>
          )}
        </StyledActions>
      </StyledListItem>
    </StyledListItemWrapper>
  );
};

export default ResourceListItem;
