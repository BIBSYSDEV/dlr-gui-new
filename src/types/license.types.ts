export interface License {
  identifier: string;
  features?: LicenseFeatures;
}

interface LicenseFeatures {
  dlr_license_identifier?: string;
  dlr_license?: boolean;
  dlr_license_code?: string;
  dlr_license_description?: string;
  dlr_license_description_no?: string;
  dlr_license_description_en?: string;
  dlr_license_issuer?: string;
  dlr_license_name?: string;
  dlr_license_name_no?: string;
  dlr_license_name_en?: string;
  dlr_license_time_created?: string;
  dlr_license_url?: string;
  dlr_license_url_en?: string;
  dlr_license_url_image?: string;
  dlr_license_url_no?: string;
}

export const emptyLicense = {
  identifier: '',
  features: {},
};

export enum AccessTypes {
  open = 'open',
  private = 'private',
}

export enum Licenses {
  CC = 'creative_commons',
  BI = 'bi-opphaver-bi',
  NTNU = 'ntnu-internt',
  VID_INTERN = 'vid-intern',
  VID_OPPHAVER = 'vid-opphaver',
  CC_BY = 'CC BY 4.0',
  CC_BY_ND = 'CC BY-ND 4.0',
  CC_BY_SA = 'CC BY-SA 4.0',
  CC_BY_NC = 'CC BY-NC 4.0',
  CC_BY_NC_SA = 'CC BY-NC-SA 4.0',
  CC_BY_NC_ND = 'CC BY-NC-ND 4.0',
  CC_ZERO = 'CC0 1.0',
}

export const CreativeCommonsLicenseCodes: string[] = [
  Licenses.CC_BY,
  Licenses.CC_BY_SA,
  Licenses.CC_BY_NC,
  Licenses.CC_BY_ND,
  Licenses.CC_BY_NC_SA,
  Licenses.CC_BY_NC_ND,
  Licenses.CC_ZERO,
];

export enum InstitutionLicenseProviders {
  NTNU = 'ntnu',
  BI = 'bi',
  VID = 'vid',
}

export enum ContainsOtherPeoplesWorkOptions {
  Yes = 'yes',
  No = 'no',
}

export enum LicenseAgreementsOptions {
  YesOther = 'yes_other',
  NoClearance = 'no_clearance',
}
