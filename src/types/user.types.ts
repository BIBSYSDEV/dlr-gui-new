export interface User {
  email: string;
  id: string;
  institution: string;
  issuer: string;
  name: string;
  institutionAuthorities?: InstitutionAuthorities;
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
}
