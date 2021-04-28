import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { Typography } from '@material-ui/core';
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

const StyledCaption = styled(Typography)`
  display: block;
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
            {resource.licenses && resource.licenses.length !== 0 && resource.licenses[0].identifier.length > 0 && (
              <StyledFeatureWrapper data-testid="resource-license">
                <StyledCaption variant="caption">{t('resource.metadata.license')}</StyledCaption>
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
          </StyledContentWrapperMedium>
        </StyledSchemaPartColored>
        <StyledSchemaPartColored color={Colors.DLRYellow3}>
          <StyledContentWrapperMedium>
            <Typography variant="h3">Bruk</Typography>
            <Typography>Kommer snart</Typography>
          </StyledContentWrapperMedium>
        </StyledSchemaPartColored>
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
