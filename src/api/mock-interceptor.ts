import Axios, { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockSearchResults } from '../utils/testfiles/search_results';
import { licenses as allLicenses } from '../utils/testfiles/licenses';
import { API_PATHS } from '../utils/constants';
import { FileApiPaths } from './fileApi';
import {
  createMockContributor,
  createMockCreator,
  mockCompleteUpload,
  mockContents,
  mockContributors,
  mockCourses,
  mockCreatedResourceWithContents,
  mockCreateUpload,
  mockCreators,
  mockDefaultResource,
  mockLicenses,
  mockMyResources,
  mockPrepareUpload,
  mockResource,
  mockResourceEvents,
  mockResourceReadAccess,
  mockTags,
  mockToken,
  mockUser,
} from './mockdata';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  const loggedReply = (config: AxiosRequestConfig, statusCode: number, mockedResult: unknown) => {
    console.log('MOCKED API-CALL: ', config, statusCode, mockedResult);
    return [statusCode, mockedResult];
  };

  // SEARCH
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesSearchPath}/resources/search.*`))
    .reply((config) => loggedReply(config, 200, mockSearchResults));

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
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents`)).reply(200, mockContents);
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents/.*/titles`)).reply(200);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents/.*`)).reply(202);

  //RESOURCE CREATORS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators`)).reply(200, mockCreators);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators`)).reply(202, createMockCreator());
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*`)).reply(202, {});
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*`)).reply(202, {});

  //RESOURCE TAGS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/tags/types/tag`)).reply(200, mockTags);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/tags/.*/types/tag`)).reply(202);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/tags/.*/types/tag`)).reply(202);

  //RESOURCE CONTRIBUTORS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors`)).reply(200, mockContributors);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors/.*`)).reply(202, {});
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors/.*/features`)).reply(200);
  mock
    .onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors/.*`))
    .reply((config) => loggedReply(config, 202, {}));
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contributors`))
    .reply((config) => loggedReply(config, 202, createMockContributor()));

  // RESOURCE
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/${mockMyResources[0].identifier}`))
    .reply(200, mockMyResources[0]);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/${mockMyResources[1].identifier}`))
    .reply(200, mockMyResources[1]);
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*`)).reply(200, mockResource);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/features`)).reply(200);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/publications`)).reply(200);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources`)).reply(200, mockCreatedResourceWithContents);
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/access`)).reply(200);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*`)).reply(202);

  //RESOURCE SHARING
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/.*`))
    .reply(200, mockResourceReadAccess);
  mock
    .onPost(
      new RegExp(
        `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/.*/profiles/consumer/institutions/current`
      )
    )
    .reply(200);
  mock
    .onDelete(
      new RegExp(
        `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/.*/profiles/consumer/institutions/current`
      )
    )
    .reply(202);
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/.*/profiles/consumer/user`))
    .reply(200);
  mock
    .onDelete(new RegExp(`${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/.*/profiles/consumer/user`))
    .reply(202);

  //Courses:
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendTeachingPath}/teachings/institutions/.*?after=.*`))
    .reply(200, mockCourses);

  //RESOURCE CONTENT EVENTS:
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesEventsPath}/resources/.*/events`))
    .reply(200, mockResourceEvents);

  //DEFAULTS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendDefaultsPath}/resources/.*`)).reply(200, mockDefaultResource);

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
