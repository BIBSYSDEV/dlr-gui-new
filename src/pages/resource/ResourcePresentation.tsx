/*eslint prefer-const: */
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
import {
  getContentPresentationData,
  getMyUserAuthorizationProfileForResource,
  getResourceDefaultContent,
} from '../../api/resourceApi';
import axios, { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { Content, SupportedFileTypes, WidthAndHeight } from '../../types/content.types';
import { determinePresentationMode } from '../../utils/mime_type_utils';
import { calculatePreferredWidAndHeigFromPresentationMode, SixteenNineAspectRatio } from '../../utils/Preview.utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { H5P } from 'h5p-standalone';
import { unzip } from 'unzipit';
import fs from 'bro-fs';

const PreviewComponentWrapper = styled.div<{ height: string }>`
  margin: 1rem 0;
  width: 100%;
  height: ${(props) => props.height};
  max-height: ${(props) => props.height};
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
  const [presentationMode, setPresentationMode] = useState<SupportedFileTypes>();
  const [userResourceAuthorization, setUserResourceAuthorization] = useState<UserAuthorizationProfileForResource>(
    emptyUserAuthorizationProfileForResource
  );
  const [errorLoadingAuthorization, setErrorLoadingAuthorization] = useState<Error | AxiosError>();
  const [contentUnavailable, setContentUnavailable] = useState(false);
  const [contentPreviewSize, setContentPreviewSize] = useState<WidthAndHeight>(SixteenNineAspectRatio.medium);

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
      try {
        const defaultContent = (await getResourceDefaultContent(resource.identifier)).data;
        setDefaultContent(defaultContent);
        const presentationMode = determinePresentationMode(defaultContent);
        setPresentationMode(presentationMode);
        setContentPreviewSize(calculatePreferredWidAndHeigFromPresentationMode(presentationMode).medium);
      } catch (error) {
        setContentUnavailable(true);
      }
    };
    fetchDefaultContent();

    function some(file: any) {
      const indexedDB = window.indexedDB;
      let db: any;
      const request = indexedDB.open('database', 3);
      request.onerror = function () {
        console.error('Unable to open database.');
      };
      request.onsuccess = function (e: any) {
        db = e.target.result;
        console.log('db opened');
      };
      request.onupgradeneeded = function (e: any) {
        db = e.target.result;
        db.createObjectStore('h5pFiles');
        const transaction = db.transaction(['h5pFiles'], 'readwrite');
        const objectStore = transaction.objectStore('h5p');
        objectStore.put(file);
        console.log('store created');
      };
    }

    const extractH5p = async () => {
      try {
        // const linkToFile = (await getContentPresentationData(resource.contents.masterContent.identifier)).data.features
        //   .dlr_content_url;
        const fileResponse: any = await axios.get(
          'https://dlrnewqa.s3.eu-west-1.amazonaws.com/h5pSample/MEDLINE_Avansert_Clinical%2BQueries_Course%2BPresentation.zip',
          {
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            responseType: 'blob',
          }
        );
        const url = URL.createObjectURL(fileResponse.data);

        const file = await unzip(url);
        some(file);

        const { entries } = await unzip(url);

        await fs.init({ type: (window as any).TEMPORARY, bytes: 5 * 1024 * 1024 });
        await fs.mkdir('content');

        for (const [name, entry] of Object.entries(entries)) {
          const blob = await entry.blob();
          await fs.writeFile('content/' + entry.name, blob);
        }

        const outputUrl = await fs.getUrl('content');

        console.log(outputUrl);
        const el = document.getElementById('h5p-container');
        const options = {
          // h5pJsonPath: 'https://dlrnewqa.s3.eu-west-1.amazonaws.com/h5pSample/h5pV2',
          frameJs: 'https://dlrnewqa.s3.eu-west-1.amazonaws.com/h5pSample/h5passets/frame.bundle.js',
          frameCss: 'https://dlrnewqa.s3.eu-west-1.amazonaws.com/h5pSample/h5passets/h5p.css',
          h5pJsonPath: './../temporary/content/',
        };
        await new H5P(el, options);
      } catch (error) {
        console.log(error);
      }
    };
    extractH5p();
  }, [resource.identifier, setCanEditResource, setDefaultContent, setPresentationMode, setContentUnavailable]);

  return (
    resource && (
      <StyledPresentationWrapper>
        <div>
          <h1>H5P</h1>
          <div id="h5p-container"></div>
        </div>

        <StyledSchemaPart>
          <StyledContentWrapperMedium>
            <PreviewComponentWrapper data-testid="resource-preview" height={contentPreviewSize.height}>
              <ContentPreview
                resource={resource}
                isPreview={isPreview}
                mainFileBeingUploaded={mainFileBeingUploaded}
                defaultContent={defaultContent}
                presentationMode={presentationMode}
                contentUnavailable={contentUnavailable}
              />
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
