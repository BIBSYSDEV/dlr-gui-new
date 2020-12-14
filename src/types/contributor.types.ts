export interface contributorTypes {
  shortHand: string;
  norwegianDescription: string;
  englishDescription: string;
}

export const contributorTypeList: contributorTypes[] = [
  { shortHand: 'ContactPerson', norwegianDescription: 'Kontakt person', englishDescription: 'Contact person' },
  { shortHand: 'DataCollector', norwegianDescription: 'Datasamler', englishDescription: 'Data collector' },
  { shortHand: 'DataCurator', norwegianDescription: 'Datarøkter (data curator)', englishDescription: 'Data curator' },
  { shortHand: 'DataManager', norwegianDescription: 'Data manager', englishDescription: 'Data manager' },
  { shortHand: 'Distributor', norwegianDescription: 'Distributør', englishDescription: 'Distributor' },
  { shortHand: 'Editor', norwegianDescription: 'Redaktør', englishDescription: 'Editor' },
  {
    shortHand: 'HostingInstitution',
    norwegianDescription: 'Vertsinstitusjon',
    englishDescription: 'Hosting institution',
  },
  { shortHand: 'Other', norwegianDescription: 'Annet', englishDescription: 'Other' },
  { shortHand: 'Producer', norwegianDescription: 'Produsent', englishDescription: 'Producer' },
  { shortHand: 'ProjectLeader', norwegianDescription: 'Prosjektleder (leader)', englishDescription: 'Project leader' },
  {
    shortHand: 'ProjectManager',
    norwegianDescription: 'Prosjektleder (manager) ',
    englishDescription: 'Project manager',
  },
  { shortHand: 'ProjectMember', norwegianDescription: 'Prosjektmedlem', englishDescription: 'Projeckt member' },
  {
    shortHand: 'RegistrationAgency',
    norwegianDescription: 'Registration agency',
    englishDescription: 'Registration agency',
  },
  {
    shortHand: 'RegistrationAuthority',
    norwegianDescription: 'Registration authority',
    englishDescription: 'Registration authority',
  },
  { shortHand: 'RelatedPerson', norwegianDescription: 'Medvirkende', englishDescription: 'Related person' },
  { shortHand: 'ResearchGroup', norwegianDescription: 'Forskningsgruppe', englishDescription: 'Research group' },
  { shortHand: 'Researcher', norwegianDescription: 'Forsker', englishDescription: 'Researcher' },
  { shortHand: 'Rightsholder', norwegianDescription: 'Rettighetshavende', englishDescription: 'Rightsholder' },
  { shortHand: 'Sponsor', norwegianDescription: 'Sponsor', englishDescription: 'Sponsor' },
  { shortHand: 'Supervisor', norwegianDescription: 'Veilleder', englishDescription: 'Supervisor' },
  {
    shortHand: 'WorkpackageLeader',
    norwegianDescription: 'Workpackage leader',
    englishDescription: 'Workpackage leader',
  },
];
