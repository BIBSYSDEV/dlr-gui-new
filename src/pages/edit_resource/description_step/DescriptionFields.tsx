import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import TagsField from './TagsField';
import { postResourceFeature } from '../../../api/resourceApi';
import { Resource, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import ErrorBanner from '../../../components/ErrorBanner';
import ResourceTypeField from './ResourceTypeField';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import { Colors } from '../../../themes/mainTheme';
import RequiredFieldInformation from '../../../components/RequiredFieldInformation';
import HelperTextPopover from '../../../components/HelperTextPopover';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  margin-bottom: 0.5rem;
`;

interface DescriptionFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const DescriptionFields: FC<DescriptionFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, handleBlur, resetForm, touched, setTouched } = useFormikContext<Resource>();
  const [saveErrorFields, setSaveErrorFields] = useState<string[]>([]);

  const saveField = async (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    setAllChangesSaved(false);
    try {
      const name = '' + event.target.name.split('.').pop();
      await postResourceFeature(values.identifier, name, event.target.value);
      setAllChangesSaved(true);
      setSaveErrorFields([]);
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
      //todo: remove from array
    } catch (err) {
      setSaveErrorFields([...saveErrorFields, name]);
    }
  };

  return (
    <>
      <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor1}>
        <StyledContentWrapper>
          <Field name={ResourceFeatureNamesFullPath.Title}>
            {({ field, meta: { touched, error } }: FieldProps) => (
              <Grid container alignItems="flex-start">
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
                      !error && saveField(event, ResourceFeatureNamesFullPath.Title);
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <HelperTextPopover ariaButtonLabel={'read more about title'} popoverId={'helper-text-title'}>
                    <Typography variant="body1">Fyll inn en tittel som hjelper andre å finne ressursen din</Typography>
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
              <Grid container alignItems="flex-start">
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
                      !error && saveField(event, ResourceFeatureNamesFullPath.Description);
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <HelperTextPopover ariaButtonLabel={'read more about title'} popoverId={'helper-text-title'}>
                    <StyledTypography variant="body1">
                      Gi en kort beskrivelse av hva ressursen inneholder.
                    </StyledTypography>
                    <StyledTypography variant="body1">Eksempler på beskrivelser:</StyledTypography>
                    <StyledTypography variant="body2">
                      Kort video om hvordan det sympatiske nervesystemet er bygget opp og fungerer.
                    </StyledTypography>
                    <StyledTypography variant="body2">
                      Forelesning om tastaturnavigering og universell utforming. Forelesningen er beregnet for
                      frontendutviklere og tar for seg WCAG 2.1
                    </StyledTypography>
                    <StyledTypography variant="body2">
                      Illustrasjonstegning av kroppens indre organer. Ilustrasjonen viser posisjonen til organene i
                      forhold til hverandre.
                    </StyledTypography>
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
