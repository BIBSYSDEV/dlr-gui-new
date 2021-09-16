import React, { FC, useState } from 'react';
import { Resource, UserAuthorizationProfileForResource } from '../../types/resource.types';
import { StyledFeatureWrapper } from '../../components/styled/Wrappers';
import { Button, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Thumbnail from '../../components/Thumbnail';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import styled from 'styled-components';
import { Content } from '../../types/content.types';
import { getContentPresentationData } from '../../api/resourceApi';
import ErrorBanner from '../../components/ErrorBanner';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

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
  const [fetchingUrlError, setFetchingUrlError] = useState<Error | AxiosError>();

  const handleDownloadClick = async (contentIdentifier: string) => {
    try {
      setFetchingUrlError(undefined);
      const contentResponse = await getContentPresentationData(contentIdentifier); //aquire 10 seconds valid JWT token for downlaod
      if (contentResponse.data.features.dlr_content_url) {
        window.open(contentResponse.data.features.dlr_content_url);
      } else {
        setFetchingUrlError(new Error('no url found'));
      }
    } catch (error) {
      setFetchingUrlError(handlePotentialAxiosError(error));
    }
  };

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
          onClick={() => handleDownloadClick(content.identifier)}
          data-testid={`file-content-${content.identifier}-download-button`}
          variant="outlined"
          color="primary"
          disabled={!userResourceAuthorization.isConsumer}>
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
      {fetchingUrlError && <ErrorBanner />}
    </StyledFeatureWrapper>
  );
};

export default ResourceContents;
