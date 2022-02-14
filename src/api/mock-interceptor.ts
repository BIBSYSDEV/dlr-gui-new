import Axios, { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockSearchResults, mockSearchResultsNoResult } from '../utils/testfiles/search_results';
import { licenses as allLicenses } from '../utils/testfiles/licenses';
import { API_PATHS } from '../utils/constants';
import { FileApiPaths } from './fileApi';
import {
  createMockContributor,
  createMockCreator,
  mockAdminList,
  mockAppFeatureResponse,
  mockAuthoritySearchResponse,
  mockAuthoritySearchResponse2,
  mockAuthorizationProfiles,
  mockCompleteUpload,
  mockContent,
  mockContents,
  mockContributors,
  mockCourses,
  mockCreatedResourceWithContents,
  mockCreateUpload,
  mockCreatorOrContributorAuthoritiesResponse,
  mockCreators,
  mockCuratorList,
  mockDefaultContent,
  mockDefaultResource,
  mockEditorList,
  mockEmailNotificationStatusResponse,
  mockFacets,
  mockInstitutionAuthorities,
  mockInstitutionUser,
  mockInstitutionUserYourself,
  mockKalturaResources,
  mockLicenses,
  mockMyResources,
  mockOtherinstitutionUser,
  mockPanoptoResources,
  mockPrepareUpload,
  mockResource,
  mockResourceEvents,
  mockResourceOwners,
  mockResourceReadAccess,
  mockResourceStatistics,
  mockRestrictiveAuthorizationProfiles,
  mockTags,
  mockTagSuggestions,
  mockText,
  mockToken,
  mockUser,
  mockUserCourses,
  mockWorkListOwnerRequest,
  mockWorkListReportResource,
  mockWorkListRequestDOI,
  readAccessListWithoutInstitution,
} from './mockdata';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  const mockGetDelayedAndLogged = (pathPattern: string, statusCode: number, mockedResponse: any, delay = 0) => {
    mock.onGet(new RegExp(pathPattern)).reply((config) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(loggedReply(config, statusCode, mockedResponse));
        }, delay);
      });
    });
  };

  const loggedReply = (config: AxiosRequestConfig, statusCode: number, mockedResult: unknown) => {
    /* eslint-disable no-console */
    console.log('MOCKED API-CALL: ', config.url);
    //console.log('MOCKED API-CALL: ', config, statusCode, mockedResult);
    return [statusCode, mockedResult];
  };

  //Get text content file:
  mock.onGet(new RegExp('textfilepath')).reply(200, mockText);

  //statistics
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesStatisticsPath}/statistics/resources/*.`))
    .reply(200, mockResourceStatistics);

  //WORK LIST
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_identifier_doi_request`))
    .reply(200, mockWorkListRequestDOI);
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/identifiers/doi/requests/current/refusals`))
    .reply(201);
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/identifiers/doi/requests/current/approvals`))
    .reply(201);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/identifiers/doi/requests`)).reply(201);
  mock
    .onPost(
      new RegExp(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_complaint/items/.*/completion`)
    )
    .reply(201);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_complaint`))
    .reply(200, mockWorkListReportResource);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/owners/requests`)).reply(201);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendWorklistsPath}/worklists/types/dlr_resource_owner_request`))
    .reply(200, mockWorkListOwnerRequest);
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/owners/requests/current/refusals`))
    .reply(201);
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/owners/requests/current/approvals`))
    .reply(201);
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/owners`)).reply(200, mockResourceOwners);

  //AUTHORITY
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendAuthoritiesPath}/authorities/search\\?q=C.*`))
    .reply(200, mockAuthoritySearchResponse2);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendAuthoritiesPath}/authorities/search.*`))
    .reply(200, mockAuthoritySearchResponse);

  mockGetDelayedAndLogged(`${API_PATHS.guiBackendResourcesPath}/resources/resource-123/creators/.*/authorities`, 200, [
    mockCreatorOrContributorAuthoritiesResponse,
  ]);
  mockGetDelayedAndLogged(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*/authorities`, 200, []);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*/authorities`)).reply(201);
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*/authorities`)).reply(201);

  // SEARCH
  mockGetDelayedAndLogged(
    `${API_PATHS.guiBackendResourcesSearchPath}/resources/search/advanced\\?query=risi&.*`,
    200,
    mockSearchResultsNoResult
  );
  mockGetDelayedAndLogged(`${API_PATHS.guiBackendResourcesSearchPath}/resources/search.*`, 200, mockSearchResults);

  //TAG-SEARCH
  mockGetDelayedAndLogged(`${API_PATHS.guiBackendResourcesSearchPath}/suggestions/tags.*`, 200, mockTagSuggestions);

  //FILE UPLOAD | CONTENTS
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesContentPath}.*${FileApiPaths.CREATE}`)).reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, mockCreateUpload]);
      }, 1000);
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
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendResourcesPath}/resources/${mockMyResources[1].identifier}/authorizations/users/authorized`
      )
    )
    .reply(200, mockRestrictiveAuthorizationProfiles);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/authorizations/users/authorized`))
    .reply(200, mockAuthorizationProfiles);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/owners/users/current`))
    .reply(200, mockMyResources);

  //RESOURCE LICENSES
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/licenses`)).reply(200, mockLicenses);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/licenses.*`)).reply(202);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/licenses.*`)).reply(202);

  //RESOURCE CONTENTS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents`)).reply(200, mockContents);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendResourceDefaultContentPath}/.*/contents/default`))
    .reply(200, mockDefaultContent);
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesContentPath}/.*`)).reply(200, mockDefaultContent);

  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents/.*/titles`)).reply(200);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents.*`)).reply(200, mockContent);
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/contents/.*`)).reply(202);

  //RESOURCE CREATORS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators`)).reply(200, mockCreators);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators`)).reply(202, createMockCreator());
  mock.onDelete(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*`)).reply(202, {});
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/creators/.*`)).reply(202, {});

  //UPDATE SEARCH INDEX
  mock.onPut(new RegExp(`${API_PATHS.guiBackendResourcesPath}/resources/.*/searchindexing`)).reply(202, {});

  //FACETS
  mock.onGet(new RegExp(`${API_PATHS.guiBackendResourcesSearchPath}/resources/facets`)).reply(200, mockFacets);

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
    .onGet(new RegExp(`${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/.*/info`))
    .reply(200, readAccessListWithoutInstitution);
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

  //LIST AUTHORIZED USERS
  mock
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/accessProfiles/dlr_institution_administrator`
      )
    )
    .reply(200, mockAdminList);
  mock
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/accessProfiles/dlr_institution_editor`
      )
    )
    .reply(200, mockEditorList);
  mock
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/accessProfiles/dlr_institution_curator`
      )
    )
    .reply(200, mockCuratorList);

  //inst-user-roles
  mock
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/${mockInstitutionUserYourself.user}`
      )
    )
    .reply(200, mockInstitutionUserYourself);
  mock
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/${mockOtherinstitutionUser}`
      )
    )
    .reply(401);
  mock
    .onGet(
      new RegExp(`${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/.*`)
    )
    .reply(200, mockInstitutionUser);
  mock
    .onPost(new RegExp(`${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations`))
    .reply(202);
  mock
    .onDelete(
      new RegExp(`${API_PATHS.guiBackendInstitutionUserAutorizationsPath}/institutions/current/authorizations/users/*.`)
    )
    .reply(202);

  // USER
  mock.onGet(new RegExp(`${API_PATHS.guiBackendUsersPath}/users/authorized`)).reply(200, mockUser);
  mock
    .onGet(
      new RegExp(`${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/institutions/current`)
    )
    .reply(200, mockInstitutionAuthorities);
  mock.onGet(new RegExp(`${API_PATHS.guiBackendLoginPath}/logout`)).reply(200);
  mock
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/profiles/dlr_course_student`
      )
    )
    .reply(200, mockUserCourses);
  mock
    .onGet(new RegExp(`${API_PATHS.guiBackendUserSettingsPath}/settings/users/authorized/apps/dlr_learning`))
    .reply(200, mockEmailNotificationStatusResponse);
  mock
    .onPut(
      new RegExp(
        `${API_PATHS.guiBackendUserSettingsPath}/settings/users/authorized/apps/dlr_learning/features/email_notification`
      )
    )
    .reply(201);
  mock
    .onGet(
      new RegExp(
        `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/profiles/dlr_app_feature_user`
      )
    )
    .reply(200, mockAppFeatureResponse);

  //REPORT RESOURCE
  mock.onPost(new RegExp(`${API_PATHS.guiBackendResourcesFeedbacksPath}/feedbacks/resources/.*`)).reply(202);

  //KALTURA
  mock.onGet(new RegExp(`${API_PATHS.guiBackendKalturaPath}/kaltura/presentations`)).reply(200, mockKalturaResources, {
    'content-range': 12,
  });
  mock.onPost(new RegExp(`${API_PATHS.guiBackendKalturaPath}/kaltura/presentations/import`)).reply(202);

  //PANOPTO
  mock.onGet(new RegExp(`${API_PATHS.guiBackendPanoptoPath}/panopto/presentations`)).reply(200, mockPanoptoResources);
  mock.onPost(new RegExp(`${API_PATHS.guiBackendPanoptoPath}/panopto/presentations/import`)).reply(202);

  //TOKEN
  mock.onGet(new RegExp(`${API_PATHS.guiBackendLoginPath}/anonymous.*`)).reply(200, mockToken);
  mock.onGet(new RegExp(`${API_PATHS.guiBackendAuthPath}/tokens/jwts/`)).reply(200, { exp: 999999999 });
  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url + ', with method: ' + config.method);
  });
};
