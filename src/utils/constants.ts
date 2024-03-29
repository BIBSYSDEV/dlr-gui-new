export const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';
export const API_URL = process.env.REACT_APP_API_URL;
export const BIBSYS_AUTHORITY_URL = 'https://authority.bibsys.no/authority/rest/authorities/html';
export const MICROSOFT_DOCUMENT_VIEWER = 'https://view.officeapps.live.com/op/embed.aspx';
export const DEV_API_URL = 'https://api-dev.dlr.aws.unit.no';

export const resourcePath = '/resources';

export const ACCESSIBILITY_STATEMENT_LINK =
  'https://uustatus.no/nb/erklaringer/publisert/e1d59089-e0c3-4053-a9e4-a339d601276c';

export const PRIVACY_POLICY_LINK_NORWEGIAN = 'https://sikt.no/personvernerklaering-dlr-norsk';

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  UNAUTHORIZED = 401,
  CONFLICT = 409,
}

export const fileUploadPanelId = 'file-upload-panel';

export const API_PATHS = {
  guiBackendLoginPath: '/dlr-gui-backend-login/v1',
  guiBackendUserAuthorizationsPath: '/dlr-gui-backend-user-authorizations/v1',
  guiBackendUsersPath: '/dlr-gui-backend-users/v1',
  guiBackendUserSettingsPath: '/dlr-gui-backend-user-settings/v1',
  guiBackendInstitutionUserAutorizationsPath: '/dlr-gui-backend-institution-user-authorizations/v1',
  guiBackendResourcesStoragePath: '/dlr-gui-backend-resources-storage/v1',
  guiBackendResourcesContentPath: '/dlr-gui-backend-resources-content/v2/contents',
  guiBackendResourceDefaultContentPath: '/dlr-gui-backend-resources-content/v2/resources',
  guiBackendResearchProjectsPath: '/dlr-gui-backend-research-projects/v1',
  guiBackendDmpsPath: '/dlr-gui-backend-dmps/v1',
  guiBackendResourcesSearchPath: '/dlr-gui-backend-resources-search/v1',
  guiBackendResourcesPath: '/dlr-gui-backend-resources/v1',
  guiBackendResourcesImportsPath: '/dlr-gui-backend-resources-imports/v1',
  guiBackendResourcesSharingsPath: '/dlr-gui-backend-resources-sharings/v1',
  guiBackendLicensesPath: '/dlr-gui-backend-licenses/v1',
  guiBackendAuthPath: '/dlr-gui-backend-auth/v1',
  guiBackendResourcesStatisticsPath: '/dlr-gui-backend-resources-statistics/v1',
  guiBackendResourcesEventsPath: '/dlr-gui-backend-resources-events/v1',
  guiBackendWorklistsPath: '/dlr-gui-backend-worklists/v1',
  guiBackendAuthoritiesPath: '/dlr-gui-backend-authorities/v1',
  guiBackendCristinPath: '/dlr-gui-backend-cristin/v1',
  guiBackendTeachingPath: '/dlr-gui-backend-teaching/v1',
  guiBackendResourcesFeedbacksPath: '/dlr-gui-backend-resources-feedbacks/v1',
  guiBackendDefaultsPath: '/dlr-gui-backend-resources-defaults/v1',
  guiBackendMediasitePath: '/dlr-gui-backend-mediasite/v1',
  guiBackendKalturaPath: '/dlr-gui-backend-kaltura/v1',
  guiBackendPanoptoPath: '/dlr-gui-backend-panopto/v1',
  depotApiPath: '/dlr-depot-api/v1',
};
