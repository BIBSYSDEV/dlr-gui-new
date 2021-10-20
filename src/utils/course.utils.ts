import { Course, CourseSeason } from '../types/resourceReadAccess.types';
import { User } from '../types/user.types';
import { DEV_API_URL } from './constants';

export const parseCourse = (subject: string): Course | null => {
  const courseString = subject.split('::');
  //subject[0]: courseCode,
  //subject[1]: institution,
  // subject[2]: year,
  // subject[3]: Season
  if (courseString[0]?.trim().length > 0 && courseString[2]?.trim().length > 0 && courseString[3]?.trim().length > 0) {
    return {
      features: {
        code: courseString[0].trim(),
        year: courseString[2].trim(),
        season_nr: courseString[3].trim() as CourseSeason,
        institution: courseString[1].trim(),
      },
    };
  } else {
    return null;
  }
};

export const generateCourseSubjectTag = (course: Course, user: User): string => {
  return `${course.features.code} :: ${user.institution.toLowerCase()} :: ${course.features.year} :: ${
    course.features.season_nr
  }`;
};

//function used by components that is rendering mock courses as demonstration on develop instance
export const isDevelopInstance = (): boolean => {
  return process.env.REACT_APP_API_URL === DEV_API_URL;
};
