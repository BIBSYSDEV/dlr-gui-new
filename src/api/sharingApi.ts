import { authenticatedApiRequest } from './api';
import { API_PATHS } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { Course, ResourceReadAccess } from '../types/resourceReadAccess.types';
import moment from 'moment/moment';

export const postCurrentUserInstitutionConsumerAccess = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/${resourceIdentifier}/profiles/consumer/institutions/current`,
    method: 'POST',
  });
};

export const deleteCurrentUserInstitutionConsumerAccess = (resourceIdentifier: string) => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/${resourceIdentifier}/profiles/consumer/institutions/current`,
    method: 'DELETE',
  });
};

export const postAdditionalUserConsumerAccess = (resourceIdentifier: string, email: string) => {
  const data = encodeURI(`user=${email}`);
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/${resourceIdentifier}/profiles/consumer/user`,
    method: 'POST',
    data,
  });
};

export const deleteAdditionalUserConsumerAccess = (resourceIdentifier: string, email: string) => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/${resourceIdentifier}/profiles/consumer/users/${email}`,
    method: 'DELETE',
  });
};

export const getResourceReaders = (resourceIdentifier: string): Promise<AxiosResponse<ResourceReadAccess[]>> => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/${resourceIdentifier}`,
    method: 'GET',
  });
};

export const postCourseConsumerAccess = (resourceIdentifier: string, course: Course) => {
  const data = encodeURI(
    `code=${course.features.code}&year=${course.features.year}&season_nr=${course.features.season_nr}`
  );
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/${resourceIdentifier}/profiles/consumer/institutions/current/courses`,
    method: 'POST',
    data,
  });
};

export const deleteCourseConsumerAccess = (
  resourceIdentifier: string,
  courseCode: string,
  courseYear: string,
  courseSeasonNumber: string
) => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendResourcesSharingsPath}/sharings/resources/${resourceIdentifier}/profiles/consumer/institutions/current/courses/subjects/codes/${courseCode}/years/${courseYear}/seasons/${courseSeasonNumber}`,
    method: 'DELETE',
  });
};

export const getCoursesForInstitution = (institution: string): Promise<AxiosResponse<Course[]>> => {
  return authenticatedApiRequest({
    url: `${API_PATHS.guiBackendTeachingPath}/teachings/institutions/${institution}?after=${moment(new Date()).format(
      'YYYY-MM-DDTHH:mm:ss.SSSZ'
    )}`,
    method: 'GET',
  });
};
