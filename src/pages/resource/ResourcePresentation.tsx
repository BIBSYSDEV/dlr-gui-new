import React, { FC, useEffect, useState } from 'react';
import {
  emptyUserAuthorizationProfileForResource,
  Resource,
  UserAuthorizationProfileForResource,
} from '../../types/resource.types';
import { Grid } from '@mui/material';
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
import { getMyUserAuthorizationProfileForResource } from '../../api/resourceApi';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

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
  setCanEditResource?: (status: boolean) => void;
}

const ResourcePresentation: FC<ResourcePresentationProps> = ({
  resource,
  isPreview = false,
  mainFileBeingUploaded = false,
  setCanEditResource,
}) => {
  const [userResourceAuthorization, setUserResourceAuthorization] = useState<UserAuthorizationProfileForResource>(
    emptyUserAuthorizationProfileForResource
  );
  const [errorLoadingAuthorization, setErrorLoadingAuthorization] = useState<Error | AxiosError>();

  useEffect(() => {
    const fetchUserResourceAuthorization = async () => {
      try {
        setErrorLoadingAuthorization(undefined);
        const userResourceAuthorizationResponse = await getMyUserAuthorizationProfileForResource(resource.identifier);
        setUserResourceAuthorization(userResourceAuthorizationResponse);
        if (setCanEditResource) {
          setCanEditResource(
            userResourceAuthorizationResponse.isCurator ||
              userResourceAuthorizationResponse.isEditor ||
              userResourceAuthorizationResponse.isOwner ||
              userResourceAuthorizationResponse.isAdmin
          );
        }
      } catch (error) {
        setErrorLoadingAuthorization(handlePotentialAxiosError(error));
      }
    };
    fetchUserResourceAuthorization();
  }, [resource.identifier, setCanEditResource]);

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

        <ResourceMetadata resource={resource} isPreview={isPreview} />

        <StyledSchemaPartColored color={Colors.DLRYellow2}>
          <StyledContentWrapperMedium>
            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <ResourceContents userResourceAuthorization={userResourceAuthorization} resource={resource} />
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
              <ResourceActions
                userResourceAuthorization={userResourceAuthorization}
                errorLoadingAuthorization={errorLoadingAuthorization}
                resource={resource}
              />
            </StyledContentWrapperMedium>
          </StyledSchemaPartColored>
        )}
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
