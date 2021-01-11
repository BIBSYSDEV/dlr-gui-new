import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import ResourceForm from './ResourceForm';
import LinkRegistration from './LinkRegistration';
import FileRegistration from './FileRegistration';
import { CircularProgress, Typography } from '@material-ui/core';
import PrivateRoute from '../../utils/routes/PrivateRoute';
import {
  ContributorFeatureNames,
  CreatorFeatureAttributes,
  Resource,
  ResourceCreationType,
  ResourceFeatureNames,
  ResourceFeatureTypes,
} from '../../types/resource.types';
import useUppy from '../../utils/useUppy';
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
} from '../../api/resourceApi';
import deepmerge from 'deepmerge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { emptyLicense } from '../../types/license.types';
import ErrorBanner from '../../components/ErrorBanner';

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

const StyledContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
`;

//StartingContributorType must match one of the elements in resources/assets/contributorTypeList.json. This to prevent error: "Material-UI: You have provided an out-of-range value..."
const StartingContributorType = 'HostingInstitution';

const EditResourcePage: FC = () => {
  const { t } = useTranslation();
  const { resourceIdentifierFromParam } = useParams<EditResourcePageParamTypes>();
  const [formikInitResource, setFormikInitResource] = useState<Resource>();
  const [expanded, setExpanded] = useState('');
  const [isLoadingResource, setIsLoadingResource] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);

  const [resourceInitError, setResourceInitError] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  const onCreateFile = (newResource: Resource) => {
    setShowForm(true);
    setIsLoadingResource(true);
    getResourceInit(newResource, ResourceCreationType.FILE);
  };

  const onSubmitLink = async (url: string) => {
    setShowForm(true);
    try {
      setIsLoadingResource(true);
      const createResourceResponse = await createResource(ResourceCreationType.LINK, url);
      await getResourceInit(createResourceResponse.data, ResourceCreationType.LINK);
    } catch (error) {
      setResourceInitError(true);
      setIsLoadingResource(false);
    }
  };

  const resourceHasKnownType = (resource: Resource): boolean => {
    if (!resource.features.dlr_type) {
      return false;
    } else {
      switch (resource.features.dlr_type) {
        case ResourceFeatureTypes.audio:
        case ResourceFeatureTypes.document:
        case ResourceFeatureTypes.image:
        case ResourceFeatureTypes.presentation:
        case ResourceFeatureTypes.simulation:
        case ResourceFeatureTypes.video:
          return true;
        default:
          return false;
      }
    }
  };

  const setResourceTypeAsDocument = async (tempResouce: Resource, resourceIdentifier: string) => {
    try {
      await postResourceFeature(resourceIdentifier, ResourceFeatureNames.Type, ResourceFeatureTypes.document);
      tempResouce.features.dlr_type = ResourceFeatureTypes.document;
    } catch (error) {
      setResourceInitError(true);
    }
  };

  const setAddCreatorIdentifier = async (
    tempResource: Resource,
    resourceIdentifier: string,
    mainCreatorName: string
  ) => {
    const postCreatorResponse = await postResourceCreator(resourceIdentifier);
    await putResourceCreatorFeature(
      resourceIdentifier,
      postCreatorResponse.data.identifier,
      CreatorFeatureAttributes.Name,
      mainCreatorName
    );
    tempResource.creators = [
      {
        identifier: postCreatorResponse.data.identifier,
        features: {
          dlr_creator_identifier: postCreatorResponse.data.identifier,
          dlr_creator_name: mainCreatorName,
        },
      },
    ];
  };

  const setResourceAccessType = async (tempResource: Resource) => {
    await postResourceFeature(tempResource.identifier, 'dlr_access', 'open');
    tempResource.features.dlr_access = 'open';
  };

  const getResourceInit = async (startingResource: Resource, resourceCreationType: ResourceCreationType) => {
    try {
      setShowForm(true);
      const contributorResponse = await createContributor(startingResource.identifier);
      await putContributorFeature(
        startingResource.identifier,
        contributorResponse.data.features.dlr_contributor_identifier,
        ContributorFeatureNames.Type,
        StartingContributorType
      );
      await putContributorFeature(
        startingResource.identifier,
        contributorResponse.data.features.dlr_contributor_identifier,
        ContributorFeatureNames.Name,
        user.institution
      );

      const responseWithCalculatedDefaults = await getResourceDefaults(startingResource.identifier);
      await saveCalculatedFields(responseWithCalculatedDefaults.data);
      const tempResource: Resource = {
        ...deepmerge(startingResource, responseWithCalculatedDefaults.data),
        contributors: [
          {
            identifier: contributorResponse.data.identifier,
            features: {
              dlr_contributor_identifier: contributorResponse.data.identifier,
              dlr_contributor_name: user.institution,
              dlr_contributor_type: StartingContributorType,
            },
          },
        ],
        licenses: [emptyLicense],
        tags: [],
      };
      if (!resourceHasKnownType(tempResource)) {
        await setResourceTypeAsDocument(tempResource, startingResource.identifier);
      }
      if (
        !responseWithCalculatedDefaults.data.creators?.[0]?.identifier &&
        responseWithCalculatedDefaults.data.creators?.[0]?.features.dlr_creator_name
      ) {
        const mainCreatorName = responseWithCalculatedDefaults.data.creators[0].features.dlr_creator_name
          ? responseWithCalculatedDefaults.data.creators[0].features.dlr_creator_name
          : '';
        await setAddCreatorIdentifier(tempResource, startingResource.identifier, mainCreatorName);
      }
      if (!tempResource.features.dlr_access) {
        await setResourceAccessType(tempResource);
      }
      setFormikInitResource(tempResource);
      setResourceInitError(false);
    } catch (error) {
      setResourceInitError(true);
    } finally {
      setResourceType(resourceCreationType);
      setIsLoadingResource(false);
    }
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
      mainFileHandler.on('thumbnail:generated', (file, preview) => {
        console.log('preview', preview);
      });
    }
  }, [mainFileHandler]);

  const saveCalculatedFields = async (_resource: Resource) => {
    if (_resource.features.dlr_title) {
      await postResourceFeature(_resource.identifier, ResourceFeatureNames.Title, _resource.features.dlr_title);
    }
    if (_resource.features.dlr_description) {
      await postResourceFeature(
        _resource.identifier,
        ResourceFeatureNames.Description,
        _resource.features.dlr_description
      );
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
        <FileRegistration
          expanded={expanded === 'load-panel'}
          onChange={handleChange('load-panel')}
          uppy={mainFileHandler}
        />
        <Typography style={{ margin: '2rem 2rem' }}>{t('common.or')}</Typography>
        <LinkRegistration
          expanded={expanded === 'link-panel'}
          onChange={handleChange('link-panel')}
          onSubmit={onSubmitLink}
        />
      </StyledEditPublication>
    </StyledContentWrapper>
  ) : isLoadingResource ? (
    <CircularProgress />
  ) : resourceInitError ? (
    <ErrorBanner />
  ) : formikInitResource ? (
    <ResourceForm resource={formikInitResource} uppy={mainFileHandler} resourceType={resourceType} />
  ) : null;
};

export default PrivateRoute(EditResourcePage);
