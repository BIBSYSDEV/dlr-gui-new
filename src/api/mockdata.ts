import { Contributor, Creator, emptyResource, Resource } from '../types/resource.types';
import deepmerge from 'deepmerge';
import { InstitutionProfilesNames, User, UserRoleFromInstitution } from '../types/user.types';
import { License } from '../types/license.types';
import { v4 as uuidv4 } from 'uuid';
import { Course, CourseSeason, ResourceReadAccess, ResourceReadAccessNames } from '../types/resourceReadAccess.types';
import { Content } from '../types/content.types';

export const mockResource: Resource = deepmerge(emptyResource, {
  identifier: 'resource-123',
  features: {
    dlr_title: 'This is a mocked title',
    dlr_content: 'http://www.test.com',
    dlr_access: '',
    dlr_content_type: 'file',
    dlr_time_published: '2020-11-06T12:47:18.635Z',
    dlr_time_created: '2020-11-01T12:47:18.635Z',
    dlr_submitter_email: 'Test Testesen',
    dlr_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vulputate nunc quis lacus pellentesque congue. ' +
      'Duis id vulputate ex. Praesent elit erat, viverra ac eleifend a, porttitor accumsan nulla. Suspendisse vitae ' +
      'maximus ligula. Sed auctor elit non sapien sagittis molestie. Pellentesque habitant morbi tristique senectus ' +
      'et netus et malesuada fames.',
  },
  contents: [
    {
      features: {
        dlr_content: 'fsd',
        dlr_content_title: 'fsdfsd',
      },
      identifier: '456111',
    },
  ],
});

export const mockMyResources: Resource[] = [
  deepmerge(emptyResource, {
    features: {
      dlr_title: 'MockTitle (Published)',
      dlr_status_published: true,
      dlr_content_type: 'link',
      dlr_submitter_email: 'test@test.com',
      dlr_content: 'some content',
      dlr_access: 'open',
    },
    identifier: '123',
  }),
  deepmerge(emptyResource, {
    features: {
      dlr_content_type: 'link',
      dlr_title: 'MockTitle (Unpublished)',
      dlr_submitter_email: 'test@test.com',
      dlr_status_published: false,
      dlr_content: 'some content',
      dlr_access: 'open',
    },
    identifier: '456',
  }),
  deepmerge(emptyResource, {
    features: {
      dlr_title: 'AnotherMockTitle (Published)',
      dlr_content_type: 'link',
      dlr_submitter_email: 'test@test.com',
      dlr_status_published: true,
      dlr_content: 'some content',
      dlr_access: 'open',
    },
    identifier: '789',
  }),
];

export const mockUser: User = {
  id: 'user123',
  issuer: 'me',
  institution: 'ntnu',
  email: 'test@test.com',
  name: 'Test User',
};

export const mockInstitutionAuthorities: UserRoleFromInstitution = {
  profiles: [
    { name: InstitutionProfilesNames.curator },
    { name: InstitutionProfilesNames.administrator },
    { name: InstitutionProfilesNames.publisher },
    { name: InstitutionProfilesNames.editor },
    { name: InstitutionProfilesNames.user },
    { name: InstitutionProfilesNames.authenticated },
  ],
};

export const mockDefaultResource: Resource = deepmerge(emptyResource, {
  features: {
    dlr_title: 'This is a mocked generated title',
    dlr_content: 'http://www.test.com',
    dlr_content_type: 'link',
  },
  identifier: 'resource-345',
  contents: [],
});

export const mockContributors: Contributor[] = [
  {
    identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
    features: {
      dlr_contributor_identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
      dlr_contributor_name: 'UNIT',
      dlr_contributor_time_created: '2020-11-05T12:47:18.635Z',
      dlr_contributor_type: 'HostingInstitution',
    },
  },
];

export const createMockContributor = (): Contributor => {
  const generatedId = uuidv4();
  return {
    identifier: `contributor-${generatedId}`,
    features: {
      dlr_contributor_identifier: `contributor-${generatedId}`,
      dlr_contributor_time_created: '2020-11-05T12:47:18.635Z',
    },
  };
};

