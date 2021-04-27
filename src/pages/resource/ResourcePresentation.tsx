import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { Button, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import styled from 'styled-components';
import LicenseCard from '../../components/LicenseCard';
import { API_PATHS, API_URL } from '../../utils/constants';
import { emptyPreview } from '../../types/content.types';
import { Colors } from '../../themes/mainTheme';
import {
  StyledContentWrapperMedium,
  StyledSchemaPart,
  StyledSchemaPartColored,
} from '../../components/styled/Wrappers';
import ResourceMetadata from './ResourceMetadata';
import Thumbnail from '../../components/Thumbnail';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';

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

const StyledFeatureWrapper = styled.div`
  padding: 0.5rem 0;
`;

interface ResourcePresentationProps {
  resource: Resource;
}

const ResourcePresentation: FC<ResourcePresentationProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(emptyPreview);
  const { institution } = useSelector((state: RootState) => state.user);

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
                <StyledFeatureWrapper data-testid="resource-content">
                  <Typography variant="h2">{t('resource.metadata.content')}</Typography>
                  {resource.contents.additionalContent.map((content) => (
                    <>
                      <Thumbnail
                        institution={resource.features.dlr_storage_id ?? institution}
                        alt={content.features.dlr_content}
                        resourceOrContentIdentifier={content.identifier}
                      />
                      <Typography variant="body1" data-testid={`additional-file-content-${content.identifier}`}>
                        {content.features.dlr_content}
                      </Typography>
                      <Button variant="outlined" color="primary">
                        Last ned
                      </Button>
                    </>
                  ))}
                </StyledFeatureWrapper>
              </Grid>
              <Grid item xs={12} md={4}>
                {resource.licenses && resource.licenses.length !== 0 && resource.licenses[0].identifier.length > 0 && (
                  <StyledFeatureWrapper data-testid="resource-license">
                    <Typography gutterBottom variant="h2">
                      {t('resource.metadata.license')}
                    </Typography>
                    {resource.licenses.map(
                      (license) =>
                        license.identifier && (
                          <Card key={license.identifier}>
                            <LicenseCard license={license} />
                          </Card>
                        )
                    )}
                  </StyledFeatureWrapper>
                )}
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
