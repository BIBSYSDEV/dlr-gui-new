import { FormikErrors, FormikTouched, getIn } from 'formik';
import { ResourceFormSteps } from '../pages/ResourceForm';
import {
  AccessAndLicenseFieldNames,
  ContributorsFieldNames,
  DescriptionFieldNames,
  FilesFieldNames,
} from './FieldNames';

const descriptionFieldNames = Object.values(DescriptionFieldNames);
const accessAndLicenseFieldNames = Object.values(AccessAndLicenseFieldNames);
const contributorsFieldNames = Object.values(ContributorsFieldNames);
const filesFieldNames = Object.values(FilesFieldNames);

export const hasTouchedError = (
  errors: FormikErrors<unknown>,
  touched: FormikTouched<unknown>,
  index: number
): boolean => {
  if (!Object.keys(errors).length || !Object.keys(touched).length) {
    return false;
  }
  let fieldNames: string[] = [];
  index === ResourceFormSteps.Description && (fieldNames = descriptionFieldNames);
  index === ResourceFormSteps.AccessAndLicense && (fieldNames = accessAndLicenseFieldNames);
  index === ResourceFormSteps.Contributors && (fieldNames = contributorsFieldNames);
  index === ResourceFormSteps.Files && (fieldNames = filesFieldNames);

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
