import React, { FC } from 'react';
import { Resource, UserAuthorizationProfileForResource } from '../../types/resource.types';
import { StyledFeatureWrapper } from '../../components/styled/Wrappers';
import { Button, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Thumbnail from '../../components/Thumbnail';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import styled from 'styled-components';
import { Content } from '../../types/content.types';
import { resourcePath } from '../../utils/constants';

const StyledMetadataWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledGridContainer = styled(Grid)`
  margin-bottom: 2rem;
`;

interface ResourceContentsProps {
  resource: Resource;
  userResourceAuthorization: UserAuthorizationProfileForResource;
}

const ResourceContents: FC<ResourceContentsProps> = ({ resource, userResourceAuthorization }) => {
  const { t } = useTranslation();
  const { institution } = useSelector((state: RootState) => state.user);

  const contentItem = (content: Content) => (
    <StyledGridContainer
      container
      spacing={2}
      key={content.features.dlr_content_identifier}
      data-testid={`file-content-${content.identifier}`}>
      <Grid item>
        <Thumbnail
          data-testid={`file-content-${content.identifier}-content`}
          institution={resource.features.dlr_storage_id ?? institution}
          resourceOrContentIdentifier={content.identifier}
          small={true}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <StyledMetadataWrapper>
          <Typography variant="body1" gutterBottom data-testid={`file-content-${content.identifier}-content`}>
            {content.features.dlr_content_title ?? content.features.dlr_content}
          </Typography>
          <Typography variant="overline" data-testid={`file-content-${content.identifier}-size`}>
            {content.features.dlr_content_size}
          </Typography>
        </StyledMetadataWrapper>
      </Grid>
      <Grid item>
        <Button
          data-testid={`file-content-${content.identifier}-download-button`}
          href={`${resourcePath}/${resource.identifier}/content/${content.identifier}`}
          disabled={!userResourceAuthorization.isConsumer}
          variant="outlined"
          color="primary">
          {t('resource.preview.link_to_content')}
        </Button>
      </Grid>
    </StyledGridContainer>
  );

  return (
    <StyledFeatureWrapper data-testid="resource-content">
      <Typography variant="h2" gutterBottom>
        {t('resource.metadata.content')}
      </Typography>
      {contentItem(resource.contents.masterContent)}
      {resource.contents.additionalContent.map((content) => contentItem(content))}
    </StyledFeatureWrapper>
  );
};

export default ResourceContents;
