import { FormikContextType, FormikErrors, FormikTouched, FormikValues, getIn } from 'formik';
import { Content } from '../types/content.types';
import {
  ContentFeatureAttributes,
  Contributor,
  ContributorFeatureNames,
  Creator,
  CreatorFeatureAttributes,
  FieldNames,
  ResourceFeatureNamesFullPath,
  ResourceFormStep,
  ResourceWrapper,
} from '../types/resource.types';
import deepmerge, { Options } from 'deepmerge';

export const hasTouchedError = (formikContext: FormikContextType<ResourceWrapper>, index: number): boolean => {
  if (!Object.keys(formikContext.errors).length || !Object.keys(formikContext.touched).length) {
    return false;
  }
  let fieldNames: string[] = [];
  index === ResourceFormStep.Description && (fieldNames = getAllDescriptionStepFieldNames());
  index === ResourceFormStep.AccessAndLicense && (fieldNames = getAllAccessAndLicenseStepFieldNames());
  index === ResourceFormStep.Contributors && (fieldNames = getAllFieldsFromContributorsPanel(formikContext.values));
  index === ResourceFormStep.Contents && (fieldNames = getAllContentsFields(formikContext.values));

  if (fieldNames.length) {
    return fieldNames.some((fieldName) => {
      const fieldHasError = !!getIn(formikContext.errors, fieldName);
      const fieldIsTouched = !!getIn(formikContext.touched, fieldName);
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
  return fieldNames
    .concat(getAllContributorFields(values.resource.contributors))
    .concat(getAllCreatorFields(values.resource.creators));
};

const getAllContentsFields = (values: FormikValues): string[] => {
  const fieldNames: string[] = [];
  const contents: Content[] = values.resource.contents;
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
export const mergeTouchedFields = (touchedArray: FormikTouched<ResourceWrapper>[]) =>
  deepmerge.all(touchedArray, { arrayMerge: overwriteArrayMerge });

export const touchedDescriptionFields: FormikTouched<ResourceWrapper> = {
  resource: {
    features: {
      dlr_title: true,
      dlr_description: true,
      dlr_type: true,
    },
  },
};

export const touchedContributorsFields = (
  contributors: Contributor[],
  creators: Creator[]
): FormikTouched<ResourceWrapper> => ({
  resource: {
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
  },
});

export const touchedContentsFields = (contents: Content[]): FormikTouched<ResourceWrapper> => ({
  resource: {
    contents: contents.map(() => ({
      features: {
        dlr_content_title: true,
      },
    })),
  },
});

export const touchedAccessAndLicenseFields: FormikTouched<ResourceWrapper> = {
  resource: {
    licenses: [{ identifier: true }],
  },
};
