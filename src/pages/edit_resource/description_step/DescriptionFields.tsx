import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import TagsField from './TagsField';
import { postResourceFeature, updateSearchIndex } from '../../../api/resourceApi';
import { Resource, ResourceFeatureNames, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import ErrorBanner from '../../../components/ErrorBanner';
import ResourceTypeField from './ResourceTypeField';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { Colors } from '../../../themes/mainTheme';
import RequiredFieldInformation from '../../../components/RequiredFieldInformation';
import HelperTextPopover from '../../../components/HelperTextPopover';
import Typography from '@material-ui/core/Typography';
import { StylePopoverTypography } from '../../../components/styled/StyledTypographies';

interface DescriptionFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const DescriptionFields: FC<DescriptionFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, touched, setTouched, validateField } = useFormikContext<Resource>();
  const [saveErrorFields, setSaveErrorFields] = useState<string[]>([]);

  const saveField = async (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    resourceFeatureNamesFullPath: string,
    resourceFeatureNameShort: string
  ) => {
    setAllChangesSaved(false);
    try {
      const eventTargetValueFirstLetterUpperCase =
        event.target.value.slice(0, 1).toUpperCase() + event.target.value.slice(1);
      if (event.target.value !== eventTargetValueFirstLetterUpperCase) {
        switch (resourceFeatureNameShort) {
          case ResourceFeatureNames.Title:
            values.features.dlr_title = eventTargetValueFirstLetterUpperCase;
            break;
          case ResourceFeatureNames.Description:
            values.features.dlr_description = eventTargetValueFirstLetterUpperCase;
            break;
          default:
            break;
        }
      }

      await postResourceFeature(values.identifier, resourceFeatureNameShort, eventTargetValueFirstLetterUpperCase);
      setAllChangesSaved(true);
      setSaveErrorFields([]);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
      //todo: remove from array
    } catch (error) {
      setSaveErrorFields([...saveErrorFields, resourceFeatureNamesFullPath]);
    }
  };

  return (
    <>
      <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor1}>
        <StyledContentWrapper>
          <Field name={ResourceFeatureNamesFullPath.Title}>
            {({ field, meta: { touched, error } }: FieldProps) => (
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    {...field}
                    variant="filled"
                    id="resource-title"
                    required
                    fullWidth
                    label={t('resource.metadata.title')}
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                    inputProps={{ 'data-testid': 'dlr-title-input' }}
                    onBlur={(event) => {
                      handleBlur(event);
                      validateField(ResourceFeatureNamesFullPath.Title);
                      !error && saveField(event, ResourceFeatureNamesFullPath.Title, ResourceFeatureNames.Title);
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <HelperTextPopover
                    ariaButtonLabel={t('explanation_text.title_helper_aria_label')}
                    popoverId="helper-text-title">
                    <Typography variant="body1">{t('explanation_text.title_helper_text')}</Typography>
                  </HelperTextPopover>
                </Grid>
              </Grid>
            )}
          </Field>
        </StyledContentWrapper>
        {saveErrorFields.includes(ResourceFeatureNamesFullPath.Title) && <ErrorBanner userNeedsToBeLoggedIn={true} />}
      </StyledSchemaPartColored>
      <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor1}>
        <StyledContentWrapper>
          <Field name={ResourceFeatureNamesFullPath.Description}>
            {({ field, meta: { error } }: FieldProps) => (
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    {...field}
                    id="resource-description"
                    variant="filled"
                    fullWidth
                    multiline
                    rows="4"
                    inputProps={{ 'data-testid': 'dlr-description-input' }}
                    label={t('resource.metadata.description')}
                    onBlur={(event) => {
                      handleBlur(event);
                      !error &&
                        saveField(event, ResourceFeatureNamesFullPath.Description, ResourceFeatureNames.Description);
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <HelperTextPopover
                    ariaButtonLabel={t('explanation_text.description_helper_aria_label')}
                    popoverId={'helper-text-description'}>
                    <StylePopoverTypography variant="body1">
                      {t('explanation_text.description_helper_text1')}.
                    </StylePopoverTypography>
                    <StylePopoverTypography variant="body1">
                      {t('explanation_text.description_helper_text2')}:
                    </StylePopoverTypography>
                    <StylePopoverTypography variant="body2">
                      {t('explanation_text.description_helper_example1')}.
                    </StylePopoverTypography>
                    <StylePopoverTypography variant="body2">
                      {t('explanation_text.description_helper_example2')}.
                    </StylePopoverTypography>
                    <StylePopoverTypography variant="body2">
                      {t('explanation_text.description_helper_example3')}.
                    </StylePopoverTypography>
                  </HelperTextPopover>
                </Grid>
              </Grid>
            )}
          </Field>
        </StyledContentWrapper>
        {saveErrorFields.includes(ResourceFeatureNamesFullPath.Description) && (
          <ErrorBanner userNeedsToBeLoggedIn={true} />
        )}
      </StyledSchemaPartColored>
      <ResourceTypeField setAllChangesSaved={setAllChangesSaved} />
      <TagsField setAllChangesSaved={setAllChangesSaved} />
      <RequiredFieldInformation />
    </>
  );
};

export default DescriptionFields;
