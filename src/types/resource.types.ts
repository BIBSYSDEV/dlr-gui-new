//TODO: https://git.unit.no/dlr/dlr-resource-service/-/blob/master/src/main/java/no/bibsys/dlr/microservices/resources/Types.java

import { Content } from './content.types';
import { License } from './license.types';
import { Authority } from './authority.types';

export interface Resource {
  identifier: string;
  features: ResourceFeatures;
  subjects?: string[];
  courses?: Course[];
  tags?: string[];
  types?: ResourceType[];
  projects?: Project[];
  publisher?: Publisher[];
  funders?: Funder[];
  geographicalCoverages?: any[];
  observationalUnits?: any[];
  processMethods?: any[];
  creators: Creator[];
  contributors: Contributor[];
  accessRead?: string[];
  accessWrite?: string[];
  contents: ResourceContents;
  licenses: License[];
  isFresh?: boolean; //indicates that the resource has been just generated without the user leaving the form and the tags are untouched
}

export const emptyResource: Resource = {
  identifier: '',
  features: {
    dlr_title: '',
    dlr_content: '',
    dlr_time_created: '',
    dlr_content_type: '',
    dlr_licensehelper_contains_other_peoples_work: '',
    dlr_licensehelper_usage_cleared_with_owner: '',
    dlr_licensehelper_resource_restriction: '',
    dlr_licensehelper_others_can_modify_and_build_upon: '',
    dlr_licensehelper_can_be_used_commercially: '',
  },
  contents: {
    masterContent: {
      identifier: '',
      features: {
        dlr_content_title: '',
        dlr_content: '',
      },
    },
    additionalContent: [],
  },
  contributors: [],
  creators: [],
  licenses: [],
  tags: [],
};

enum ResourceType {
  RESEARCH = 'research',
  LEARNING = 'learning',
}

export enum ResourceCreationType {
  FILE = 'file',
  LINK = 'link',
}

interface ResourceFeatures {
  dlr_access?: string;
  dlr_app?: string;
  dlr_content: string;
  dlr_content_type: string;
  dlr_description?: string;
  dlr_identifier?: string;
  dlr_identifier_handle?: string;
  dlr_identifier_doi?: string;
  dlr_readme?: string;
  dlr_resource?: boolean;
  dlr_resource_research?: boolean;
  dlr_resource_learning?: boolean;
  dlr_rights_license_name?: string;
  dlr_status_published?: boolean;
  dlr_storage_id?: string;
  dlr_subject_nsi_id?: string;
  dlr_subject_nsi_name?: string;
  dlr_submitter_email?: string;
  dlr_time_created: string;
  dlr_time_published?: string;
  dlr_title: string;
  dlr_title_alternative?: string;
  dlr_type?: string;
  dlr_thumbnail_url?: string;
  dlr_licensehelper_contains_other_peoples_work: string;
  dlr_licensehelper_usage_cleared_with_owner: string;
  dlr_licensehelper_resource_restriction: string;
  dlr_licensehelper_others_can_modify_and_build_upon: string;
  dlr_licensehelper_can_be_used_commercially: string;
}

export interface ResourceContents {
  masterContent: Content;
  additionalContent: Content[];
}

interface Course {
  identifier: string;
  features: any;
}

interface Project {
  identifier: string;
  features: any;
}

interface Funder {
  identifier: string;
  features: any;
}

interface Publisher {
  identifier: string;
  features: PublisherFeatures;
}

interface PublisherFeatures {
  dlr_publisher_code?: string;
  dlr_publisher_entity_type?: string;
  dlr_publisher_identifier?: string;
  dlr_publisher_name?: string;
  dlr_publisher_time_created?: string;
}

export interface Creator {
  identifier: string;
  features: CreatorFeatures;
  authorities?: Authority[] | undefined;
}

interface CreatorFeatures {
  dlr_creator_identifier?: string;
  dlr_creator_name?: string;
  dlr_creator_order?: number;
  dlr_creator_time_created?: string;
}

export interface Contributor {
  identifier: string;
  features: ContributorFeatures;
  authorities?: Authority[];
}

export const emptyContributor: Contributor = {
  identifier: '',
  features: {
    dlr_contributor_identifier: 'contributor id 123',
  },
};

interface ContributorFeatures {
  dlr_contributor_identifier: string;
  dlr_contributor_name?: string;
  dlr_contributor_time_created?: string;
  dlr_contributor_type?: string;
}

export interface ResourceEvent {
  limit: number;
  offset: number;
  resource_events: Event[];
  total: number;
}

export interface Event {
  event: string;
  time: string;
}

export enum ResourceFeatureTypes {
  audio = 'Audio',
  document = 'Document',
  image = 'Image',
  presentation = 'Presentation',
  simulation = 'Simulation',
  video = 'Video',
}

