import { FormikErrors, FormikTouched, FormikValues, getIn } from 'formik';
import { Content } from '../types/content.types';
import {
  ContentFeatureAttributes,
  Contributor,
  ContributorFeatureNames,
  Creator,
  CreatorFeatureAttributes,
  FieldNames,
  Resource,
  ResourceContents,
  ResourceFeatureNamesFullPath,
  ResourceFormStep,
} from '../types/resource.types';
import deepmerge, { Options } from 'deepmerge';

export const hasTouchedError = (
  errors: FormikErrors<unknown>,
  touched: FormikTouched<unknown>,
  values: FormikValues,
  index: number
): boolean => {
  if (!Object.keys(errors).length || !Object.keys(touched).length) {
    return false;
  }
  let fieldNames: string[] = [];
  index === ResourceFormStep.Description && (fieldNames = getAllDescriptionStepFieldNames());
  index === ResourceFormStep.AccessAndLicense && (fieldNames = getAllAccessAndLicenseStepFieldNames());
  index === ResourceFormStep.Contributors && (fieldNames = getAllFieldsFromContributorsPanel(values));
  index === ResourceFormStep.Contents && (fieldNames = getAllContentsFields(values));

  if (fieldNames.length) {
    return fieldNames.some((fieldName) => {
      const fieldHasError = !!getIn(errors, fieldName);
      const fieldIsTouched = !!getIn(touched, fieldName);
      // Touched data can be inconsistent with array of null or undefined elements when adding elements dynamically
      // to a FieldArray, so ensure it is a boolean value
      return fieldHasError && fieldIsTouched;
    });
  }
  return false;
};

export const resetFormButKeepTouched = (
  touched: FormikTouched<unknown>,
  resetForm: any,
  values: FormikErrors<unknown>,
  setTouched: any
) => {
  const allTouched = touched;
  resetForm({ values });
  setTouched(allTouched);
};

const getAllDescriptionStepFieldNames = () => {
  return [
    ResourceFeatureNamesFullPath.Type,
    ResourceFeatureNamesFullPath.Title,
    ResourceFeatureNamesFullPath.Description,
    //TODO: tags
  ];
};
const getAllAccessAndLicenseStepFieldNames = () => {
  return [`${FieldNames.LicensesBase}[0]`];
};

const getAllFieldsFromContributorsPanel = (values: FormikValues): string[] => {
  const fieldNames: string[] = [];
  return fieldNames.concat(getAllContributorFields(values.contributors)).concat(getAllCreatorFields(values.creators));
};

const getAllContentsFields = (values: FormikValues): string[] => {
  const fieldNames: string[] = [];
  const contents: Content[] = values.contents.additionalContent;
  if (!contents || contents.length === 0) {
    fieldNames.push(FieldNames.ContentsBase);
  } else {
    contents.forEach((content, index) => {
      const baseFieldName = `${FieldNames.ContentsBase}[${index}].${FieldNames.Features}`;
      fieldNames.push(`${baseFieldName}.${ContentFeatureAttributes.Title}`);
    });
  }
  return fieldNames;
};

const getAllContributorFields = (contributors: Contributor[]): string[] => {
  const fieldNames: string[] = [];
  if (!contributors || contributors.length === 0) {
    fieldNames.push(FieldNames.ContributorsBase);
  } else {
    contributors.forEach((contributor, index) => {
      const baseFieldName = `${FieldNames.ContributorsBase}[${index}].${FieldNames.Features}`;
      fieldNames.push(`${baseFieldName}.${ContributorFeatureNames.Name}`);
      fieldNames.push(`${baseFieldName}.${ContributorFeatureNames.Type}`);
    });
  }
  return fieldNames;
};

export const getAllCreatorFields = (creators: Creator[]): string[] => {
  const fieldNames: string[] = [];
  if (!creators || creators.length === 0) {
    fieldNames.push(FieldNames.CreatorsBase);
  } else {
    creators.forEach((creator, index) => {
      const baseFieldName = `${FieldNames.CreatorsBase}[${index}].${FieldNames.Features}`;
      fieldNames.push(`${baseFieldName}.${CreatorFeatureAttributes.Name}`);
    });
  }
  return fieldNames;
};

export const overwriteArrayMerge = (destinationArray: unknown[], sourceArray: unknown[], options?: Options) =>
  sourceArray;
export const mergeTouchedFields = (touchedArray: FormikTouched<Resource>[]) =>
  deepmerge.all(touchedArray, { arrayMerge: overwriteArrayMerge });

export const touchedDescriptionFields: FormikTouched<Resource> = {
  features: {
    dlr_title: true,
    dlr_description: true,
    dlr_type: true,
  },
};

export const touchedContributorsFields = (
  contributors: Contributor[],
  creators: Creator[]
): FormikTouched<Resource> => ({
  contributors: contributors.map(() => ({
    features: {
      dlr_contributor_name: true,
    },
  })),
  creators: creators.map(() => ({
    features: {
      dlr_creator_name: true,
    },
  })),
});

export const touchedContentsFields = (contents: ResourceContents): FormikTouched<Resource> => ({
  contents: {
    additionalContent: contents.additionalContent.map(() => ({ features: { dlr_content_title: true } })),
    masterContent: { features: { dlr_content_title: true } },
  },
});

export const touchedAccessAndLicenseFields: FormikTouched<Resource> = {
  containsOtherPeoplesWork: true,
  usageClearedWithOwner: true,
  licenses: [{ identifier: true }],
};

export const touchedPreviewFields: FormikTouched<Resource> = {};
