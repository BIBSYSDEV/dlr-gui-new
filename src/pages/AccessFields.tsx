import React, { FC, useState } from 'react';
import { Colors } from '../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Field, useFormikContext, FieldProps } from 'formik';
import { ResourceWrapper } from '../types/resource.types';
import { postResourceFeature } from '../api/resourceApi';
import ErrorBanner from '../components/ErrorBanner';

interface AccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}
const accessTypes = ['open'];

const AccessFields: FC<AccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue, handleChange, resetForm } = useFormikContext<ResourceWrapper>();
  const [savingAccessTypeError, setSavingAccessTypeError] = useState(false);

  const saveResourceAccessType = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.length > 0) {
      setAllChangesSaved(false);
      try {
        await postResourceFeature(values.resource.identifier, 'dlr_access', event.target.value);
        setFieldValue('resource.features.dlr_access', event.target.value);
        setSavingAccessTypeError(false);
        values.resource.features.dlr_access = event.target.value;
        resetForm({ values });
      } catch (error) {
        setSavingAccessTypeError(true);
      } finally {
        setAllChangesSaved(false);
      }
    }
  };

  return (
    <>
      <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor2}>
        <StyledContentWrapper>
          <Typography variant="h4">{t('resource.metadata.access')}</Typography>
          <Field name="resource.features.dlr_access">
            {({ field, meta: { error, touched } }: FieldProps) => (
              <>
                <TextField
                  {...field}
                  variant="outlined"
                  select
                  required
                  error={touched && !!error}
                  fullWidth
                  value={field.value}
                  label={t('resource.metadata.access')}
                  onBlur={(event) => {
                    setFieldTouched('resource.features.dlr_access', true, true);
                  }}
                  onChange={(event) => {
                    handleChange(event);
                    saveResourceAccessType(event);
                  }}>
                  {accessTypes.map((accessType, index) => (
                    <MenuItem key={index} value={accessType}>
                      <Typography>{t(`resource.access_types.${accessType}`)}</Typography>
                    </MenuItem>
                  ))}
                </TextField>

                {savingAccessTypeError && <ErrorBanner />}
              </>
            )}
          </Field>
        </StyledContentWrapper>
      </StyledSchemaPartColored>
    </>
  );
};

export default AccessFields;
