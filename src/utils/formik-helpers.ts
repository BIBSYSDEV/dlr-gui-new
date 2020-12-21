import { FormikErrors, FormikTouched, getIn } from 'formik';
import { ResourceFormSteps } from '../pages/ResourceForm';
import {
  AccessAndLicenseFieldNames,
  ContentsFieldNames,
  ContributorsFieldNames,
  DescriptionFieldNames,
  FieldNames,
  SpecificContentFieldNames,
} from './FieldNames';
import { Content } from '../types/content.types';

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const accessAndLicenseFieldNames = Object.values(AccessAndLicenseFieldNames);
const contributorsFieldNames = Object.values(ContributorsFieldNames);

export const hasTouchedError = (formikProps: any, index: number): boolean => {
  if (!Object.keys(formikProps.errors).length || !Object.keys(formikProps.touched).length) {
    return false;
  }
  let fieldNames: string[] = [];
  index === ResourceFormSteps.Description && (fieldNames = descriptionFieldNames);
  index === ResourceFormSteps.AccessAndLicense && (fieldNames = accessAndLicenseFieldNames);
  index === ResourceFormSteps.Contributors && (fieldNames = contributorsFieldNames);
  index === ResourceFormSteps.Contents && (fieldNames = getAllContentsFields(formikProps.values.resource.contents));
  console.log('fieldNames', fieldNames);
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

export const getAllContentsFields = (contents: Content[]): string[] => {
  const fieldNames: string[] = [];
  if (contents.length === 0) {
    fieldNames.push(ContentsFieldNames.CONTENTS);
  } else {
    contents.forEach((content, index) => {
      const baseFieldName = `${ContentsFieldNames.CONTENTS}[${index}].${FieldNames.FEATURE}`;
      fieldNames.push(`${baseFieldName}.${SpecificContentFieldNames.TITLE}`);
    });
  }
  return fieldNames;
};

// export const getAllContributorFields = (contributors: Contributor[]): string[] => {
//   const fieldNames: string[] = [];
//   if (contributors.length === 0) {
//     fieldNames.push(ContributorFieldNames.CONTRIBUTORS);
//   } else {
//     contributors.forEach((contributor, index) => {
//       const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;
//       fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.SEQUENCE}`);
//       fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`);
//       if (contributor.correspondingAuthor) {
//         fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`);
//       }
//     });
//   }
//   return fieldNames;
// };
