import {
  Contributor,
  Creator,
  emptyResource,
  Resource,
  ResourceOwner,
  ResourceStatistic,
  VMSResource,
} from '../types/resource.types';
import deepmerge from 'deepmerge';
import {
  AppfeatureEnum,
  AppType,
  AppValue,
  EmailFeature,
  EmailNotificationStatus,
  ResourceAuthorization,
  ResourceAuthorizationProfilesName,
  User,
} from '../types/user.types';
import { License } from '../types/license.types';
import { v4 as uuidv4 } from 'uuid';
import {
  Course,
  CourseSeason,
  publicReadAccess,
  ResourceReadAccess,
  ResourceReadAccessNames,
} from '../types/resourceReadAccess.types';
import { Content } from '../types/content.types';
import { AuthorityResponse, AuthoritySearchResponse } from '../types/authority.types';
import { WorklistRequest, WorkListRequestType } from '../types/Worklist.types';

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
      dlr_access: 'private',
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
  id: 'test@test.com',
  issuer: 'me',
  institution: 'ntnu',
  email: 'test@test.com',
  name: 'Test User',
  institutionAuthorities: {
    isCurator: false,
    isAdministrator: false,
    isPublisher: false,
    isEditor: false,
  },
};

export const mockUserAdmin: User = {
  id: 'test@test.com',
  issuer: 'me',
  institution: 'ntnu',
  email: 'test@test.com',
  name: 'Test User',
  institutionAuthorities: {
    isCurator: true,
    isAdministrator: true,
    isPublisher: true,
    isEditor: true,
  },
};

export const mockInstitutionAuthorities = {
  time: '2021-05-11T08:13:35.538Z',
  user: 'test@sikt.no',
  object: 'sikt',
  profiles: [
    { name: 'dlr_institution_administrator' },
    { name: 'dlr_institution_curator' },
    { name: 'dlr_institution_editor' },
    { name: 'dlr_institution_publisher' },
    { name: 'dlr_institution_user' },
    { name: 'dlr_institution_user_authenticated' },
  ],
};

export const mockInstitutionUser = {
  time: '2021-05-17T08:13:35.538Z',
  user: 'instuser@sikt.no',
  institution: 'myInst',
  profiles: [
    { name: 'dlr_institution_editor' },
    { name: 'dlr_institution_publisher' },
    { name: 'dlr_institution_user' },
    { name: 'dlr_institution_user_authenticated' },
  ],
};

export const mockInstitutionUserYourself = {
  time: '2021-05-17T08:13:35.538Z',
  user: 'test@test.com',
  institution: 'sikt',
  profiles: [
    { name: 'dlr_institution_administrator' },
    { name: 'dlr_institution_editor' },
    { name: 'dlr_institution_publisher' },
    { name: 'dlr_institution_user' },
    { name: 'dlr_institution_user_authenticated' },
  ],
};

export const mockOtherinstitutionUser = 'test@otherinstitution.com';

export const mockCreatorOrContributorAuthoritiesResponse: AuthorityResponse = {
  identifier: '12321321',
  features: {
    dlr_authority_entity_type: 'person',
    dlr_authority_id: '123213214',
    dlr_authority_name: 'User, test',
  },
};

export const mockAuthoritySearchResponse: AuthoritySearchResponse = {
  limit: '2',
  numFound: 2,
  offset: '0',
  results: [
    { id: '213', name: 'User, test', type: 'person' },
    { id: '1214', name: 'User2, test2', type: 'person' },
  ],
};

export const mockAuthoritySearchResponse2: AuthoritySearchResponse = {
  limit: '3',
  numFound: 3,
  offset: '0',
  results: [
    { id: '435', name: 'Creatorson, Creator', type: 'person' },
    { id: '456', name: 'Creatorson2, Creator2', type: 'person' },
    { id: '344', name: 'Creatorson3, Creator3', type: 'person' },
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
  tags: ['tag1', 'tag2'],
});

