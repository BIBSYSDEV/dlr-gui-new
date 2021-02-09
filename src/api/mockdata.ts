import { Contributor, Creator, emptyResource, Resource } from '../types/resource.types';
import deepmerge from 'deepmerge';
import { User } from '../types/user.types';
import { License } from '../types/license.types';
import { v4 as uuidv4 } from 'uuid';
import { Content } from '../types/content.types';
import { API_PATHS } from '../utils/constants';

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
        dlr_content: '',
        dlr_content_title: '',
      },
      identifier: '456',
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

export const mockCalculatedResource: Resource = deepmerge(emptyResource, {
  features: {
    dlr_title: 'This is a mocked generated title',
    dlr_content: 'http://www.test.com',
    dlr_content_type: 'link',
  },
  identifier: 'resource-345',
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

export const mockEmptyContributor: Contributor = {
  identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
  features: {
    dlr_contributor_identifier: '07047aa4-ad55-4fb3-9747-f8d64ee69e12',
    dlr_contributor_time_created: '2020-11-05T12:47:18.635Z',
  },
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

export const mockContent: Content[] = [
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

export const mockCreatedResourceWithContents = {
  contents: mockContent,
  identifier: 'resource-345',
  features: {
    dlr_content: 'content mock',
  },
};

export const mockToken = 'mockToken';

export const mockCreateUpload = { uploadId: 'asd', key: 'sfd' };
export const mockPrepareUpload = { url: `${API_PATHS.guiBackendResourcesContentPath}/xxx` };
export const mockCompleteUpload = {};

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
