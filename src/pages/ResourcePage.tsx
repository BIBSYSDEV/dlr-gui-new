import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';
import { Creator, Resource } from '../types/resource.types';
import {
  getResource,
  getResourceContents,
  getResourceCreators,
  getResourceTags,
  getResourceLicenses,
} from '../api/resourceApi';
import { CircularProgress, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { API_PATHS, API_URL } from '../utils/constants';
import PreviewComponent from '../components/PreviewComponent';
import ResourceMetadata from '../components/ResourceMetadata';
import { useTranslation } from 'react-i18next';
import LicenseCard from '../components/License';
import { License } from '../types/license.types';

const StyledPageContent = styled.div`
  display: grid;
  justify-items: center;
`;

interface resourcePageParamTypes {
  identifier: string;
}

interface Preview {
  type: string;
  theSource: string;
}

const ResourcePage: FC<RouteProps> = (props) => {
  const { t } = useTranslation();
  const { identifier } = useParams<resourcePageParamTypes>();
  const [resource, setResource] = useState<Resource>();
  const [isLoadingResource, setIsLoadingResource] = useState<boolean>(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoadingCreator, setIsLoadingCreator] = useState<boolean>(false);
  const [preview, setPreview] = useState<Preview>({ type: '', theSource: '' });
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState<boolean>(false);

  useEffect(() => {
    const collectResourceData = async (identifier: string) => {
      getResource(identifier)
        .then((response) => {
          setResource(response.data);
        })
        .finally(() => {
          setIsLoadingResource(false);
        });
      getResourceCreators(identifier)
        .then((response) => {
          setCreators(response.data);
        })
        .finally(() => {
          setIsLoadingCreator(false);
        });
      getResourceContents(identifier)
        .then((response) => {
          const type = response?.data[0]?.features?.dlr_content_content_type
            ? response?.data[0]?.features?.dlr_content_content_type
            : '';
          setPreview({
            type,
            theSource: `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${response?.data[0]?.identifier}/delivery?jwt=${localStorage.token}`,
          });
        })
        .finally(() => {
          setIsLoadingPreview(false);
        });
      getResourceTags(identifier)
        .then((response) => {
          setTags(response.data);
        })
        .finally(() => {
          setIsLoadingTags(false);
        });
      getResourceLicenses(identifier)
        .then((response) => {
          setLicenses(response.data);
        })
        .finally(() => {
          setIsLoadingLicenses(false);
        });
    };

    if (identifier) {
      setIsLoadingResource(true);
      setIsLoadingLicenses(true);
      setIsLoadingCreator(true);
      setIsLoadingPreview(true);
      setIsLoadingTags(true);
      collectResourceData(identifier);
    }
  }, [identifier]);
  return (
    <StyledPageContent>
      {(isLoadingResource || isLoadingTags || isLoadingCreator || isLoadingPreview) && <CircularProgress />}
      {!isLoadingResource && (
        <>
          <Typography variant="h1">{resource?.features?.dlr_title}</Typography>
        </>
      )}
      {!isLoadingPreview && <>{preview && <PreviewComponent preview={preview} />}</>}
      {!isLoadingCreator && (
        <List>
          {creators.map((creator) => {
            return (
              <ListItem>
                <ListItemText>
                  {t('resource.metadata.creator')}: {creator.features.dlr_creator_name}
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      )}
      {!isLoadingResource && (
        <>
          {resource?.features.dlr_time_published && (
            <Typography variant="body2">
              {t('resource.metadata.published')}: {resource.features.dlr_time_published}{' '}
            </Typography>
          )}
          {resource?.features.dlr_submitter_email && (
            <Typography variant="body2">
              {t('resource.metadata.owner')}: {resource.features.dlr_submitter_email}{' '}
            </Typography>
          )}
        </>
      )}
      {!isLoadingTags && tags && resource?.features.dlr_subject_nsi_id && (
        <ResourceMetadata type={preview.type} kategori={[resource.features.dlr_subject_nsi_id]} tags={tags} />
      )}
      {!isLoadingLicenses &&
        licenses.map((license) => {
          return <LicenseCard key={license.identifier} license={license} />;
        })}
    </StyledPageContent>
  );
};

export default ResourcePage;
