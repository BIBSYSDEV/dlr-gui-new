import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';
import { Contributor, Creator, Resource } from '../types/resource.types';
import {
  getResource,
  getResourceContents,
  getResourceCreators,
  getResourceTags,
  getResourceLicenses,
  getResourceContributors,
} from '../api/resourceApi';
import { CircularProgress, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
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
  const [isLoadingResource, setIsLoadingResource] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [preview, setPreview] = useState<Preview>({ type: '', theSource: '' });
  const [tags, setTags] = useState<string[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    const fetchData = async (identifier: string) => {
      const promises: Promise<any>[] = [];
      promises[0] = getResource(identifier).then((response) => {
        setResource(response.data);
      });
      promises[1] = getResourceCreators(identifier).then((response) => {
        setCreators(response.data);
      });
      promises[2] = getResourceContents(identifier).then((response) => {
        const type = response?.data[0]?.features?.dlr_content_content_type
          ? response?.data[0]?.features?.dlr_content_content_type
          : '';
        setPreview({
          type,
          theSource: `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${response?.data[0]?.identifier}/delivery?jwt=${localStorage.token}`,
        });
      });
      promises[3] = getResourceTags(identifier).then((response) => {
        setTags([...response.data]);
      });
      promises[4] = getResourceLicenses(identifier).then((response) => {
        setLicenses(response.data);
      });
      promises[5] = getResourceContributors(identifier).then((response) => {
        setContributors(response.data);
      });
      await Promise.all(promises).finally(() => {
        setIsLoadingResource(false);
      });
    };
    if (identifier) {
      setIsLoadingResource(true);
      fetchData(identifier);
    }
  }, [identifier]);

  return (
    <StyledPageContent>
      {isLoadingResource && <CircularProgress />}
      {!isLoadingResource && (
        <>
          <Typography variant="h1">{resource?.features?.dlr_title}</Typography>
        </>
      )}
      {preview.theSource !== '' && <>{preview && <PreviewComponent preview={preview} />}</>}
      <Card>
        {creators.length !== 0 && (
          <List>
            {creators.map((creator) => {
              return (
                <ListItem key={creator.identifier}>
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
                {t('resource.metadata.published')}: {resource.features.dlr_time_published}
              </Typography>
            )}
            {resource?.features.dlr_time_created && (
              <Typography variant="body2">
                {t('resource.metadata.created')}: {resource.features.dlr_time_created}
              </Typography>
            )}
            {resource?.features.dlr_submitter_email && (
              <Typography variant="body2">
                {t('resource.metadata.owner')}: {resource.features.dlr_submitter_email}
              </Typography>
            )}
            {resource?.features.dlr_description && (
              <Typography variant="body2">{resource.features.dlr_description}</Typography>
            )}
          </>
        )}
        {contributors.map((contributor) => {
          return (
            <div key={contributor.features.dlr_contributor_identifier}>
              <Typography>{contributor.features.dlr_contributor_name}</Typography>
              <Typography>{contributor.features.dlr_contributor_type}</Typography>
            </div>
          );
        })}
        {resource?.features.dlr_subject_nsi_id && (
          <ResourceMetadata type={preview.type} category={resource.features.dlr_subject_nsi_id} tags={tags} />
        )}
        {!resource?.features.dlr_subject_nsi_id && <ResourceMetadata type={preview.type} category={''} tags={tags} />}
      </Card>
      {licenses.length !== 0 &&
        licenses.map((license) => {
          return <LicenseCard key={license.identifier} license={license} />;
        })}
    </StyledPageContent>
  );
};

export default ResourcePage;
