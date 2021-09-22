import React, { useEffect, useState } from 'react';
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
  Contributor,
  ContributorFeatureNames,
  Creator,
  CreatorFeatureAttributes,
  DefaultResourceTypes,
  emptyResource,
  Resource,
  ResourceCreationType,
  ResourceFeatureNames,
  ResourceFeatureTypes,
  TAGS_MAX_LENGTH,
  VideoManagementSystems,
  VMSResource,
} from '../../types/resource.types';
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
  postKalturaPresentationImport,
  postPanoptoPresentationImport,
  postResourceCreator,
  postResourceFeature,
  postTag,
  putContributorFeature,
  putResourceCreatorFeature,
  updateContentTitle,
} from '../../api/resourceApi';
import deepmerge from 'deepmerge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { emptyLicense } from '../../types/license.types';
import ErrorBanner from '../../components/ErrorBanner';
import { createUppy } from '../../utils/uppy-config';
import { useUppy } from '@uppy/react';
import { StyledContentWrapperLarge, StyledFullPageProgressWrapper } from '../../components/styled/Wrappers';
import { getAuthoritiesForResourceCreatorOrContributor } from '../../api/authoritiesApi';
import VMSRegistration from './VMSRegistration';
import institutions from '../../resources/assets/institutions.json';
import { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const StyledTypography = styled(Typography)`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

interface EditResourcePageParamTypes {
  identifier: string;
}

// StartingContributorType must match one of the elements in resources/assets/contributorTypeList.json.
// This to prevent error: "Material-UI: You have provided an out-of-range value..."
const StartingContributorType = 'HostingInstitution';

const EditResourcePage = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<EditResourcePageParamTypes>();
  const [formikInitResource, setFormikInitResource] = useState<Resource>();
  const [expanded, setExpanded] = useState('');
  const [isLoadingResource, setIsLoadingResource] = useState(false);
  const [showForm, setShowForm] = useState(!!identifier);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);
  const [resourceInitError, setResourceInitError] = useState<Error | AxiosError>();
  const [fileUploadError, setFileUploadError] = useState<Error | AxiosError>();
  const [mainFileBeingUploaded, setMainFileBeingUploaded] = useState(false);

  const user = useSelector((state: RootState) => state.user);
  const [userInstitutionCorrectCapitalization] = useState(
    institutions.find((institution) => institution.toLowerCase() === user.institution.toLowerCase()) ?? user.institution
  );

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
      setResourceInitError(handlePotentialAxiosError(error));
      setIsLoadingResource(false);
    }
  };

  const onSubmitVMSResource = async (vmsResource: VMSResource, vms: VideoManagementSystems) => {
    setShowForm(true);
    try {
      setIsLoadingResource(true);
      const createResourceResponse = await createResource(ResourceCreationType.LINK, vmsResource.url);
      await getResourceInit(createResourceResponse, ResourceCreationType.LINK, vmsResource, vms);
    } catch (error) {
      setResourceInitError(handlePotentialAxiosError(error));
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
    tempResource: Resource,
    resourceIdentifier: string,
    dlrType: ResourceFeatureTypes
  ) => {
    try {
      await postResourceFeature(resourceIdentifier, ResourceFeatureNames.Type, dlrType);
      tempResource.features.dlr_type = dlrType;
    } catch (error) {
      setResourceInitError(handlePotentialAxiosError(error));
    }
  };

  const setCreator = async (resource: Resource, resourceIdentifier: string, mainCreatorName: string) => {
    const postCreatorResponse = await postResourceCreator(resourceIdentifier);
    await putResourceCreatorFeature(
      resourceIdentifier,
      postCreatorResponse.data.identifier,
      CreatorFeatureAttributes.Name,
      mainCreatorName
    );
    resource.creators = [
      {
        identifier: postCreatorResponse.data.identifier,
        features: {
          dlr_creator_identifier: postCreatorResponse.data.identifier,
          dlr_creator_name: mainCreatorName,
        },
      },
    ];
  };
  const setTags = async (resource: Resource, resourceIdentifier: string) => {
    const promiseArray: Promise<any>[] = [];
    resource.tags?.forEach((tag) => {
      promiseArray.push(postTag(resourceIdentifier, tag));
    });
    await Promise.all(promiseArray);
  };

  const setResourceAccessType = async (resource: Resource) => {
    await postResourceFeature(resource.identifier, 'dlr_access', 'open');
    resource.features.dlr_access = 'open';
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
        const suggestion = DefaultResourceTypes.findIndex((type) => {
          return filetype.toLowerCase().includes(type.toLowerCase());
        });
        if (suggestion >= 0) {
          resourceDLRType = DefaultResourceTypes[suggestion];
        } else {
          resourceDLRType = resourceDLRTypeFromDefaults(responseWithCalculatedDefaults);
        }
      } else {
        resourceDLRType = resourceDLRTypeFromDefaults(responseWithCalculatedDefaults);
      }
    }
    await saveResourceDLRType(tempResource, startingResource.identifier, resourceDLRType);
  }

  const getResourceInit = async (
    startingResource: Resource,
    resourceCreationType: ResourceCreationType,
    vmsResource?: VMSResource,
    vms?: VideoManagementSystems
  ) => {
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
        userInstitutionCorrectCapitalization
      );

      const responseWithCalculatedDefaults = (await getResourceDefaults(startingResource.identifier)).data;
      if (vmsResource) {
        responseWithCalculatedDefaults.features.dlr_title = vmsResource.title;
        responseWithCalculatedDefaults.features.dlr_description = vmsResource.description;
      }
      await saveCalculatedFields(responseWithCalculatedDefaults);

      const tempResource = deepmerge(emptyResource, startingResource);
      const tempContents = startingResource.contents;
      const resource: Resource = {
        ...deepmerge(tempResource, responseWithCalculatedDefaults),
        contributors: [
          {
            identifier: contributorResponse.data.identifier,
            features: {
              dlr_contributor_identifier: contributorResponse.data.identifier,
              dlr_contributor_name: userInstitutionCorrectCapitalization,
              dlr_contributor_type: StartingContributorType,
            },
          },
        ],
        licenses: [emptyLicense],
        contents: tempContents,
      };
      resource.isFresh = true;
      if (vmsResource) {
        await saveResourceDLRType(resource, startingResource.identifier, ResourceFeatureTypes.video);
      } else {
        await setDLRType(resourceCreationType, responseWithCalculatedDefaults, resource, startingResource);
      }
      await setCreator(resource, startingResource.identifier, user.name);
      if (resource.tags) {
        resource.tags = resource.tags.filter((tag) => tag.length < TAGS_MAX_LENGTH);
      }
      await setTags(resource, startingResource.identifier);

      if (!resource.features.dlr_access) {
        await setResourceAccessType(resource);
      }
      if (!resource.contents) {
        resource.contents = await getResourceContents(resource.identifier);
      }
      if (!resource.contents.masterContent.features.dlr_content_title) {
        await updateContentTitle(
          resource.identifier,
          resource.contents.masterContent.identifier,
          resource.contents.masterContent.features.dlr_content
        );
        resource.contents.masterContent.features.dlr_content_title =
          resource.contents.masterContent.features.dlr_content;
      }

      if (vmsResource && vms === VideoManagementSystems.Kaltura) {
        await postKalturaPresentationImport(resource, vmsResource);
      }
      if (vmsResource && vms === VideoManagementSystems.Panopto) {
        await postPanoptoPresentationImport(resource, vmsResource);
      }
      setFormikInitResource(resource);
      setResourceInitError(undefined);
    } catch (error) {
      setResourceInitError(handlePotentialAxiosError(error));
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
    const setupBeforeUnloadListener = () => {
      window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        const uppyState = mainFileHandler.getState();
        if (!(uppyState.totalProgress === 0 || uppyState.totalProgress === 100)) return (event.returnValue = ''); //The text displayed to the user is the browser's default text. (no need to add custom text)
      });
    };
    setupBeforeUnloadListener();
    setFileUploadError(undefined);
    if (mainFileHandler) {
      mainFileHandler.on('upload', () => {
        setResourceType(ResourceCreationType.FILE);
        setMainFileBeingUploaded(true);
      });
      mainFileHandler.on('upload-error', () => {
        setFileUploadError(new Error('File upload error'));
      });
      mainFileHandler.on('complete', () => {
        setMainFileBeingUploaded(false);
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

  const fetchAuthoritiesForCreatorOrContributor = async (
    resourceIdentifier: string,
    creatorsOrContributor: Creator[] | Contributor[]
  ): Promise<Creator[] | Contributor[]> => {
    const promiseArray = [];
    for (let i = 0; i < creatorsOrContributor.length; i++) {
      promiseArray[i] = getAuthoritiesForResourceCreatorOrContributor(
        resourceIdentifier,
        creatorsOrContributor[i].identifier
      );
    }
    const authorities2DArray = await Promise.all(promiseArray);
    for (let i = 0; i < creatorsOrContributor.length; i++) {
      creatorsOrContributor[i].authorities = authorities2DArray[i];
    }
    return creatorsOrContributor;
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
      /*creating all promises first, and afterwards waiting
      for their results reduces loading time from 2.4 seconds to 0.9 seconds.
       */
      const contributorPromise = getResourceContributors(identifier);
      const creatorPromise = getResourceCreators(identifier);
      const licensesPromise = getResourceLicenses(identifier);
      const contentsPromise = getResourceContents(identifier);
      const tagsPromise = getResourceTags(identifier);

      const contributors = (await contributorPromise).data;
      const creators = (await creatorPromise).data;

      if (user.institutionAuthorities?.isCurator) {
        const contributorWithAuthoritiesPromise = fetchAuthoritiesForCreatorOrContributor(
          resource.identifier,
          contributors
        );
        const creatorWithAuthoritiesPromise = fetchAuthoritiesForCreatorOrContributor(resource.identifier, creators);
        resource.creators = (await creatorWithAuthoritiesPromise) as Creator[];
        resource.contributors = (await contributorWithAuthoritiesPromise) as Contributor[];
      }
      resource.tags = (await tagsPromise).data.filter((tag) => tag.length <= TAGS_MAX_LENGTH);
      resource.contents = await contentsPromise;
      resource.licenses = (await licensesPromise).data;
      if (!resource.features.dlr_type) resource.features.dlr_type = '';
      if (!resource.licenses[0]) resource.licenses = [emptyLicense];
      setFormikInitResource(resource);
      setIsLoadingResource(false);
    };
    if (identifier) {
      setShowForm(true);
      loadResource();
    }
  }, [identifier, user.institutionAuthorities?.isCurator]);

  return !showForm ? (
    <StyledContentWrapperLarge>
      <PageHeader>{t('resource.new_registration')}</PageHeader>
      <StyledEditPublication>
        <FileRegistration
          expanded={expanded === 'load-panel'}
          onChange={handleChange('load-panel')}
          uppy={mainFileHandler}
        />
        {fileUploadError && <ErrorBanner userNeedsToBeLoggedIn={true} error={fileUploadError} />}
        <StyledTypography>{t('common.or')}</StyledTypography>
        <LinkRegistration
          expanded={expanded === 'link-panel'}
          onChange={handleChange('link-panel')}
          onSubmit={onSubmitLink}
        />
        {user.appFeature?.hasFeatureNewResourceFromKaltura && (
          <>
            <StyledTypography>{t('common.or')}</StyledTypography>
            <VMSRegistration
              expanded={expanded === 'kaltura-panel'}
              vms={VideoManagementSystems.Kaltura}
              onChange={handleChange('kaltura-panel')}
              onSubmit={onSubmitVMSResource}
            />
          </>
        )}
        {user.appFeature?.hasFeatureNewResourceFromPanopto && (
          <>
            <StyledTypography>{t('common.or')}</StyledTypography>
            <VMSRegistration
              expanded={expanded === 'panopto-panel'}
              vms={VideoManagementSystems.Panopto}
              onChange={handleChange('panopto-panel')}
              onSubmit={onSubmitVMSResource}
            />
          </>
        )}
      </StyledEditPublication>
    </StyledContentWrapperLarge>
  ) : isLoadingResource ? (
    <StyledFullPageProgressWrapper>
      <CircularProgress />
    </StyledFullPageProgressWrapper>
  ) : resourceInitError ? (
    <ErrorBanner userNeedsToBeLoggedIn={true} error={resourceInitError} />
  ) : formikInitResource ? (
    <ResourceForm
      resource={formikInitResource}
      uppy={mainFileHandler}
      resourceType={resourceType}
      mainFileBeingUploaded={mainFileBeingUploaded}
    />
  ) : null;
};

export default PrivateRoute(EditResourcePage);
