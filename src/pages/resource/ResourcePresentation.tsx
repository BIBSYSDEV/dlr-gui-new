import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { API_PATHS, API_URL } from '../../utils/constants';
import { emptyPreview } from '../../types/content.types';
import { Colors } from '../../themes/mainTheme';
import {
  StyledContentWrapperMedium,
  StyledSchemaPart,
  StyledSchemaPartColored,
} from '../../components/styled/Wrappers';
import ResourceMetadata from './ResourceMetadata';
import ResourceContents from './ResourceContents';
import ResourceLicense from './ResourceLicense';

const PreviewComponentWrapper = styled.div`
  margin: 1rem 0;
  height: 15rem;
  max-height: 15rem;
  max-width: 100%;
  border: 1px solid ${Colors.DescriptionPageGradientColor1};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledPresentationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

interface ResourcePresentationProps {
  resource: Resource;
}

const ResourcePresentation: FC<ResourcePresentationProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(emptyPreview);

  useEffect(() => {
    if (resource.contents) {
      const masterContent = resource.contents.masterContent;
      if (masterContent) {
        const type = masterContent.features.dlr_content_content_type ?? '';
        setPreview({
          type,
          url: `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${masterContent.identifier}/delivery?jwt=${localStorage.token}`,
        });
      }
    }
  }, [resource.contents]);

  return (
    resource && (
      <StyledPresentationWrapper>
        {preview && (
          <StyledSchemaPart>
            <StyledContentWrapperMedium>
              <PreviewComponentWrapper data-testid="resource-preview">
                {/*<ContentPreview preview={preview} />*/}
                {t('common.preview_not_implemented')}
              </PreviewComponentWrapper>
            </StyledContentWrapperMedium>
          </StyledSchemaPart>
        )}
        <ResourceMetadata resource={resource} />
        <StyledSchemaPartColored color={Colors.DLRYellow2}>
          <StyledContentWrapperMedium>
            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <ResourceContents resource={resource} />
              </Grid>
              <Grid item xs={12} md={4}>
                <ResourceLicense resource={resource} />
              </Grid>
            </Grid>
          </StyledContentWrapperMedium>
        </StyledSchemaPartColored>
        <StyledSchemaPartColored color={Colors.DLRYellow3}>
          <StyledContentWrapperMedium>
            {/*<Typography variant="h2">Bruk</Typography>*/}
            {/*<Typography>Kommer snart</Typography>*/}
          </StyledContentWrapperMedium>
        </StyledSchemaPartColored>
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
