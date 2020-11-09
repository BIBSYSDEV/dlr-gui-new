import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';
import { Contributor, Creator, emptyContributor, emptyCreator, emptyResource, Resource } from '../types/resource.types';
import {
  getResource,
  getResourceContents,
  getResourceContributors,
  getResourceCreators,
  getResourceLicenses,
} from '../api/api';
import { CircularProgress, Typography } from '@material-ui/core';
import { emptyLicense, License } from '../types/license.types';
import constants from '../utils/constants';
import { Content, emptyContents } from '../types/content.types';

const StyledPageContent = styled.div`
  display: grid;
  justify-items: center;
`;

interface resourcePageParamTypes {
  identifier: string;
}

const ResourcePage: FC<RouteProps> = (props) => {
  const { identifier } = useParams<resourcePageParamTypes>();
  const [resource, setResource] = useState<Resource>(emptyResource);
  const [contributors, setContributors] = useState<Contributor[]>([emptyContributor]);
  const [isLoadingResource, setIsLoadingResource] = useState<boolean>(false);
  const [creator, setCreator] = useState<Creator[]>([emptyCreator]);
  const [licenses, setLicenses] = useState<License[]>([emptyLicense]);
  const [idToken] = useState<string>(localStorage.token);
  const [contents, setContents] = useState<Content[]>(emptyContents);

  useEffect(() => {
    const collectResourceData = async (identifier: string) => {
      await getResource(identifier).then((response) => {
        setResource(response.data);
      });
      await getResourceContributors(identifier).then((response) => {
        setContributors(response.data);
      });
      await getResourceCreators(identifier).then((response) => {
        setCreator(response.data);
      });
      await getResourceLicenses(identifier).then((response) => {
        setLicenses(response.data);
      });
      await getResourceContents(identifier).then((response) => {
        setContents(response.data);
      });
    };

    if (identifier) {
      setIsLoadingResource(true);
      collectResourceData(identifier);
      setIsLoadingResource(false);
    }
  }, [identifier]);

  console.log(contents);
  return (
    <StyledPageContent>
      {isLoadingResource ? (
        <CircularProgress />
      ) : (
        <article>
          <h1>{resource.features.dlr_title}</h1>
          <iframe
            title={identifier}
            src={`https://api-dev.dlr.aws.unit.no/${constants.guiBackendResourcesContentPathVersion2}/contents/${contents[0].identifier}/delivery?jwt=${idToken}`}
            allowFullScreen></iframe>
          <Typography> {resource.features.dlr_time_created}</Typography>
          <Typography> {resource.features.dlr_time_published}</Typography>
        </article>
      )}
    </StyledPageContent>
  );
};

export default ResourcePage;