export const mockTagSuggestions = {
  numFound: 4,
  queryTime: 0,
  facet_counts: [
    { count: '1', type: 'dlr_tag', value: 'digital ' },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'digital læring',
    },
    { count: '1', type: 'dlr_tag', value: 'digital læringsressurs' },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'digital undervisning: NTNU Drive',
    },
  ],
};

export const mockLicenses: License[] = [
  {
    identifier: '5d498312-7b5d-40af-a346-3e39df43ca77',
    features: {
      dlr_license: true,
      dlr_license_code: 'CC BY 4.0',
      dlr_license_description:
        'Denne lisensen lar andre dele, endre og bygge videre på verket ditt, også for kommersielle formål, så lenge de navngir deg som den opprinnelige opphaveren. Dette er den mest fleksible og åpne CC-lisensen. Den anbefales dersom du ønsker maksimal spredning og bruk av materialet under en CC-lisens.',
      dlr_license_description_en:
        'This license lets others distribute, remix, tweak, and build upon your work, even for commercial purposes, as long as they credit you for the original creation. This is the most accommodating of licenses offered, and it is recommended for maximum dissemination and use of licensed materials.',
      dlr_license_description_no:
        'Denne lisensen lar andre dele, endre og bygge videre på verket ditt, også for kommersielle formål, så lenge de navngir deg som den opprinnelige opphaveren. Dette er den mest fleksible og åpne CC-lisensen. Den anbefales dersom du ønsker maksimal spredning og bruk av materialet under en CC-lisens.',
      dlr_license_identifier: '5d498312-7b5d-40af-a346-3e39df43ca77',
      dlr_license_issuer: 'Creative Commons',
      dlr_license_name: 'Creative Commons Navngivelse 4.0 Internasjonal',
      dlr_license_name_en: 'Attribution 4.0 International',
      dlr_license_name_no: 'Creative Commons Navngivelse 4.0 Internasjonal',
      dlr_license_time_created: '2019-03-29T13:18:19.245Z',
      dlr_license_url: 'https://creativecommons.org/licenses/by/4.0/deed.no',
      dlr_license_url_en: 'https://creativecommons.org/licenses/by/4.0/deed.en',
      dlr_license_url_image: 'https://i.creativecommons.org/l/by/4.0/80x15.png',
      dlr_license_url_no: 'https://creativecommons.org/licenses/by/4.0/deed.no',
    },
  },
];

export const mockCreators: Creator[] = [
  {
    identifier: 'creator-1',
    features: {
      dlr_creator_name: 'Creator Creatorson',
      dlr_creator_order: 1,
    },
  },
  {
    identifier: 'creator-2',
    features: {
      dlr_creator_name: 'Creator2 Creatorson2',
      dlr_creator_order: 2,
    },
  },
];

export const createMockCreator = (): Creator => {
  const generatedId = uuidv4();
  return {
    identifier: `creator-${generatedId}`,
    features: {
      dlr_creator_identifier: `creator-${generatedId}`,
      dlr_creator_time_created: '2020-12-07T08:19:55.294Z',
    },
  };
};

export const mockContents: Content[] = [
  {
    identifier: 'mockMasterContentID',
    features: {
      dlr_content: 'mockMasterContent',
      dlr_content_type: 'file',
      dlr_content_master: 'true',
      dlr_content_identifier: 'mockMasterContentID',
      dlr_content_content_type: 'image',
      dlr_content_title: 'mockMasterContentTitle',
    },
  },
  {
    identifier: '437829',
    features: {
      dlr_content: 'metadata_external.json',
      dlr_content_identifier: 'adfasf1sdfsdfdf',
      dlr_content_content_type: 'image',
      dlr_content_title: 'metadata_external.json',
      dlr_content_type: 'file',
      dlr_thumbnail_default: 'false',
    },
  },
];

export const mockContent: Content = {
  identifier: '48239057834',
  features: {
    dlr_content: 'mockimage.jpg',
    dlr_content_identifier: '32342',
    dlr_content_content_type: 'image',
    dlr_content_title: 'mock title',
    dlr_content_type: 'file',
  },
};

export const mockCreatedResourceWithContents = {
  contents: mockContents,
  identifier: 'resource-345',
  features: {
    dlr_content: 'content mock',
  },
};

export const mockToken = 'mockToken';