export enum LegacyResourceFeatureTypes {
  AudioVisual = 'audioVisual',
  Collection = 'collection',
  DataPaper = 'dataPaper',
  Dataset = 'dataset',
  Event = 'event',
  InteractiveResource = 'interactiveResource',
  Model = 'model',
  Other = 'other',
  PhysicalObject = 'PhysicalObject',
  Service = 'service',
  Software = 'software',
  Sound = 'sound',
  Text = 'text',
  Workflow = 'workflow',
}

//Note! This is also the presentation order for the type-filter
export const DefaultResourceTypes: ResourceFeatureTypes[] = [
  ResourceFeatureTypes.video,
  ResourceFeatureTypes.image,
  ResourceFeatureTypes.document,
  ResourceFeatureTypes.presentation,
  ResourceFeatureTypes.audio,
  ResourceFeatureTypes.simulation,
];

export enum ResourceFeatureNames {
  Type = 'dlr_type',
  Title = 'dlr_title',
  Description = 'dlr_description',
  Access = 'dlr_access',
  ContainsOtherPeoplesWorks = 'dlr_licensehelper_contains_other_peoples_work',
  UsageClearedWithOwner = 'dlr_licensehelper_usage_cleared_with_owner',
  ResourceRestriction = 'dlr_licensehelper_resource_restriction',
  CanBeUsedCommercially = 'dlr_licensehelper_can_be_used_commercially',
  OthersCanModifyAndBuildUpon = 'dlr_licensehelper_others_can_modify_and_build_upon',
}

export enum ResourceFeatureNamesFullPath {
  Type = 'features.dlr_type',
  Title = 'features.dlr_title',
  Description = 'features.dlr_description',
  Access = 'features.dlr_access',
  ContainsOtherPeoplesWorks = 'features.dlr_licensehelper_contains_other_peoples_work',
  UsageClearedWithOwner = 'features.dlr_licensehelper_usage_cleared_with_owner',
  ResourceRestriction = 'features.dlr_licensehelper_resource_restriction',
  CanBeUsedCommercially = 'features.dlr_licensehelper_can_be_used_commercially',
  OthersCanModifyAndBuildUpon = 'features.dlr_licensehelper_others_can_modify_and_build_upon',
}

export enum ContentFeatureNames {
  Title = 'dlr_content_title',
}

export enum ContributorFeatureNames {
  Type = 'dlr_contributor_type',
  Name = 'dlr_contributor_name',
}

export enum CreatorFeatureAttributes {
  Name = 'dlr_creator_name',
}

export enum ContentFeatureAttributes {
  Title = 'dlr_content_title',
}

export enum FieldNames {
  Features = 'features',
  ContributorsBase = 'contributors',
  CreatorsBase = 'creators',
  ContentsBase = 'contents',
  LicensesBase = 'licenses',
  Tags = 'tags',
  MasterContent = 'masterContent',
  AdditionalContent = 'additionalContent',
}

export enum ResourceFormStep {
  Description = 0,
  Contributors = 1,
  Contents = 2,
  AccessAndLicense = 3,
  Preview = 4,
}

export const ResourceFormSteps = [
  ResourceFormStep.Description,
  ResourceFormStep.Contributors,
  ResourceFormStep.Contents,
  ResourceFormStep.AccessAndLicense,
  ResourceFormStep.Preview,
];

export const getStepLabel = (step: ResourceFormStep) => {
  switch (step) {
    case ResourceFormStep.Description:
      return 'resource.form_steps.description';
    case ResourceFormStep.Contributors:
      return 'resource.form_steps.contributors';
    case ResourceFormStep.Contents:
      return 'resource.form_steps.contents';
    case ResourceFormStep.AccessAndLicense:
      return 'resource.form_steps.access_and_licence';
    case ResourceFormStep.Preview:
      return 'resource.form_steps.preview';
  }
};

export const CompareCreators = (creatorA: Creator, creatorB: Creator): number => {
  if (creatorA.features.dlr_creator_order && creatorB.features.dlr_creator_order) {
    return creatorA.features.dlr_creator_order - creatorB.features.dlr_creator_order;
  } else {
    return 0;
  }
};

export const TAGS_MAX_LENGTH = 30;

export interface ResourceStatistic {
  features: ResourceStatisticFeatures;
  identifier: string;
}
export interface ResourceStatisticFeatures {
  dlr_statistics_delivery_count?: string;
}

export interface ResourceOwner {
  identifier: string;
  features: ResourceOwnerFeatures;
}

export interface ResourceOwnerFeatures {
  dlr_owner_identifier: string;
  dlr_owner_subject: string; //feide-id of the owner
  dlr_owner_timer_created: string; //time the subject got ownership of this resource
}
export interface KalturaPresentation {
  id: string;
  title: string;
  timeRecorded: string;
  downloadUrl: string;
  url: string;
  thumbnailUrl: string;
  institution: string;
  dlrContentIdentifier: string;
  description?: string;
}
