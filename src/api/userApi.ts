import { API_PATHS } from '../utils/constants';
import { AxiosPromise } from 'axios';
import {
  EmailFeature,
  AppValue,
  EmailNotificationStatus,
  emptyInstitutionAuthorities,
  InstitutionAuthorities,
  InstitutionProfilesNames,
  User,
  UserRoleFromInstitution,
  AppFeatureResponse,
  emptyAppFeature,
  AppFeature,
  AppfeatureEnum,
} from '../types/user.types';
import { AuthTokenClaims } from '../types/auth.types';
import { authenticatedApiRequest } from './api';
import axios from 'axios';

export const getAnonymousWebToken = () => {
  return axios.request<string>({
    url: encodeURI(`${API_PATHS.guiBackendLoginPath}/anonymous`),
    method: 'GET',
  });
};

export const getUserData = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendUsersPath}/users/authorized`),
    method: 'GET',
  }) as AxiosPromise<User>;
};

export const getTokenExpiry = (token: string) => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendAuthPath}/tokens/jwts/${token}/claims`),
    method: 'GET',
  }) as AxiosPromise<AuthTokenClaims>;
};

export const logout = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendLoginPath}/logout`),
    method: 'GET',
  });
};

export const getUserAuthorizationsInstitution = async (): Promise<InstitutionAuthorities> => {
  const apiResponse = await (authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/institutions/current`
    ),
    method: 'GET',
  }) as AxiosPromise<UserRoleFromInstitution>);

  const institutionAuthorities = { ...emptyInstitutionAuthorities };
  apiResponse.data.profiles.forEach((profile) => {
    switch (profile.name) {
      case InstitutionProfilesNames.curator:
        institutionAuthorities.isCurator = true;
        break;
      case InstitutionProfilesNames.administrator:
        institutionAuthorities.isAdministrator = true;
        break;
      case InstitutionProfilesNames.editor:
        institutionAuthorities.isEditor = true;
        break;
      case InstitutionProfilesNames.publisher:
        institutionAuthorities.isPublisher = true;
        break;
      default:
        break;
    }
  });

  return institutionAuthorities;
};

export const getUserAuthorizationCourses = () => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/profiles/dlr_course_student`,
    method: 'GET',
  }) as AxiosPromise<string[]>;
};

export const getEmailNotificationStatus = async () => {
  const appSettingResponse = await (authenticatedApiRequest({
    url: `${API_PATHS.guiBackendUserSettingsPath}/settings/users/authorized/apps/dlr_learning`,
    method: 'GET',
  }) as AxiosPromise<EmailNotificationStatus[]>);
  return appSettingResponse.data[0]
    ? appSettingResponse.data[0].feature === EmailFeature.Email && appSettingResponse.data[0].value === AppValue.True
    : false;
};

export const putEmailNotificationStatus = async (status: boolean) => {
  const data = encodeURI(`value=${status}`);
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendUserSettingsPath}/settings/users/authorized/apps/dlr_learning/features/email_notification`,
    method: 'PUT',
    data,
  });
};

export const getUserAppFeaturesApplication = async () => {
  const apiResponse = await (authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/profiles/dlr_app_feature_user`
    ),
    method: 'GET',
  }) as AxiosPromise<AppFeatureResponse[]>);

  const appFeature: AppFeature = { ...emptyAppFeature };
  apiResponse.data.forEach((responseData) => {
    switch (responseData.object) {
      case AppfeatureEnum.DLR_APP_FEATURE_SHARE_LEARNING_RESOURCE_WITH_COURSE_STUDENTS:
        appFeature.hasFeatureShareResourceWithCourseStudents = true;
        break;
      case AppfeatureEnum.DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_KALTURA:
        appFeature.hasFeatureNewResourceFromKaltura = true;
        break;
      case AppfeatureEnum.DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_PANOPTO:
        appFeature.hasFeatureNewResourceFromPanopto = true;
        break;
      case AppfeatureEnum.DLR_APP_FEATURE_NEW_LEARNING_RESOURCE_FROM_MEDIASITE:
        appFeature.hasFeatureNewResourceFromMediaSite = true;
        break;
      default:
        break;
    }
  });
  return appFeature;
};
