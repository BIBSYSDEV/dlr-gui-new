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
  getResourceTags,
} from '../api/api';
import { CircularProgress, Typography } from '@material-ui/core';
import { emptyLicense, License } from '../types/license.types';
import constants from '../utils/constants';
import { Content, emptyContents } from '../types/content.types';
import PreviewComponent from '../components/PreviewComponent';
import AuthorCard from '../components/AuthorCard';
import ResourceMetadata from '../components/ResourceMetadata';

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

//TODO: legg til lisenser
//TODO: språk-støtte, nå er ting harkodet til norsk
//TODO: Created dato må vises i tillegg til eksisterende publiseringsdato
//TODO: Liste ut contributors (medforfattere)
//TODO: Ressurs beskrivelse
//TODO: Kategori (subject) må mappes til subject.json istedet for å bare vise emnekode
//TODO: Siteringslenke med knapp for å kopiere til clipboard
//TODO: Delingslenke med knapp for å kopiere til clipboard
//TODO: Delingsmulighet innebyggingsskode (se figma)
//TODO: Oversikt over innhold
//TODO: komponent som viser lignende ressurser

const ResourcePage: FC<RouteProps> = (props) => {
  const { identifier } = useParams<resourcePageParamTypes>();
  const [resource, setResource] = useState<Resource>(emptyResource);
  const [contributors, setContributors] = useState<Contributor[]>([emptyContributor]);
  const [isLoadingResource, setIsLoadingResource] = useState<boolean>(false);
  const [creator, setCreator] = useState<Creator[]>([emptyCreator]);
  const [licenses, setLicenses] = useState<License[]>([emptyLicense]);
  const [preview, setPreview] = useState<Preview>({ type: '', theSource: '' });
  const [tags, setTags] = useState<string[]>([]);

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
        let type = '';
        if (response.data[0].features) {
          if (response.data[0].features.dlr_content_content_type) {
            type = response.data[0].features.dlr_content_content_type;
          }
        }
        setPreview({
          type,
          theSource: `${process.env.REACT_APP_API_URL}/${constants.guiBackendResourcesContentPathVersion2}/contents/${response.data[0].identifier}/delivery?jwt=${localStorage.token}`,
        });
      });
      await getResourceTags(identifier).then((response) => {
        setTags(response.data);
      });
    };

    if (identifier) {
      setIsLoadingResource(true);
      collectResourceData(identifier);
      setIsLoadingResource(false);
    }
  }, [identifier]);
  return (
    <StyledPageContent>
      {isLoadingResource ? (
        <CircularProgress />
      ) : (
        <div>
          <h1>{resource.features.dlr_title}</h1>
          <PreviewComponent preview={preview} />
          <AuthorCard
            date={resource.features.dlr_time_published}
            mail={resource.features.dlr_submitter_email}
            name={creator[0].features.dlr_creator_name}
          />
          <ResourceMetadata type={preview.type} kategori={[resource.features.dlr_subject_nsi_id]} tags={tags} />
        </div>
      )}
    </StyledPageContent>
  );
};

export default ResourcePage;
