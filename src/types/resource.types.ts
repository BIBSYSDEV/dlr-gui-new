//TODO: https://git.unit.no/dlr/dlr-resource-service/-/blob/master/src/main/java/no/bibsys/dlr/microservices/resources/Types.java

import { Content } from './content.types';
import { License } from './license.types';

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
  contents: Content[];
  licenses: License[];
  containsOtherPeoplesWork: string;
  usageClearedWithOwner: string;
}

export const emptyResource: Resource = {
  identifier: '',
  features: {
    dlr_title: '',
    dlr_content: '',
    dlr_content_type: '',
  },
  contents: [],
  contributors: [],
  creators: [],
  licenses: [],
  containsOtherPeoplesWork: '',
  usageClearedWithOwner: '',
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
  dlr_time_created?: string;
  dlr_time_published?: string;
  dlr_title: string;
  dlr_title_alternative?: string;
  dlr_type?: string;
  dlr_thumbnail_url?: string;
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
  Authority?: Authority;
}

export const emptyCreator = {
  identifier: '',
  features: {},
};

interface CreatorFeatures {
  dlr_creator_identifier?: string;
  dlr_creator_name?: string;
  dlr_creator_order?: number;
  dlr_creator_time_created?: string;
}

export interface Contributor {
  identifier: string;
  features: ContributorFeatures;
  Authority?: Authority;
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

interface Authority {
  identifier: string;
  features: AuthorityFeatures;
}
interface AuthorityFeatures {
  dlr_authority?: boolean;
  dlr_authority_entity_type?: string;
  dlr_authority_id?: string;
  dlr_authority_identifier?: string;
  dlr_authority_name?: string;
  dlr_authority_time_created?: string;
}

export enum ResourceFeatureTypes {
  audio = 'Audio',
  document = 'Document',
  image = 'Image',
  presentation = 'Presentation',
  simulation = 'Simulation',
  video = 'Video',
}

export enum ResourceFeatureNames {
  Type = 'dlr_type',
  Title = 'dlr_title',
  Description = 'dlr_description',
  Access = 'dlr_access',
}

export enum ResourceFeatureNamesFullPath {
  Type = 'features.dlr_type',
  Title = 'features.dlr_title',
  Description = 'features.dlr_description',
  Access = 'features.dlr_access',
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
