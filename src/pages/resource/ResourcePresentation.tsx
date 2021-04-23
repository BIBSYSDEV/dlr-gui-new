import React, { FC, useEffect, useState } from 'react';
import { Resource } from '../../types/resource.types';
import { Chip, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import styled from 'styled-components';
import LicenseCard from '../../components/LicenseCard';
import { API_PATHS, API_URL } from '../../utils/constants';
import { emptyPreview } from '../../types/content.types';
import { Colors } from '../../themes/mainTheme';
import { format } from 'date-fns';
import {
  StyledContentWrapperMedium,
  StyledSchemaPart,
  StyledSchemaPartColored,
} from '../../components/styled/Wrappers';

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

const StyledChip: any = styled(Chip)`
  margin-right: 0.5rem;
  margin-top: 0.5rem;
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
        {
          //TODO: tittel skal vises frem forskjellig fra preview og "ekte" presentasjon
          //TODO: La den ta opp plassen den får servert?
          //TODO: enten wrappet inn i rediger ressurs eller i ResourcePage
        }

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

        <StyledSchemaPartColored color={Colors.DLRYellow1}>
          <StyledContentWrapperMedium>
            {resource.creators && resource.creators.length !== 0 && (
              <StyledFeatureWrapper data-testid="resource-creators">
                <Typography variant="h6">
                  {resource.creators.map((creator) => creator.features.dlr_creator_name).join(', ')}
                </Typography>
              </StyledFeatureWrapper>
            )}

            {resource.contributors && resource.contributors.length !== 0 && (
              <StyledFeatureWrapper data-testid="resource-contributors">
                <Typography variant="subtitle1">
                  {resource.contributors.map((contributor) => contributor.features.dlr_contributor_name).join(', ')}
                </Typography>
              </StyledFeatureWrapper>
            )}

            {resource.features.dlr_time_published && (
              <StyledFeatureWrapper data-testid="resource-time-published">
                <StyledCaption variant="caption">{t('resource.metadata.published')}</StyledCaption>
                <Typography variant="body1">
                  {format(new Date(resource.features.dlr_time_published), 'dd.MM.yyyy')}
                </Typography>
              </StyledFeatureWrapper>
            )}

            {resource.features.dlr_time_created && (
              <StyledFeatureWrapper data-testid="resource-time-created">
                <StyledCaption variant="caption">{t('resource.metadata.created')}</StyledCaption>
                <Typography variant="body1">
                  {format(new Date(resource.features.dlr_time_created), 'dd.MM.yyyy')}
                </Typography>
              </StyledFeatureWrapper>
            )}

            {resource.features.dlr_submitter_email && (
              <StyledFeatureWrapper data-testid="resource-submitter">
                <StyledCaption variant="caption">{t('resource.metadata.owner')}</StyledCaption>
                <Typography variant="body1">{resource.features.dlr_submitter_email}</Typography>
              </StyledFeatureWrapper>
            )}

            {resource.features.dlr_description && (
              <StyledFeatureWrapper data-testid="resource-description">
                <StyledCaption variant="caption">{t('resource.metadata.description')}</StyledCaption>
                <Typography variant="body1">{resource.features.dlr_description}</Typography>
              </StyledFeatureWrapper>
            )}

            {resource.tags && resource.tags.length !== 0 && (
              <StyledFeatureWrapper data-testid="resource-tags">
                <StyledCaption variant="caption">{t('resource.metadata.tags')}</StyledCaption>
                {resource.tags.map((tag, index) => (
                  <StyledChip key={index} size="medium" label={tag} />
                ))}
              </StyledFeatureWrapper>
            )}
          </StyledContentWrapperMedium>
        </StyledSchemaPartColored>

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
