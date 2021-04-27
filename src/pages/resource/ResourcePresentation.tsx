import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import styled from 'styled-components';
import LicenseCard from '../../components/LicenseCard';
import { Colors } from '../../themes/mainTheme';
import {
  StyledContentWrapperMedium,
  StyledSchemaPart,
  StyledSchemaPartColored,
} from '../../components/styled/Wrappers';
import ResourceMetadata from './ResourceMetadata';
//import ContentPreview from '../../components/ContentPreview';

const PreviewComponentWrapper = styled.div`
  margin: 1rem 0;
  height: 26rem;
  max-height: 26rem;
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

  return (
    resource && (
      <StyledPresentationWrapper>
        <StyledSchemaPart>
          <StyledContentWrapperMedium>
            <PreviewComponentWrapper data-testid="resource-preview">
              {/* <ContentPreview resource={resource} /> */}
            </PreviewComponentWrapper>
          </StyledContentWrapperMedium>
        </StyledSchemaPart>

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
            <Typography variant="h3">{t('common.usage')}</Typography>
          </StyledContentWrapperMedium>
        </StyledSchemaPartColored>
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
