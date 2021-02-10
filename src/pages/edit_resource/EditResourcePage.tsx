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
  emptyResource,
  Resource,
  ResourceCreationType,
  ResourceFeatureNames,
  ResourceFeatureTypes,
} from '../../types/resource.types';
import { toast } from 'react-toastify';
import {
  createContributor,
  createResource,
  getResource,
  getResourceContents,
  getResourceContributors,
  getResourceCreators,
  getResourceDefaults,
  getResourceLicenses,
  getResourceTags,
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
import { createUppy } from '../../utils/uppy-config';
import { useUppy } from '@uppy/react';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

interface EditResourcePageParamTypes {
  identifier: string;
}

const StyledContentWrapper = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
`;

const potentialDLRTypes = [
  ResourceFeatureTypes.audio,
  ResourceFeatureTypes.image,
  ResourceFeatureTypes.presentation,
  ResourceFeatureTypes.simulation,
  ResourceFeatureTypes.video,
  ResourceFeatureTypes.document,
];

// StartingContributorType must match one of the elements in resources/assets/contributorTypeList.json.
// This to prevent error: "Material-UI: You have provided an out-of-range value..."
const StartingContributorType = 'HostingInstitution';

const EditResourcePage: FC = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<EditResourcePageParamTypes>();
  const [formikInitResource, setFormikInitResource] = useState<Resource>();
  const [expanded, setExpanded] = useState('');
  const [isLoadingResource, setIsLoadingResource] = useState(false);
  const [showForm, setShowForm] = useState(!!identifier);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);
  const [resourceInitError, setResourceInitError] = useState(false);

  const user = useSelector((state: RootState) => state.user);

  const onCreateFile = (newResource: Resource) => {
    setShowForm(true);
    setIsLoadingResource(true);
    getResourceInit(newResource, ResourceCreationType.FILE);
  };
  const mainFileHandler = useUppy(createUppy('', false, onCreateFile));

  const onSubmitLink = async (url: string) => {
    setShowForm(true);
    try {
      setIsLoadingResource(true);
      const createResourceResponse = await createResource(ResourceCreationType.LINK, url);
      await getResourceInit(createResourceResponse, ResourceCreationType.LINK);
    } catch (error) {
      setResourceInitError(true);
      setIsLoadingResource(false);
    }
  };

  const resourceDLRTypeFromDefaults = (resource: Resource): ResourceFeatureTypes => {
    if (!resource.features.dlr_type) {
      return ResourceFeatureTypes.document;
    } else {
      switch (resource.features.dlr_type) {
        case ResourceFeatureTypes.audio:
        case ResourceFeatureTypes.document:
        case ResourceFeatureTypes.image:
        case ResourceFeatureTypes.presentation:
        case ResourceFeatureTypes.simulation:
        case ResourceFeatureTypes.video:
          return resource.features.dlr_type as ResourceFeatureTypes;
        default:
          return ResourceFeatureTypes.document;
      }
    }
  };

  const saveResourceDLRType = async (
    tempResouce: Resource,
    resourceIdentifier: string,
    dlrType: ResourceFeatureTypes
  ) => {
    try {
      await postResourceFeature(resourceIdentifier, ResourceFeatureNames.Type, dlrType);
      tempResouce.features.dlr_type = dlrType;
    } catch (error) {
      setResourceInitError(true);
    }
  };

  const setCreator = async (tempResource: Resource, resourceIdentifier: string, mainCreatorName: string) => {
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

  async function setDLRType(
    resourceCreationType: ResourceCreationType,
    responseWithCalculatedDefaults: Resource,
    tempResource: Resource,
    startingResource: Resource
  ) {
    let resourceDLRType = ResourceFeatureTypes.document;
    if (resourceCreationType === ResourceCreationType.FILE) {
      const filetype = mainFileHandler.getFiles()[0].type;
      if (filetype) {
        const suggestion = potentialDLRTypes.findIndex((type) => {
          return filetype.toLowerCase().includes(type.toLowerCase());
        });
        if (suggestion >= 0) {
          resourceDLRType = potentialDLRTypes[suggestion];
        } else {
          resourceDLRType = resourceDLRTypeFromDefaults(responseWithCalculatedDefaults);
        }
      } else {
        resourceDLRType = resourceDLRTypeFromDefaults(responseWithCalculatedDefaults);
      }
    }
    await saveResourceDLRType(tempResource, startingResource.identifier, resourceDLRType);
  }

  const getResourceInit = async (startingResource: Resource, resourceCreationType: ResourceCreationType) => {
    try {
      setShowForm(true);
      startingResource.features.dlr_title = startingResource.features.dlr_title ?? '';
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

      const responseWithCalculatedDefaults = (await getResourceDefaults(startingResource.identifier)).data;
      await saveCalculatedFields(responseWithCalculatedDefaults);
      const tempResource = deepmerge(emptyResource, startingResource);
      const resource: Resource = {
        ...deepmerge(tempResource, responseWithCalculatedDefaults),
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
      };
      await setDLRType(resourceCreationType, responseWithCalculatedDefaults, resource, startingResource);
      await setCreator(resource, startingResource.identifier, user.name);

      if (!resource.features.dlr_access) {
        await setResourceAccessType(resource);
      }
      if (!resource.contents) {
        resource.contents = await getResourceContents(resource.identifier);
      }

      setFormikInitResource(resource);
      setResourceInitError(false);
    } catch (error) {
      setResourceInitError(true);
    } finally {
      setResourceType(resourceCreationType);
      setIsLoadingResource(false);
    }
  };

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  };

  //triggers on uppy-events
  useEffect(() => {
    if (mainFileHandler) {
      mainFileHandler.on('upload', () => {
        setResourceType(ResourceCreationType.FILE);
      });
      mainFileHandler.on('upload-error', () => {
        toast.error('File upload error');
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
  };

  useEffect(() => {
    const loadResource = async () => {
      setIsLoadingResource(true);
      const resource = deepmerge(emptyResource, (await getResource(identifier)).data);
      setResourceType(
        resource.features.dlr_content_type === ResourceCreationType.LINK
          ? ResourceCreationType.LINK
          : ResourceCreationType.FILE
      );
      resource.contributors = (await getResourceContributors(identifier)).data;
      resource.creators = (await getResourceCreators(identifier)).data;
      resource.licenses = (await getResourceLicenses(identifier)).data;
      resource.contents = await getResourceContents(identifier);
      resource.tags = (await getResourceTags(identifier)).data;
      if (!resource.features.dlr_type) resource.features.dlr_type = '';
      if (!resource.licenses[0]) resource.licenses = [emptyLicense];
      setFormikInitResource(resource);
      setIsLoadingResource(false);
    };
    if (identifier) {
      setShowForm(true);
      loadResource();
    }
  }, [identifier]);

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
    <ErrorBanner userNeedsToBeLoggedIn={true} />
  ) : formikInitResource ? (
    <ResourceForm resource={formikInitResource} uppy={mainFileHandler} resourceType={resourceType} />
  ) : null;
};

export default PrivateRoute(EditResourcePage);
