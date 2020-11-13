import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';
import { Creator, emptyCreator, Resource } from '../types/resource.types';
import { getResource, getResourceContents, getResourceCreators, getResourceTags } from '../api/resourceApi';
import { CircularProgress, Typography } from '@material-ui/core';
import { API_PATHS, API_URL } from '../utils/constants';
import PreviewComponent from '../components/PreviewComponent';
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
          theSource: `${API_URL}${API_PATHS.guiBackendResourcesContentPath}/contents/${response?.data[0]?.identifier}/delivery?jwt=${localStorage.token}`,
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
              <h1>{resource?.features?.dlr_title}</h1>
              {preview && <PreviewComponent preview={preview} />}
              {creator[0]?.features?.dlr_creator_name && (
                <Typography variant="h2">Av {creator[0].features.dlr_creator_name}</Typography>
              )}
              {resource.features.dlr_time_published && (
                <Typography variant="body2">Publisert {resource.features.dlr_time_published} </Typography>
              )}
              {resource.features.dlr_submitter_email && (
                <Typography variant="body2">Eier: {resource.features.dlr_submitter_email} </Typography>
              )}
              {/*//TODO: egne komponenter for ResourceMetadata*/}
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
