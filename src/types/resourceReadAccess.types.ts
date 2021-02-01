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
