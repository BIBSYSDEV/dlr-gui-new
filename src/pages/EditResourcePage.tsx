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
import {
  createContributor,
  createResource,
  getResource,
  getResourceContributors,
  getResourceDefaults,
  postResourceFeature,
  putContributorFeature,
} from '../api/resourceApi';
import deepmerge from 'deepmerge';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';

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

const contributoFeatureNames = {
  type: 'dlr_contributor_type',
  name: 'dlr_contributor_name',
  institution: 'institution',
};

const EditResourcePage: FC = () => {
  const { t } = useTranslation();
  const { resourceIdentifierFromParam } = useParams<EditResourcePageParamTypes>();
  const [formikInitResource, setFormikInitResource] = useState<Resource>();
  const [expanded, setExpanded] = useState('');
  const [isLoadingResource, setIsLoadingResource] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);
  const user = useSelector((state: RootState) => state.user);

  const onCreateFile = (newResource: Resource) => {
    setIsLoadingResource(true);
    getResourceDefaults(newResource.identifier).then((responseWithCalculatedDefaults) => {
      saveCalculatedFields(responseWithCalculatedDefaults.data);
      getResourceContributors(newResource.identifier).then((contributorsResponse) => {
        const tempResource = deepmerge(newResource, responseWithCalculatedDefaults.data);
        tempResource.contributors = contributorsResponse.data;
        setFormikInitResource(tempResource);
        setResourceType(ResourceCreationType.FILE);
        setShowForm(true);
        setIsLoadingResource(false);
      });
    });
  };

  const onSubmitLink = (url: string) => {
    setIsLoadingResource(true);
    createResource(ResourceCreationType.LINK, url).then((createResourceResponse) => {
      createContributor(createResourceResponse.data.identifier).then((contributorResponse) => {
        putContributorFeature(
          createResourceResponse.data.identifier,
          contributorResponse.data.features.dlr_contributor_identifier,
          contributoFeatureNames.type,
          contributoFeatureNames.institution
        );
        putContributorFeature(
          createResourceResponse.data.identifier,
          contributorResponse.data.features.dlr_contributor_identifier,
          contributoFeatureNames.name,
          user.institution
        );
        getResourceDefaults(createResourceResponse.data.identifier).then((responseWithCalculatedDefaults) => {
          saveCalculatedFields(responseWithCalculatedDefaults.data);
          const tempResouce = deepmerge(createResourceResponse.data, responseWithCalculatedDefaults.data);
          tempResouce.contributors = [contributorResponse.data];
          setFormikInitResource(tempResouce);
          setResourceType(ResourceCreationType.LINK);
          setShowForm(true);
          setIsLoadingResource(false);
        });
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
    if (resourceIdentifierFromParam) {
      setIsLoadingResource(true);
      getResource(resourceIdentifierFromParam).then((resourceResponse) => {
        setFormikInitResource(resourceResponse.data);
        setIsLoadingResource(false);
      });
    }
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
  ) : isLoadingResource ? (
    <CircularProgress />
  ) : formikInitResource ? (
    <ResourceForm resource={formikInitResource} uppy={mainFileHandler} resourceType={resourceType} />
  ) : null;
};

export default PrivateRoute(EditResourcePage);
