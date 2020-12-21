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

export const AccessTypes = ['open', 'private'];
