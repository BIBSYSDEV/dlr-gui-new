import React, { FC, useState } from 'react';
import { Colors, StyleWidths } from '../../../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Field, useFormikContext, FieldProps } from 'formik';
import { Resource, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import { putAccessType } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { AccessTypes } from '../../../types/license.types';
import styled from 'styled-components';

const StyledFieldWrapper = styled.div`
  max-width: ${StyleWidths.width1};
`;

interface AccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const accessTypeArray = [AccessTypes.open, AccessTypes.private];

const AccessFields: FC<AccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue, handleChange, resetForm } = useFormikContext<Resource>();
  const [savingAccessTypeError, setSavingAccessTypeError] = useState(false);

  const saveResourceAccessType = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.length > 0) {
      setAllChangesSaved(false);
      try {
        if (event.target.value in AccessTypes) {
          await putAccessType(values.identifier, event.target.value as AccessTypes);
          setFieldValue(ResourceFeatureNamesFullPath.Access, event.target.value);
          setSavingAccessTypeError(false);
          values.features.dlr_access = event.target.value;
          resetForm({ values });
        }
      } catch (error) {
        setSavingAccessTypeError(true);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor2}>
      <StyledContentWrapper>
        <Typography variant="h3">{t('resource.metadata.access')}</Typography>
        <StyledFieldWrapper>
          <Field name={ResourceFeatureNamesFullPath.Access}>
            {({ field, meta: { error, touched } }: FieldProps) => (
              <>
                <TextField
                  {...field}
                  variant="filled"
                  select
                  required
                  error={touched && !!error}
                  fullWidth
                  value={field.value}
                  label={t('resource.metadata.access')}
                  onBlur={(event) => {
                    setFieldTouched(ResourceFeatureNamesFullPath.Access, true, true);
                  }}
                  onChange={(event) => {
                    handleChange(event);
                    saveResourceAccessType(event);
                  }}>
                  {accessTypeArray.map((accessType, index) => (
                    <MenuItem key={index} value={accessType}>
                      <Typography>{t(`resource.access_types.${accessType}`)}</Typography>
                    </MenuItem>
                  ))}
                </TextField>

                {savingAccessTypeError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
              </>
            )}
          </Field>
        </StyledFieldWrapper>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default AccessFields;