export const mockCreateUpload = { uploadId: 'asd', key: 'sfd' };
export const mockPrepareUpload = { url: 'https://file-upload.com/files/' };
export const mockCompleteUpload = { location: '16e96cc9-1884-41ac-8448-1e0a3c3838e1' };

export const mockTags: string[] = ['mock tag1', 'mock tag2'];

export const mockResourceEvents = {
  limit: '1000',
  offset: '0',
  total: 2,
  resource_events: [
    {
      time: '2021-02-01T07:57:04.625Z',
      event: 'RESOURCE_THUMBNAIL_UPLOADED',
    },
    {
      time: '2021-02-01T07:57:04.617Z',
      event: 'RESOURCE_THUMBNAIL_CREATED',
    },
  ],
};

export const mockResourceReadAccess: ResourceReadAccess[] = [
  {
    time: '2021-02-01T13:54:35.263Z',
    subject: 'someUser@user.no',
    object: 'resource-345',
    features: { dlr_resource_app: 'learning', dlr_resource_title: 'This is a mocked generated title' },
    profiles: [{ time: '2021-02-01T13:36:25.421Z', name: ResourceReadAccessNames.Person, ttlSeconds: 0 }],
  },
  {
    time: '2021-02-01T13:54:35.263Z',
    subject: 'ntnu',
    object: 'resource-345',
    features: { dlr_resource_app: 'learning', dlr_resource_title: 'This is a mocked generated title' },
    profiles: [{ time: '2021-02-01T13:24:03.022Z', name: ResourceReadAccessNames.Institution, ttlSeconds: 0 }],
  },
];

export const mockCourses: Course[] = [
  {
    features: {
      code: 'emne1',
      title_nn: 'emne 1',
      title_nb: 'emne 1',
      title_en: 'subject 1',
      season_nr: CourseSeason.Winter,
      year: '2020',
    },
  },
  {
    features: {
      code: 'test2',
      title_nn: 'test 2',
      title_nb: 'test 2',
      title_en: 'test 2',
      season_nr: CourseSeason.Winter,
      year: '2020',
    },
  },
];

export const mockFacets = {
  numFound: 0,
  queryTime: 0,
  facet_counts: [
    {
      count: '1',
      type: 'dlr_filetype',
      value: 'Audiovisual',
    },
    {
      count: '9',
      type: 'dlr_filetype',
      value: 'Document',
    },
    {
      count: '6',
      type: 'dlr_filetype',
      value: 'Image',
    },
    {
      count: '5',
      type: 'dlr_filetype',
      value: 'Video',
    },
    {
      count: '20',
      type: 'dlr_institution_id',
      value: 'unit',
    },
    {
      count: '20',
      type: 'dlr_institution_id',
      value: 'ntnu',
    },
    {
      count: '20',
      type: 'dlr_institution_id',
      value: 'bi',
    },
    {
      count: '20',
      type: 'dlr_institution_id',
      value: 'oslomet',
    },
    {
      count: '20',
      type: 'dlr_institution_id',
      value: 'uib',
    },
    {
      count: '20',
      type: 'dlr_institution_id',
      value: 'hvl',
    },
    {
      count: '8',
      type: 'dlr_rights_license_name',
      value: 'CC BY 4.0',
    },
    {
      count: '3',
      type: 'dlr_rights_license_name',
      value: 'CC BY-NC 4.0',
    },
    {
      count: '2',
      type: 'dlr_rights_license_name',
      value: 'CC BY-NC-ND 4.0',
    },
    {
      count: '2',
      type: 'dlr_rights_license_name',
      value: 'CC BY-NC-SA 4.0',
    },
    {
      count: '2',
      type: 'dlr_rights_license_name',
      value: 'CC BY-ND 4.0',
    },
    {
      count: '3',
      type: 'dlr_rights_license_name',
      value: 'CC BY-SA 4.0',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: ' høst',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'Creative Commons',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'Joseph Strauss',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'Lisens',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'Unit',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'blad',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'brostein',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'dele',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'fagverksbro',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'gjennbruk',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'jernbanebro',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'klaffebro',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'koronaavstand',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'logo',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'opphavsrett',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'skøyter',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'smittevern',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'tema smile',
    },
    {
      count: '1',
      type: 'dlr_tag',
      value: 'trondheim',
    },
  ],
};
