import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { StyledFeatureWrapper } from '../../components/styled/Wrappers';
import { Button, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Thumbnail from '../../components/Thumbnail';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import styled from 'styled-components';
import { Content } from '../../types/content.types';
import { API_PATHS, API_URL } from '../../utils/constants';

const StyledMetadataWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledGridContainer = styled(Grid)`
  margin-bottom: 2rem;
`;

interface ResourceContentsProps {
  resource: Resource;
}

const ResourceContents: FC<ResourceContentsProps> = ({ resource }) => {
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
          alt={content.features.dlr_content}
          resourceOrContentIdentifier={content.identifier}
          small={true}
        />
      </Grid>
      <Grid item xs={12} sm={5}>
        <StyledMetadataWrapper>
          <Typography variant="body1" gutterBottom data-testid={`file-content-${content.identifier}-content`}>
            {content.features.dlr_content}
          </Typography>
          <Typography variant="overline" data-testid={`file-content-${content.identifier}-size`}>
            {content.features.dlr_content_size}
          </Typography>
        </StyledMetadataWrapper>
      </Grid>
      <Grid item>
        <Button
          data-testid={`file-content-${content.identifier}-download-button`}
          variant="outlined"
          color="primary"
          download={content.features.dlr_content}
          target="_blank"
          rel="noopener norefferer"
          href={`${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${content.identifier}/delivery?jwt=${localStorage.token}`}>
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
