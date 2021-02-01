import React, { FC, useEffect, useState } from 'react';
import { Colors, StyleWidths } from '../../../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { MenuItem, TextField, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Field, useFormikContext, FieldProps } from 'formik';
import { Resource, ResourceFeatureNamesFullPath } from '../../../types/resource.types';
import { getResourceReaders, postCurrentUserInstitutionAccess, putAccessType } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { AccessTypes } from '../../../types/license.types';
import styled from 'styled-components';
import { ResourceReadAccess, ResourceReadAccessNames } from '../../../types/resourceReadAccess.types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';

const StyledFieldWrapper = styled.div`
  max-width: ${StyleWidths.width1};
`;

const StyledPrivateAccessSubfields = styled.div`
  margin-top: 2.5rem;
`;

interface AccessFieldsProps {
  setAllChangesSaved: (value: boolean) => void;
}

const accessTypeArray = [AccessTypes.open, AccessTypes.private];

const AccessFields: FC<AccessFieldsProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const { values, setFieldTouched, setFieldValue, handleChange, resetForm } = useFormikContext<Resource>();
  const [savingAccessTypeError, setSavingAccessTypeError] = useState(false);
  const [privateAccessList, setPrivateAccessList] = useState<ResourceReadAccess[]>([]);

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
          if (event.target.value === AccessTypes.private) {
            await postCurrentUserInstitutionAccess(values.identifier);
            if (privateAccessList.findIndex((privateAccess) => privateAccess.subject === user.institution) === -1) {
              setPrivateAccessList((prevState) => [
                ...prevState,
                {
                  subject: user.institution,
                  profiles: [{ name: ResourceReadAccessNames.Institution }],
                },
              ]);
            }
          }
        }
      } catch (error) {
        setSavingAccessTypeError(true);
        console.log(error);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };

  useEffect(() => {
    const getPrivateAccessList = async () => {
      const resourceReadAccessListResponse = await getResourceReaders(values.identifier);
      setPrivateAccessList(resourceReadAccessListResponse.data);
    };
    getPrivateAccessList();
  }, [values.identifier]);

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
          {values.features.dlr_access === AccessTypes.private && (
            <StyledPrivateAccessSubfields>
              <Typography variant="subtitle1">*** Hvem som har tilgang ***</Typography>
              {privateAccessList.map((access) => (
                <Typography> {access.subject}</Typography>
              ))}
            </StyledPrivateAccessSubfields>
          )}
        </StyledFieldWrapper>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default AccessFields;
