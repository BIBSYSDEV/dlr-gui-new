import { FormikErrors, FormikProps, FormikTouched, FormikValues, getIn } from 'formik';
import { ResourceFormSteps } from '../pages/edit_resource/ResourceForm';
import { Content } from '../types/content.types';
import {
  ContentFeatureAttributes,
  Contributor,
  ContributorFeatureNames,
  Creator,
  CreatorFeatureAttributes,
  FieldNames,
  ResourceFeatureNamesFullPath,
} from '../types/resource.types';

export const hasTouchedError = (formikProps: FormikProps<FormikValues>, index: number): boolean => {
  if (!Object.keys(formikProps.errors).length || !Object.keys(formikProps.touched).length) {
    return false;
  }
  let fieldNames: string[] = [];
  index === ResourceFormSteps.Description && (fieldNames = getAllDescriptionStepFieldNames());
  index === ResourceFormSteps.AccessAndLicense && (fieldNames = getAllAccessAndLicenseStepFieldNames());
  index === ResourceFormSteps.Contributors && (fieldNames = getAllFieldsFromContributorsPanel(formikProps.values));
  index === ResourceFormSteps.Contents && (fieldNames = getAllContentsFields(formikProps.values));

  if (fieldNames.length) {
    return fieldNames.some((fieldName) => {
      const fieldHasError = !!getIn(formikProps.errors, fieldName);
      const fieldIsTouched = !!getIn(formikProps.touched, fieldName);
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
