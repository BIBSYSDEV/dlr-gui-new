export interface User {
  email: string;
  id: string;
  institution: string;
  issuer: string;
  name: string;
}

export const emptyUser: User = {
  id: '',
  name: '',
  email: '',
  institution: '',
  issuer: '',
};

export enum UserInstitution {
  NTNU = 'NTNU',
  HVL = 'HVL',
  OsloMet = 'OsloMet',
  UiB = 'Uib',
  BI = 'BI',
  Unit = 'unit',
}
