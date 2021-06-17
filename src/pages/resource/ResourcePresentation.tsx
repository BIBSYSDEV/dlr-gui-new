import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { Colors } from '../../themes/mainTheme';
import {
  StyledContentWrapperMedium,
  StyledSchemaPart,
  StyledSchemaPartColored,
} from '../../components/styled/Wrappers';
import ResourceMetadata from './ResourceMetadata';
import ResourceUsage from './ResourceUsage';
import ResourceContents from './ResourceContents';
import ResourceLicense from './ResourceLicense';
import ContentPreview from '../../components/ContentPreview';
import ResourceActions from './ResourceActions';

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

interface ResourcePresentationProps {
  resource: Resource;
  isPreview?: boolean;
  mainFileBeingUploaded?: boolean;
}

const ResourcePresentation: FC<ResourcePresentationProps> = ({
  resource,
  isPreview = false,
  mainFileBeingUploaded = false,
}) => {
  return (
    resource && (
      <StyledPresentationWrapper>
        <StyledSchemaPart>
          <StyledContentWrapperMedium>
            <PreviewComponentWrapper data-testid="resource-preview">
              <ContentPreview resource={resource} isPreview={isPreview} mainFileBeingUploaded={mainFileBeingUploaded} />
            </PreviewComponentWrapper>
          </StyledContentWrapperMedium>
        </StyledSchemaPart>

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
            <ResourceUsage resource={resource} isPreview={isPreview} />
          </StyledContentWrapperMedium>
        </StyledSchemaPartColored>
        {!isPreview && (
          <StyledSchemaPartColored color={Colors.DLRYellow4}>
            <StyledContentWrapperMedium>
              <ResourceActions resource={resource} />
            </StyledContentWrapperMedium>
          </StyledSchemaPartColored>
        )}
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
