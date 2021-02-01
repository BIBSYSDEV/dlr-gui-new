import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockSearchResults } from '../utils/testfiles/search_results';
import { licenses as allLicenses } from '../utils/testfiles/licenses';
import { API_PATHS } from '../utils/constants';
import { User } from '../types/user.types';
import { Contributor, Creator, Resource } from '../types/resource.types';
import { License } from '../types/license.types';
import { Content } from '../types/content.types';
import { FileApiPaths } from './fileApi';
import { v4 as uuidv4 } from 'uuid';

export const mockUser: User = {
  id: 'user123',
  issuer: 'me',
  institution: 'ntnu',
  email: 'test@test.com',
  name: 'Test User',
};

const mockResource: Resource = {
  identifier: 'resource-123',
  features: {
    dlr_title: 'This is a mocked title',
    dlr_content: 'http://www.test.com',
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
        dlr_content: '',
        dlr_content_title: '',
      },
      identifier: '456',
    },
  ],
  contributors: [],
  licenses: [],
  creators: [],
  containsOtherPeoplesWork: '',
  usageClearedWithOwner: '',
};

const mockCalculatedResource: Resource = {
  features: {
    dlr_title: 'This is a mocked generated title',
    dlr_content: 'http://www.test.com',
    dlr_content_type: 'link',
  },
  identifier: 'resource-345',
  licenses: [],
  contents: [],
  contributors: [],
  creators: [],
  containsOtherPeoplesWork: '',
  usageClearedWithOwner: '',
};

const mockMyResources: Resource[] = [
  {
    features: {
      dlr_title: 'MockTitle (Published)',
      dlr_status_published: true,
      dlr_content_type: 'link',
      dlr_content: 'some content',
    },
    identifier: '123',
    licenses: [],
    contents: [],
    contributors: [],
    creators: [],
    containsOtherPeoplesWork: '',
    usageClearedWithOwner: '',
  },
  {
    features: {
      dlr_content_type: 'link',
      dlr_title: 'MockTitle (Unpublished)',
      dlr_status_published: false,
      dlr_content: 'some content',
    },
    identifier: '456',
    licenses: [],
    contents: [],
    contributors: [],
    creators: [],
    containsOtherPeoplesWork: '',
    usageClearedWithOwner: '',
  },
  {
    features: {
      dlr_title: 'AnotherMockTitle (Published)',
      dlr_content_type: 'link',
      dlr_status_published: true,
      dlr_content: 'some content',
    },
    identifier: '789',
    licenses: [],
    contents: [],
    contributors: [],
    creators: [],
    containsOtherPeoplesWork: '',
    usageClearedWithOwner: '',
  },
];

const mockResourceContributors: Contributor[] = [
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

const mockResourceEmptyContributor: Contributor = {
  identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
  features: {
    dlr_contributor_identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
    dlr_contributor_time_created: '2020-11-05T12:47:18.635Z',
  },
};

const mockLicenses: License[] = [
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

const mockCreators: Creator[] = [
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

const createMockCreator = (): Creator => {
  const generatedId = uuidv4();
  return {
    identifier: `creator-${generatedId}`,
    features: {
      dlr_creator_identifier: `creator-${generatedId}`,
      dlr_creator_time_created: '2020-12-07T08:19:55.294Z',
    },
  };
};

const mockContent: Content[] = [
  {
    identifier: '1231242',
    features: {
      dlr_content: 'adfasdf',
      dlr_content_identifier: 'adfasdf',
      dlr_content_content_type: 'image',
      dlr_content_title: '',
    },
  },
  {
    identifier: '437829',
    features: {
      dlr_content: 'metadata_external.json',
      dlr_content_identifier: 'adfasdf',
      dlr_content_content_type: 'image',
      dlr_content_title: 'metadata_external.json',
    },
  },
];

const mockCreatedResourceWithContents = {
  contents: mockContent,
  identifier: 'resource-345',
  features: {
    dlr_content: 'content mock',
  },
};

const mockToken = 'mockToken';

const mockCreateUpload = { uploadId: 'asd', key: 'sfd' };
const mockPrepareUpload = { url: `${API_PATHS.guiBackendResourcesContentPath}/xxx` };
const mockCompleteUpload = {};

const mockTags: string[] = ['mock tag1', 'mock tag2'];

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);
  // SEARCH
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesSearchPath}/resources/search.*`)).reply(200, mockSearchResults);

  //FILE UPLOAD | CONTENTS
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesContentPath}.*${FileApiPaths.CREATE}`)).reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, mockCreateUpload]);
      }, 3000);
    });
  });
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.PREPARE}`))
    .reply(200, mockPrepareUpload);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.LIST_PARTS}`)).reply(200);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.ABORT}`)).reply(200);
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesContentPath}${FileApiPaths.COMPLETE}`))
    .reply(200, mockCompleteUpload);

  // LICENSES
  mock.onGet(new RegExp(`${API_PATHS.guiBackendLicensesPath}/licenses/users/authorized`)).reply(200, allLicenses);

  //MY RESOURCES
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/owners/users/current`))
    .reply(200, mockMyResources);

  //RESOURCE LICENSES
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/licenses`)).reply(200, mockLicenses);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/licenses.*`)).reply(202);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/licenses.*`)).reply(202);

  //RESOURCE CONTENTS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents`)).reply(200, mockContent);
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents/.*/titles`)).reply(200);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents/.*`)).reply(202);

  //RESOURCE CREATORS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators`)).reply(200, mockCreators);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators`)).reply(202, createMockCreator);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*`)).reply(202, {});
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*`)).reply(202, {});

  //RESOURCE TAGS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/tags/types/tag`)).reply(200, mockTags);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/tags/.*/types/tag`)).reply(202);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/tags/.*/types/tag`)).reply(202);

  //RESOURCE CONTRIBUTORS
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors`))
    .reply(200, mockResourceContributors);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors/.*`)).reply(202, {});
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors/.*/features`)).reply(200);
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors/.*`)).reply(202, {});
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors`))
    .reply(202, mockResourceEmptyContributor);

  // RESOURCE
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*`)).reply(200, mockResource);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/features`)).reply(200);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/publications`)).reply(200);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources`)).reply(200, mockCreatedResourceWithContents);
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/access`)).reply(200);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*`)).reply(202);

  //DEFAULTS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendDefaultsPath}/resources/.*`)).reply(200, mockCalculatedResource);

  // USER
  mock.onGet(new RegExp(`${API_PATHS.guiBackendUsersPath}/users/authorized`)).reply(200, mockUser);
  mock.onGet(new RegExp(`${API_PATHS.guiBackendLoginPath}/logout`)).reply(200);

  //TOKEN
  mock.onGet(new RegExp(`${API_PATHS.guiBackendLoginPath}/anonymous.*`)).reply(200, mockToken);
  mock.onGet(new RegExp(`${API_PATHS.guiBackendAuthPath}/tokens/jwts/`)).reply(200, { exp: 999999999 });
  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url + ', with method: ' + config.method);
  });
};
