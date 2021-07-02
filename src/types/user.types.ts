export interface User {
  email: string;
  id: string;
  institution: string;
  issuer: string;
  name: string;
  institutionAuthorities?: InstitutionAuthorities;
  appFeature?: AppFeature;
}

export const emptyUser: User = {
  id: '',
  name: '',
  email: '',
  institution: '',
  issuer: '',
};

export interface institutionUser {
  institution: string;
  profiles: profileName[];
  time: string;
  user: string;
}

export interface profileName {
  name: InstitutionProfilesNames;
}

export interface UserRoleFromInstitution {
  object?: string;
  time?: string;
  user?: string;
  profiles: InstitutionProfiles[];
}

export interface InstitutionProfiles {
  name: InstitutionProfilesNames;
}

export enum InstitutionProfilesNames {
  curator = 'dlr_institution_curator',
  administrator = 'dlr_institution_administrator',
  publisher = 'dlr_institution_publisher',
  editor = 'dlr_institution_editor',
  user = 'dlr_institution_user',
  authenticated = 'dlr_institution_user_authenticated',
}

export interface InstitutionAuthorities {
  isCurator: boolean;
  isAdministrator: boolean;
  isPublisher: boolean;
  isEditor: boolean;
}

export const emptyInstitutionAuthorities: InstitutionAuthorities = {
  isCurator: false,
  isAdministrator: false,
  isPublisher: false,
  isEditor: false,
};

export enum UserInstitution {
  NTNU = 'NTNU',
  HVL = 'HVL',
  OsloMet = 'OsloMet',
  UiB = 'Uib',
  BI = 'BI',
  Unit = 'unit',
  UiT = 'UiT',
  USN = 'USN',
}

export interface EmailNotificationStatus {
  user: string;
  app: AppType;
  feature: EmailFeature;
  value: AppValue;
  time: string;
}

export enum AppType {
  DLR = 'dlr_learning',
  BIRD = 'dlr_research',
}

export enum EmailFeature {
  Email = 'email_notification',
}

export enum AppValue {
  False = 'false',
  True = 'true',
}

export interface AppFeature {
  hasFeatureShareResourceWithCourseStudents: boolean;
  hasFeatureNewResourceFromKaltura: boolean;
  hasFeatureNewResourceFromMediaSite: boolean;
}

export interface AppFeatureResponse {
  object: AppfeatureEnum;
  time: string;
  user: string;
  profiles: AppProfileName[];
}

export enum AppfeatureEnum {
  DLR_APP_FEATURE_SHARE_LEARNING_RESOURCE_WITH_COURSE_STUDENTS = 'dlr_app_feature_share_learning_resource_with_course_students',
  DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_KALTURA = 'dlr_app_feature_new_learning_resource_from_kaltura',
  DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_MEDIASITE = 'dlr_app_feature_new_learning_resource_from_mediasite',
}

interface AppProfileName {
  name: string;
}

export const emptyAppFeature: AppFeature = {
  hasFeatureShareResourceWithCourseStudents: false,
  hasFeatureNewResourceFromKaltura: false,
  hasFeatureNewResourceFromMediaSite: false,
};

export interface ResourceAuthorization {
  identifier: string; //resource identifier
  time: string;
  user: string;
  profiles: ResourceAuthorizationProfiles[];
}

export interface ResourceAuthorizationProfiles {
  name: ResourceAuthorizationProfilesName;
}

export enum ResourceAuthorizationProfilesName {
  ADMIN = 'dlr_resource_administrator',
  CONSUMER = 'dlr_resource_consumer',
  CONSUMER_PUBLIC = 'dlr_resource_consumer_public',
  CURATOR = 'dlr_resource_curator',
  EDITOR = 'dlr_resource_editor',
  OWNER = 'dlr_resource_owner',
}
