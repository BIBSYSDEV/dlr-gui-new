import React, { FC, useState } from 'react';
import { Colors, StyleWidths } from '../../../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import { putAccessType } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { AccessTypes, LicenseAgreementsOptions } from '../../../types/license.types';
import styled from 'styled-components';
import { postCurrentUserInstitutionConsumerAccess } from '../../../api/sharingApi';
import PrivateConsumerAccessFields from './PrivateConsumerAccessFields';

const StyledFieldWrapper = styled.div`
  max-width: ${StyleWidths.width1};
`;

const accessTypeArray = [AccessTypes.open, AccessTypes.private];

interface AccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const AccessFields: FC<AccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue, handleChange, resetForm } = useFormikContext<Resource>();
  const [savingAccessTypeError, setSavingAccessTypeError] = useState<Error>();
  const [forceRefreshInPrivateConsumerAccessFields, setForceRefreshInPrivateConsumerAccessFields] = useState(false);

  const saveResourceAccessType = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.length > 0) {
      setAllChangesSaved(false);
      try {
        if (event.target.value in AccessTypes) {
          setSavingAccessTypeError(undefined);
          await putAccessType(values.identifier, event.target.value as AccessTypes);
          setFieldValue(ResourceFeatureNamesFullPath.Access, event.target.value);
          values.features.dlr_access = event.target.value;
          resetForm({ values });
          if (
            event.target.value === AccessTypes.private &&
            values.containsOtherPeoplesWork !== LicenseAgreementsOptions.NoClearance
          ) {
            await postCurrentUserInstitutionConsumerAccess(values.identifier);
            setForceRefreshInPrivateConsumerAccessFields((prevState) => !prevState);
          }
        }
      } catch (error) {
        setSavingAccessTypeError(error);
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
                  id="access-dropdown-menu"
                  data-testid="access-dropdown-menu"
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
                    <MenuItem data-testid={`access-dropdown-menu-option-${accessType}`} key={index} value={accessType}>
                      <Typography>{t(`resource.access_types.${accessType}`)}</Typography>
                    </MenuItem>
                  ))}
                </TextField>
                {savingAccessTypeError && <ErrorBanner userNeedsToBeLoggedIn={true} error={savingAccessTypeError} />}
              </>
            )}
          </Field>
        </StyledFieldWrapper>
        {values.features.dlr_access === AccessTypes.private && (
          <PrivateConsumerAccessFields forceRefresh={forceRefreshInPrivateConsumerAccessFields} />
        )}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default AccessFields;
