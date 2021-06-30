import { API_PATHS } from '../utils/constants';
import Axios, { AxiosResponse } from 'axios';
import {
  AppFeature,
  AppValue,
  EmailNotificationStatus,
  emptyInstitutionAuthorities,
  InstitutionAuthorities,
  InstitutionProfilesNames,
  User,
  UserRoleFromInstitution,
} from '../types/user.types';
import { AuthTokenClaims } from '../types/auth.types';
import { authenticatedApiRequest } from './api';

export const getAnonymousWebToken = (): Promise<AxiosResponse<string>> => {
  return Axios({
    url: encodeURI(`${API_PATHS.guiBackendLoginPath}/anonymous`),
    method: 'GET',
  });
};

export const getUserData = (): Promise<AxiosResponse<User>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendUsersPath}/users/authorized`),
    method: 'GET',
  });
};

export const getTokenExpiry = (token: string): Promise<AxiosResponse<AuthTokenClaims>> => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendAuthPath}/tokens/jwts/${token}/claims`),
    method: 'GET',
  });
};

export const logout = () => {
  return authenticatedApiRequest({
    url: encodeURI(`${API_PATHS.guiBackendLoginPath}/logout`),
    method: 'GET',
  });
};

export const getUserAuthorizationsInstitution = async (): Promise<InstitutionAuthorities> => {
  const apiResponse: AxiosResponse<UserRoleFromInstitution> = await authenticatedApiRequest({
    url: encodeURI(
      `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/institutions/current`
    ),
    method: 'GET',
  });

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

export const getUserAuthorizationCourses = (): Promise<AxiosResponse<string[]>> => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendUserAuthorizationsPath}/authorizations/users/authorized/profiles/dlr_course_student`,
    method: 'GET',
  });
};

export const getEmailNotificationStatus = async () => {
  const appSettingResponse: AxiosResponse<EmailNotificationStatus[]> = await authenticatedApiRequest({
    url: `${API_PATHS.guiBackendUserSettingsPath}/settings/users/authorized/apps/dlr_learning`,
    method: 'GET',
  });
  return appSettingResponse.data[0]
    ? appSettingResponse.data[0].feature === AppFeature.Email && appSettingResponse.data[0].value === AppValue.True
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
