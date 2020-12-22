import { FormikErrors, FormikProps, FormikTouched, FormikValues, getIn } from 'formik';
import { ResourceFormSteps } from '../pages/ResourceForm';
import {
  AccessAndLicenseFieldNames,
  ContentsFieldNames,
  ContributorsFieldNames,
  CreatorsFieldNames,
  DescriptionFieldNames,
  FieldNames,
  SpecificContentFieldNames,
  SpecificContributorFieldNames,
  SpecificCreatorFieldNames,
} from './FieldNames';
import { Content } from '../types/content.types';
import { Contributor, Creator } from '../types/resource.types';

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const accessAndLicenseFieldNames = Object.values(AccessAndLicenseFieldNames);

export const hasTouchedError = (formikProps: FormikProps<FormikValues>, index: number): boolean => {
  if (!Object.keys(formikProps.errors).length || !Object.keys(formikProps.touched).length) {
    return false;
  }
  let fieldNames: string[] = [];
  index === ResourceFormSteps.Description && (fieldNames = descriptionFieldNames);
  index === ResourceFormSteps.AccessAndLicense && (fieldNames = accessAndLicenseFieldNames);
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
    fieldNames.push(ContentsFieldNames.CONTENTS);
  } else {
    contents.forEach((content, index) => {
      const baseFieldName = `${ContentsFieldNames.CONTENTS}[${index}].${FieldNames.FEATURE}`;
      fieldNames.push(`${baseFieldName}.${SpecificContentFieldNames.TITLE}`);
    });
  }
  return fieldNames;
};

const getAllContributorFields = (contributors: Contributor[]): string[] => {
  const fieldNames: string[] = [];
  if (!contributors || contributors.length === 0) {
    fieldNames.push(ContributorsFieldNames.CONTRIBUTORS);
  } else {
    contributors.forEach((contributor, index) => {
      const baseFieldName = `${ContributorsFieldNames.CONTRIBUTORS}[${index}].${FieldNames.FEATURE}`;
      fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.NAME}`);
      fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.TYPE}`);
    });
  }
  return fieldNames;
};

export const getAllCreatorFields = (creators: Creator[]): string[] => {
  const fieldNames: string[] = [];
  if (!creators || creators.length === 0) {
    fieldNames.push(CreatorsFieldNames.CREATORS);
  } else {
    creators.forEach((creator, index) => {
      const baseFieldName = `${CreatorsFieldNames.CREATORS}[${index}].${FieldNames.FEATURE}`;
      fieldNames.push(`${baseFieldName}.${SpecificCreatorFieldNames.NAME}`);
    });
  }
  return fieldNames;
};
