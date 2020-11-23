import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';
import { Creator, emptyCreator, Resource } from '../types/resource.types';
import { getResource, getResourceContents, getResourceCreators, getResourceTags } from '../api/resourceApi';
import { CircularProgress, Typography } from '@material-ui/core';
import { API_PATHS, API_URL } from '../utils/constants';
import PreviewComponent from '../components/PreviewComponent';
import ResourceMetadata from '../components/ResourceMetadata';
import { useTranslation } from 'react-i18next';

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
  const [creator, setCreator] = useState<Creator[]>([emptyCreator]);
  const [preview, setPreview] = useState<Preview>({ type: '', theSource: '' });
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const collectResourceData = async (identifier: string) => {
      getResource(identifier).then((response) => {
        setResource(response.data);
      });
      getResourceCreators(identifier).then((response) => {
        setCreator(response.data);
      });
      getResourceContents(identifier).then((response) => {
        const type = response?.data[0]?.features?.dlr_content_content_type
          ? response?.data[0]?.features?.dlr_content_content_type
          : '';
        setPreview({
          type,
          theSource: `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/${response?.data[0]?.identifier}/delivery?jwt=${localStorage.token}`,
        });
      });
      getResourceTags(identifier).then((response) => {
        setTags(response.data);
      });
    };

    if (identifier) {
      setIsLoadingResource(true);
      collectResourceData(identifier).finally(() => {
        setIsLoadingResource(false);
        //todo: presenter siden gradvis ?
      });
    }
  }, [identifier]);
  return (
    <StyledPageContent>
      {isLoadingResource ? (
        <CircularProgress />
      ) : (
        <>
          {resource && (
            <>
              <Typography variant="h1">{resource?.features?.dlr_title}</Typography>
              {preview && <PreviewComponent preview={preview} />}
              {creator[0]?.features?.dlr_creator_name && (
                <Typography variant="h2">
                  {t('resource.metadata.creator')}: {creator[0].features.dlr_creator_name}
                </Typography>
              )}
              {resource.features.dlr_time_published && (
                <Typography variant="body2">
                  {t('resource.metadata.published')}: {resource.features.dlr_time_published}{' '}
                </Typography>
              )}
              {resource.features.dlr_submitter_email && (
                <Typography variant="body2">
                  {t('resource.metadata.owner')}: {resource.features.dlr_submitter_email}{' '}
                </Typography>
              )}
              {tags && resource.features.dlr_subject_nsi_id && (
                <ResourceMetadata type={preview.type} kategori={[resource.features.dlr_subject_nsi_id]} tags={tags} />
              )}
            </>
          )}
        </>
      )}
    </StyledPageContent>
  );
};

export default ResourcePage;
