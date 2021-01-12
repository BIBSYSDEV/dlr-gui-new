import React, { FC } from 'react';
import { Resource } from '../types/resource.types';
import { ExtendButtonBaseTypeMap, ListItem, ListItemText, ListItemTypeMap } from '@material-ui/core';
import Thumbnail from './Thumbnail';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { OverridableComponent, OverrideProps } from '@material-ui/core/OverridableComponent';

const StyledListItemText = styled(ListItemText)`
  padding-left: 16px;
`;

const StyledListItem: OverridableComponent<ListItemTypeMap<{ button?: false }, 'li'>> &
  ((
    props: { href: string } & OverrideProps<ExtendButtonBaseTypeMap<ListItemTypeMap<{ button: true }, 'div'>>, 'a'>
  ) => JSX.Element) &
  OverridableComponent<ExtendButtonBaseTypeMap<ListItemTypeMap<{ button: true }, 'div'>>> = styled(ListItem)`
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
    <StyledListItem button component="a" href={`/resource/${resource.identifier}`}>
      <Thumbnail
        resourceIdentifier={resource.identifier}
        alt={resource.features.dlr_title ?? t('resource.metadata.resource')}
      />
      <StyledListItemText
        primary={`${resource.features.dlr_title} (${resource.features.dlr_content_type})`}
        secondary={
          <>
            {showSubmitter && (
              <Typography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                {resource.features.dlr_submitter_email}
              </Typography>
            )}
            {showTimeCreated && (
              <Typography style={{ display: 'block' }} component="span" variant="body2" color="textPrimary">
                {resource.features.dlr_time_created}
              </Typography>
            )}
            {resource.features.dlr_identifier_handle && showHandle && (
              <span>
                {t('handle')}: {resource.features.dlr_identifier_handle}
              </span>
            )}
          </>
        }
      />
    </StyledListItem>
  );
};

export default ResourceListItemButton;
