import React, { FC } from 'react';
import { Resource } from '../types/resource.types';
import { ListItem, ListItemText, TypographyTypeMap } from '@material-ui/core';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

const StyledListItemText = styled(ListItemText)`
  padding-left: 16px;
`;

const StyledListItemWrapper = styled.div`
  margin-top: 16px;
`;

const StyledTypography: OverridableComponent<TypographyTypeMap<unknown, 'span'>> = styled(Typography)`
  margin-top: 16px;
`;

interface ResourceListItemButtonProps {
  resource: Resource;
  showSubmitter?: boolean;
  showHandle?: boolean;
  showTimeCreated?: boolean;
}

const ResourceListItemButton: FC<ResourceListItemButtonProps> = ({
  resource,
  showSubmitter = false,
  showHandle = false,
  showTimeCreated = false,
}) => {
  const { t } = useTranslation();
  return (
    <StyledListItemWrapper>
      <ListItem button component="a" href={`/resource/${resource.identifier}`}>
        <Thumbnail
          resourceIdentifier={resource.identifier}
          alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
        />
        <StyledListItemText
          primary={`${resource.features.dlr_title} (${resource.features.dlr_content_type})`}
          secondary={
            <>
              {showSubmitter && resource.features.dlr_submitter_email && (
                <StyledTypography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                  {resource.features.dlr_submitter_email}
                </StyledTypography>
              )}
              {showTimeCreated && resource.features.dlr_time_created && (
                <StyledTypography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                  {resource.features.dlr_time_created}
                </StyledTypography>
              )}
              {resource.features.dlr_identifier_handle && showHandle && (
                <span>
                  {t('handle')}: {resource.features.dlr_identifier_handle}
                </span>
              )}
            </>
          }
        />
      </ListItem>
    </StyledListItemWrapper>
  );
};

export default ResourceListItemButton;
