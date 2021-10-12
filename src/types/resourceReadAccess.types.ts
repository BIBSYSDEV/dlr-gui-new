export interface ResourceReadAccess {
  time?: string;
  subject: string;
  object?: string;
  features?: ResourceReadAccessFeatures;
  profiles: ResourceReadAccessProfiles[];
}

interface ResourceReadAccessFeatures {
  dlr_resource_app: string;
  dlr_resource_title: string;
}

interface ResourceReadAccessProfiles {
  time?: string;
  name: ResourceReadAccessNames;
  expiryTime?: string;
  ttlSeconds?: number;
}

export enum ResourceReadAccessNames {
  Person = 'dlr_shared_resource_consumer',
  Institution = 'dlr_shared_resource_consumer_institution',
  Course = 'dlr_shared_resource_consumer_course',
}

export interface Course {
  features: CourseFeatures;
}

interface CourseFeatures {
  code?: string;
  title_nn?: string;
  title_nb?: string;
  season_title_nb?: string;
  title_en?: string;
  term_nr?: string;
  version?: string;
  year: string;
  season_nr: string | CourseSeason;
  institution?: string;
}

export enum CourseSeason {
  Winter = '0',
  Spring = '1',
  Summer = '2',
  Autumn = '3',
}
