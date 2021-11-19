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
import { getMyUserAuthorizationProfileForResource, getResourceDefaultContent } from '../../api/resourceApi';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { Content, SupportedFileTypes } from '../../types/content.types';
import { determinePresentationMode } from '../../utils/mime_type_utils';

const DefaultPreviewComponentWrapper = styled.div`
  margin: 1rem 0;
  height: 26rem;
  max-height: 26rem;
  max-width: 100%;
  border: 1px solid ${Colors.DescriptionPageGradientColor1};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransistorPreviewComponentWrapper = styled.div`
  margin: 1rem 0;
  height: 182px;
  max-height: 182px;
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
  const [defaultContent, setDefaultContent] = useState<Content | null>(null);
  const [contentUnavailable, setContentUnavailable] = useState(false);
  const [presentationMode, setPresentationMode] = useState<string>(
    determinePresentationMode(resource.contents.masterContent)
  );
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

    const fetchDefaultContent = async () => {
      let defaultContent: Content | undefined = undefined;
      try {
        defaultContent = (await getResourceDefaultContent(resource.identifier)).data;
        setDefaultContent(defaultContent);
        setPresentationMode(determinePresentationMode(defaultContent));
      } catch (error) {
        setContentUnavailable(true);
      }
    };
    fetchDefaultContent();
  }, [resource.identifier, setCanEditResource, setDefaultContent, setPresentationMode]);

  return (
    resource && (
      <StyledPresentationWrapper>
        <StyledSchemaPart>
          <StyledContentWrapperMedium>
            {presentationMode === SupportedFileTypes.Transistor ? (
              <>
                <TransistorPreviewComponentWrapper data-testid="resource-preview">
                  <ContentPreview
                    resource={resource}
                    isPreview={isPreview}
                    mainFileBeingUploaded={mainFileBeingUploaded}
                  />
                </TransistorPreviewComponentWrapper>
              </>
            ) : (
              <>
                <DefaultPreviewComponentWrapper data-testid="resource-preview">
                  <ContentPreview
                    resource={resource}
                    isPreview={isPreview}
                    mainFileBeingUploaded={mainFileBeingUploaded}
                  />
                </DefaultPreviewComponentWrapper>
              </>
            )}
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
            <ResourceUsage resource={resource} isPreview={isPreview} presentationMode={presentationMode} />
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
