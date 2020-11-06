import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockSearchResults } from '../utils/testfiles/search_results';
import constants from '../utils/constants';
import { User } from '../types/user.types';
import { Resource } from '../types/resource.types';

const mockUser: User = {
  id: '123',
  issuer: 'me',
  institution: '',
  email: 'test@test.com',
  name: 'Test User',
};

const mockResource: Resource = {
  features: {
    dlr_title: 'MockTitle',
  },
  identifier: '123',
};

const mockCalculatedResource: Resource = {
  features: {
    dlr_title: 'MockTitle',
  },
  identifier: '123',
};

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);
  // SEARCH
  mock.onGet(new RegExp(`${constants.guiBackendResourcesSearchPath}/resources/search.*`)).reply(200, mockSearchResults);

  // USER
  mock.onGet(new RegExp(`${constants.guiBackendUsersPath}/users/authorized`)).reply(200, mockUser);

  // RESOURCE
  mock.onGet(new RegExp(`${constants.guiBackendResourcesPath}/resources/.*`)).reply(200, mockResource);
  mock.onPost(new RegExp(`${constants.guiBackendResourcesPath}/resources/.*/features`)).reply(200);
  mock.onPost(new RegExp(`${constants.guiBackendResourcesPath}/resources`)).reply(200, mockResource);
  mock.onGet(new RegExp(`${constants.guiBackendDefaultsPath}/resources/.*`)).reply(200, mockCalculatedResource);

  // GET ANONYMOUS WEB TOKEN
  const mockToken = 'mockToken';
  mock.onGet(new RegExp(`${constants.guiBackendLoginPath}/anonymous.*`)).reply(200, mockToken);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url);
  });
};
