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
import { Resource, ResourceCreationType } from '../types/resource.types';
import useUppy from '../utils/useUppy';
import { toast } from 'react-toastify';
import { createResource, getResource, getResourceDefaults, postResourceFeature } from '../api/resourceApi';
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
  const [formikInitResource, setFormikInitResource] = useState<Resource>();
  const [expanded, setExpanded] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);

  const onCreateFile = (newResource: Resource) => {
    getResourceDefaults(newResource.identifier).then((responseWithCalculatedDefaults) => {
      saveCalculatedFields(responseWithCalculatedDefaults.data);
      setFormikInitResource(deepmerge(newResource, responseWithCalculatedDefaults.data));
      setResourceType(ResourceCreationType.FILE);
      setShowForm(true);
    });
  };

  const onSubmitLink = (url: string) => {
    createResource(ResourceCreationType.LINK, url).then((createResourceResponse) => {
      getResourceDefaults(createResourceResponse.data.identifier).then((responseWithCalculatedDefaults) => {
        saveCalculatedFields(responseWithCalculatedDefaults.data);
        setFormikInitResource(deepmerge(createResourceResponse.data, responseWithCalculatedDefaults.data));
        setResourceType(ResourceCreationType.LINK);
        setShowForm(true);
      });
    });
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

  const saveCalculatedFields = async (_resource: Resource) => {
    if (_resource.features.dlr_title) {
      await postResourceFeature(_resource.identifier, 'dlr_title', _resource.features.dlr_title);
    }
    if (_resource.features.dlr_description) {
      await postResourceFeature(_resource.identifier, 'dlr_description', _resource.features.dlr_description);
    }
    if (_resource.features.dlr_type) {
      await postResourceFeature(_resource.identifier, 'dlr_type', _resource.features.dlr_type);
    }
    //TODO: tags, creators
  };

  useEffect(() => {
    resourceIdentifierFromParam &&
      getResource(resourceIdentifierFromParam).then((resourceResponse) => {
        setFormikInitResource(resourceResponse.data);
      });
  }, [resourceIdentifierFromParam]);

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
  ) : !formikInitResource ? (
    <CircularProgress />
  ) : (
    <ResourceForm resource={formikInitResource} uppy={mainFileHandler} resourceType={resourceType} />
  );
};

export default PrivateRoute(EditResourcePage);
