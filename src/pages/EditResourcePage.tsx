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
  postResourceCreator,
  postResourceFeature,
  putContributorFeature,
  putResourceCreatorFeature,
} from '../api/resourceApi';
import deepmerge from 'deepmerge';
import { useSelector } from 'react-redux';
import { RootState } from '../state/rootReducer';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

interface EditResourcePageParamTypes {
  resourceIdentifierFromParam: string;
}

enum contributorFeatureNames {
  Type = 'dlr_contributor_type',
  Name = 'dlr_contributor_name',
  Institution = 'institution',
}

enum creatorFeatureAttributes {
  name = 'dlr_creator_name',
}
const StyledContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
`;

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
    getResourceInit(newResource, ResourceCreationType.FILE);
  };

  const onSubmitLink = (url: string) => {
    setIsLoadingResource(true);
    createResource(ResourceCreationType.LINK, url).then((createResourceResponse) => {
      getResourceInit(createResourceResponse.data, ResourceCreationType.LINK);
    });
  };

  const doneInitResource = (resourceCreationType: ResourceCreationType) => {
    setResourceType(resourceCreationType);
    setShowForm(true);
    setIsLoadingResource(false);
  };

  const getResourceInit = (startingResource: Resource, resourceCreationType: ResourceCreationType) => {
    createContributor(startingResource.identifier).then((contributorResponse) => {
      putContributorFeature(
        startingResource.identifier,
        contributorResponse.data.features.dlr_contributor_identifier,
        contributorFeatureNames.Type,
        contributorFeatureNames.Institution
      );
      putContributorFeature(
        startingResource.identifier,
        contributorResponse.data.features.dlr_contributor_identifier,
        contributorFeatureNames.Name,
        user.institution
      );

      getResourceDefaults(startingResource.identifier).then((responseWithCalculatedDefaults) => {
        saveCalculatedFields(responseWithCalculatedDefaults.data);
        if (
          !responseWithCalculatedDefaults.data.creators?.[0].identifier &&
          responseWithCalculatedDefaults.data.creators?.[0].features.dlr_creator_name
        ) {
          const mainCreatorName = responseWithCalculatedDefaults.data.creators[0].features.dlr_creator_name
            ? responseWithCalculatedDefaults.data.creators[0].features.dlr_creator_name
            : '';
          postResourceCreator(startingResource.identifier).then((postCreatorResponse) => {
            putResourceCreatorFeature(
              startingResource.identifier,
              postCreatorResponse.data.identifier,
              creatorFeatureAttributes.name,
              mainCreatorName
            ).then(() => {
              setFormikInitResource({
                ...deepmerge(startingResource, responseWithCalculatedDefaults.data),
                creators: [
                  {
                    identifier: postCreatorResponse.data.identifier,
                    features: {
                      dlr_creator_identifier: postCreatorResponse.data.identifier,
                      dlr_creator_name: mainCreatorName,
                    },
                  },
                ],
                contributors: [
                  {
                    identifier: contributorResponse.data.identifier,
                    features: {
                      dlr_contributor_identifier: contributorResponse.data.identifier,
                      dlr_contributor_name: user.institution,
                      dlr_contributor_type: contributorFeatureNames.Institution,
                    },
                  },
                ],
              });
              doneInitResource(resourceCreationType);
            });
          });
        } else {
          setFormikInitResource({
            ...deepmerge(startingResource, responseWithCalculatedDefaults.data),
            contributors: [
              {
                identifier: contributorResponse.data.identifier,
                features: {
                  dlr_contributor_identifier: contributorResponse.data.identifier,
                  dlr_contributor_name: user.institution,
                  dlr_contributor_type: contributorFeatureNames.Institution,
                },
              },
            ],
          });
          doneInitResource(resourceCreationType);
        }
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
        getResourceContributors(resourceIdentifierFromParam).then((contributorRespone) => {
          const tempResource = resourceResponse.data;
          tempResource.contributors = contributorRespone.data;
          setFormikInitResource(tempResource);
          setIsLoadingResource(false);
        });
      });
    }
  }, [resourceIdentifierFromParam]);

  return !showForm ? (
    <StyledContentWrapper>
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
    </StyledContentWrapper>
  ) : isLoadingResource ? (
    <CircularProgress />
  ) : formikInitResource ? (
    <ResourceForm resource={formikInitResource} uppy={mainFileHandler} resourceType={resourceType} />
  ) : null;
};

export default PrivateRoute(EditResourcePage);