export const mockContributors: Contributor[] = [
  {
    identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
    features: {
      dlr_contributor_identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
      dlr_contributor_name: 'Sikt',
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
    identifier: '534534534534534534',
    features: {
      dlr_content: 'mockMasterContent',
      dlr_content_type: 'file',
      dlr_content_master: 'true',
      dlr_content_identifier: '534534534534534534',
      dlr_content_content_type: 'image',
      dlr_content_title: 'mockMasterContentTitle',
      dlr_content_size: '2.2 GB',
    },
  },
  {
    identifier: '437829',
    features: {
      dlr_content: 'metadata_external.json',
      dlr_content_identifier: '437829',
      dlr_content_content_type: 'image',
      dlr_content_title: 'metadata_external.json',
      dlr_content_type: 'file',
      dlr_thumbnail_default: 'false',
    },
  },
  {
    identifier: '14342',
    features: {
      dlr_content: 'additional_image.jpg',
      dlr_content_identifier: '14342',
      dlr_content_content_type: 'image',
      dlr_content_title: 'test.jpg',
      dlr_content_type: 'file',
      dlr_thumbnail_default: 'false',
      dlr_content_size: '110 MB',
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

export const mockDefaultContent: Content = {
  identifier: '23123123213',
  features: {
    dlr_content: 'masse_tekst.txt',
    dlr_content_content_type: 'text',
    dlr_content_title: 'masse tekst',
    dlr_content_mime_type: 'text/plain',
    dlr_content_size: '32.9 KB',
    dlr_content_size_bytes: '33720',
    dlr_content_type: 'file',
    dlr_content_url: 'textfilepath',
  },
};

export const mockCreatedResourceWithContents = {
  contents: mockContents,
  identifier: 'resource-345',
  features: {
    dlr_content: 'content mock',
  },
};

export const mockText = 'text: bla blah blah blah blah';

export const mockAdminList = ['admin1@test.com', 'admin2@test.com'];
export const mockEditorList = ['editor1@test.com'];
export const mockCuratorList = ['cur1@test.com', 'cur2@test.com', 'cur3@test.com'];

export const mockToken = 'mockToken';

export const mockCreateUpload = { uploadId: 'asd', key: 'sfd' };
export const mockPrepareUpload = { url: 'https://file-upload.com/files/' };
export const mockCompleteUpload = { location: '16e96cc9-1884-41ac-8448-1e0a3c3838e1' };

export const mockTags: string[] = [
  'mock tag1',
  'mock tag2',
  'mock tag3',
  'mock tag4',
  'mock tag5',
  'mock tag6',
  'mock tag7',
  'mock tag8',
  'mock tag9',
  'mock tag10',
];

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
      value: 'sikt',
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
      value: 'Sikt',
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

export const mockWorkListRequestDOI: WorklistRequest[] = [
  {
    identifier: '123',
    resourceIdentifier: mockResource.identifier,
    submitter: 'epost@epost.no',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.DOIRequest,
    description:
      'description description descriptiondescriptiondescription description description description description description',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
  {
    identifier: '234',
    resourceIdentifier: '456',
    submitter: 'epost@epost.no',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.DOIRequest,
    description: 'short',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
  {
    identifier: '567',
    resourceIdentifier: '123',
    submitter: 'somebody@email.com',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.DOIRequest,
    description:
      'long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
];

export const mockResourceStatistics: ResourceStatistic = {
  identifier: '49cb9dda-aaaa-4300-9b21-c2ff3bc0dd23',
  features: {
    dlr_statistics_delivery_count: '112',
  },
};

export const mockWorkListReportResource: WorklistRequest[] = [
  {
    identifier: '21341234',
    resourceIdentifier: mockResource.identifier,
    submitter: 'epost@epost.no',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.ReportComplaint,
    description:
      'description description descriptiondescriptiondescription description description description description description',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
  {
    identifier: '524352435',
    resourceIdentifier: '34789257',
    submitter: 'epost@epost.no',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.ReportComplaint,
    description: 'short',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
  {
    identifier: '435246687',
    resourceIdentifier: '74876547',
    submitter: 'somebody@email.com',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.ReportComplaint,
    description:
      'long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
];

export const mockUserCourses = [
  'ACIT4015 :: oslomet :: 2021 :: 1',
  'ACIT4050 :: oslomet :: 2021 :: 1',
  'ACIT4090 :: oslomet :: 2021 :: 1',
];

export const mockEmailNotificationStatusResponse: EmailNotificationStatus[] = [
  {
    user: mockUser.id,
    app: AppType.DLR,
    feature: EmailFeature.Email,
    value: AppValue.False,
    time: '2021-06-18T08:23:26.942Z',
  },
];

export const mockAppFeatureResponse = [
  {
    object: AppfeatureEnum.DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_KALTURA,
    profile: [{ name: 'dlr_app_feature_user' }],
    time: '2021-06-29T07:57:36.108Z',
    user: mockUser.id,
  },
  {
    object: AppfeatureEnum.DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_PANOPTO,
    profile: [{ name: 'dlr_app_feature_user' }],
    time: '2021-06-29T07:57:37.108Z',
    user: mockUser.id,
  },
  {
    object: AppfeatureEnum.DLR_APP_FEATURE_SHARE_LEARNING_RESOURCE_WITH_COURSE_STUDENTS,
    profile: [{ name: 'dlr_app_feature_user' }],
    time: '2021-06-29T07:57:36.108Z',
    user: mockUser.id,
  },
  {
    object: AppfeatureEnum.DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_MEDIASITE,
    profile: [{ name: 'dlr_app_feature_user' }],
    time: '2021-06-29T07:57:36.108Z',
    user: mockUser.id,
  },
];

export const mockAuthorizationProfiles: ResourceAuthorization = {
  identifier: mockResource.identifier,
  time: '2021-07-02T10:47:19.490Z',
  user: mockUser.id,
  profiles: [
    { name: ResourceAuthorizationProfilesName.ADMIN },
    { name: ResourceAuthorizationProfilesName.CONSUMER },
    { name: ResourceAuthorizationProfilesName.CONSUMER_PUBLIC },
    { name: ResourceAuthorizationProfilesName.CURATOR },
    { name: ResourceAuthorizationProfilesName.EDITOR },
    { name: ResourceAuthorizationProfilesName.OWNER },
  ],
};

export const mockRestrictiveAuthorizationProfiles: ResourceAuthorization = {
  identifier: mockMyResources[1].identifier,
  time: '2021-07-02T10:47:19.490Z',
  user: mockUser.id,
  profiles: [
    { name: ResourceAuthorizationProfilesName.CONSUMER },
    { name: ResourceAuthorizationProfilesName.CONSUMER_PUBLIC },
  ],
};

export const mockWorkListOwnerRequest: WorklistRequest[] = [
  {
    identifier: '21341234',
    resourceIdentifier: mockResource.identifier,
    submitter: 'epost@epost.no',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.OWNERSHIP_REQUEST,
    description:
      'description description descriptiondescriptiondescription description description description description description',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
  {
    identifier: '524352435',
    resourceIdentifier: '34789257',
    submitter: 'epost@epost.no',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.OWNERSHIP_REQUEST,
    description: 'short',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
  {
    identifier: '435246687',
    resourceIdentifier: '74876547',
    submitter: 'somebody@email.com',
    institution: 'sikt',
    submittedDate: '2021-04-28T11:23:34.250Z',
    type: WorkListRequestType.OWNERSHIP_REQUEST,
    description:
      'long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong long long longlonglonglong longlong longlonglong long long long long long long longlonglonglong longlongv longlonglong longlonglong longvlong longlonglong longlonglong longv longlonglong longlonglong',
    state: 'string',
    stateDate: '2021-04-28T11:23:34.250Z',
  },
];

export const mockResourceOwners: ResourceOwner[] = [
  {
    identifier: '1323123',
    features: {
      dlr_owner_identifier: '1323123',
      dlr_owner_subject: mockUser.id,
      dlr_owner_timer_created: '2021-04-28T11:23:34.250Z',
    },
  },
];

export const mockPanoptoResources: VMSResource[] = [
  {
    id: '54353453453',
    title: 'Sample Panopto Title 1',
    timeRecorded: '6420',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/534534545/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/534534545/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/534534545/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '',
  },
  {
    id: '4236546541',
    title: 'Sample Panopto Title 2',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
];

export const mockKalturaResources: VMSResource[] = [
  {
    id: '54353453453',
    title: 'Sample Kaltura Title 1',
    timeRecorded: '6420',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/534534545/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/534534545/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/534534545/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '',
  },
  {
    id: '4236546541',
    title: 'Sample Kaltura Title 2',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '4236546542',
    title: 'Sample Kaltura Title 3',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '42365465444',
    title: 'Sample Kaltura Title 4',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '4236546544',
    title: 'Sample Kaltura Title 5',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '42365465446',
    title: 'Sample Kaltura Title 6',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '423654654467',
    title: 'Sample Kaltura Title 7',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '423654654468',
    title: 'Sample Kaltura Title 8',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '423654654469',
    title: 'Sample Kaltura Title 9',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '4236546544610',
    title: 'Sample Kaltura Title 10',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '4236546544611',
    title: 'Sample Kaltura Title 11',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
  {
    id: '4236546544612',
    title: 'Sample Kaltura Title 12',
    timeRecorded: '6421',
    downloadUrl:
      'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/download/protocol/https/flavorParamIds/0',
    url: 'https://dchsou11xk84p.cloudfront.net/p/285/sp/28500/playManifest/entryId/7547/format/url/protocol/https',
    thumbnailUrl: 'https://d38ynedpfya4s8.cloudfront.net/p/285/sp/28500/thumbnail/entry_id/7547/version/100002',
    institution: 'sikt',
    dlrContentIdentifier: '54689068054',
  },
];

export const readAccessListWithoutInstitution: publicReadAccess[] = [
  { name: ResourceReadAccessNames.Person, subject: '2' },
  { name: ResourceReadAccessNames.Course, subject: mockUserCourses[0] },
];
