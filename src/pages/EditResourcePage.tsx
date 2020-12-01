import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import ResourceForm from './ResourceForm';
import LinkResource from './LinkResource';
import UploadRegistration from './UploadRegistration';
import { CircularProgress, Typography } from '@material-ui/core';
import PrivateRoute from '../utils/routes/PrivateRoute';
import { emptyResource, Resource, ResourceCreationType } from '../types/resource.types';
import useUppy from '../utils/useUppy';
import { toast } from 'react-toastify';
import { getResource, getResourceDefaults, postResourceFeature } from '../api/resourceApi';
import deepmerge from 'deepmerge';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  max-width: 55rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

interface EditResourcePageParamTypes {
  resourceIdentifierFromParam: string;
}

const EditResourcePage: FC = () => {
  const { t } = useTranslation();
  const { resourceIdentifierFromParam } = useParams<EditResourcePageParamTypes>();
  const [resource, setResource] = useState(emptyResource);
  const [resourceIdentifier, setResourceIdentifier] = useState(resourceIdentifierFromParam);
  const [expanded, setExpanded] = useState('');
  const [showForm, setShowForm] = useState(!!resourceIdentifier);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);
  const [isLoadingResource, setIsLoadingResource] = useState(false);

  const onCreateFile = (newResource: Resource) => {
    setResource(newResource);
    getResourceDefaults(resource.identifier).then((responseWithCalculatedDefaults) => {
      saveCalculatedFields(responseWithCalculatedDefaults.data);
      setResource(deepmerge(newResource, responseWithCalculatedDefaults.data));
      setIsLoadingResource(false);
    });
    setResourceType(ResourceCreationType.FILE);
    setShowForm(true);
  };

  const onSubmitLink = (resourceIdentifier: string) => {
    setResourceType(ResourceCreationType.LINK);
    setResourceIdentifier(resourceIdentifier);
    setShowForm(true);
  };

  const mainFileHandler = useUppy('', false, onCreateFile);

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  //triggers on uppy-events
  useEffect(() => {
    if (mainFileHandler) {
      mainFileHandler.on('upload', (file, response) => {
        setResourceType(ResourceCreationType.FILE);
      });
      if (!mainFileHandler.hasUploadFailedEventListener) {
        mainFileHandler.on('upload-error', () => {
          toast.error('File upload error');
        });
        mainFileHandler.hasUploadFailedEventListener = true;
      }
    }
  }, [mainFileHandler]);

  const saveCalculatedFields = (_resource: Resource) => {
    if (_resource.features.dlr_title) {
      postResourceFeature(_resource.identifier, 'dlr_title', _resource.features.dlr_title);
    }
    if (_resource.features.dlr_description) {
      postResourceFeature(_resource.identifier, 'dlr_description', _resource.features.dlr_description);
    }
    if (_resource.features.dlr_type) {
      postResourceFeature(_resource.identifier, 'dlr_type', _resource.features.dlr_type);
    }
    //TODO: tags, creators

    //todo: show form on completed
  };

  useEffect(() => {
    if (resourceIdentifier) {
      setIsLoadingResource(true);
      getResource(resourceIdentifier).then((resourceResponse) => {
        getResourceDefaults(resourceIdentifier).then((responseWithCalculatedDefaults) => {
          saveCalculatedFields(responseWithCalculatedDefaults.data);
          setResource(deepmerge(resourceResponse.data, responseWithCalculatedDefaults.data));
          setIsLoadingResource(false);
        });
      });
    }
  }, [resourceIdentifier]);

  return !showForm ? (
    <>
      <PageHeader>{t('resource.new_registration')}</PageHeader>
      <StyledEditPublication>
        <UploadRegistration
          expanded={expanded === 'load-panel'}
          onChange={handleChange('load-panel')}
          uppy={mainFileHandler}
        />
        <Typography style={{ margin: '2rem 2rem' }}>{t('common.or')}</Typography>
        <LinkResource
          expanded={expanded === 'link-panel'}
          onChange={handleChange('link-panel')}
          onSubmit={onSubmitLink}
        />
      </StyledEditPublication>
    </>
  ) : isLoadingResource ? (
    <CircularProgress />
  ) : (
    <ResourceForm resource={resource} uppy={mainFileHandler} resourceType={resourceType} />
  );
};

export default PrivateRoute(EditResourcePage);
