import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemIcon, MenuItem, TextField, Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import { Field, FieldProps, useFormikContext } from 'formik';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Resource, ResourceFeatureTypes } from '../types/resource.types';
import { postResourceFeature } from '../api/resourceApi';
import styled from 'styled-components';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VideocamIcon from '@material-ui/icons/Videocam';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import ErrorBanner from '../components/ErrorBanner';
import { resetFormButKeepTouched } from '../utils/formik-helpers';

const StyledMenuItem = styled(MenuItem)`
  padding: 1rem;
  margin: 0.3rem;
`;

interface ResourceTypeFieldProps {
  setAllChangesSaved: (value: boolean) => void;
}

interface ResourceWrapper {
  resource: Resource;
}

const ResourceTypeField: FC<ResourceTypeFieldProps> = ({ setAllChangesSaved }) => {
  const [savingResourceTypeError, setSavingResourceTypeError] = useState(false);
  const {
    values,
    setFieldTouched,
    setFieldValue,
    handleChange,
    resetForm,
    setTouched,
    touched,
  } = useFormikContext<ResourceWrapper>();
  const { t } = useTranslation();

  const saveResourceType = async (event: any) => {
    if (event.target.value.length > 0) {
      setAllChangesSaved(false);
      try {
        await postResourceFeature(values.resource.identifier, 'dlr_type', event.target.value);
        setFieldValue('resource.features.dlr_type', event.target.value);
        setSavingResourceTypeError(false);
        values.resource.features.dlr_type = event.target.value;
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
      } catch (error) {
        setSavingResourceTypeError(true);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };
  return (
    <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor1}>
      <StyledContentWrapper>
        <Field name="resource.features.dlr_type">
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
                label={t('resource.type.resource_type')}
                onBlur={(event) => {
                  setFieldTouched('resource.features.dlr_type', true, true);
                }}
                onChange={(event) => {
                  handleChange(event);
                  saveResourceType(event);
                }}>
                <StyledMenuItem value={ResourceFeatureTypes.audio}>
                  <ListItemIcon>
                    <VolumeUpIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t('resource.type.audio')}</Typography>
                </StyledMenuItem>
                <StyledMenuItem value={ResourceFeatureTypes.video}>
                  <ListItemIcon>
                    <VideocamIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t('resource.type.video')}</Typography>
                </StyledMenuItem>
                <StyledMenuItem value={ResourceFeatureTypes.presentation}>
                  <ListItemIcon>
                    <SlideshowIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t('resource.type.presentation')}</Typography>
                </StyledMenuItem>
                <StyledMenuItem value={ResourceFeatureTypes.document}>
                  <ListItemIcon>
                    <DescriptionOutlinedIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t('resource.type.document')}</Typography>
                </StyledMenuItem>
                <StyledMenuItem value={ResourceFeatureTypes.image}>
                  <ListItemIcon>
                    <PhotoOutlinedIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t('resource.type.image')}</Typography>
                </StyledMenuItem>
                <StyledMenuItem value={ResourceFeatureTypes.simulation}>
                  <ListItemIcon>
                    <SlideshowIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{t('resource.type.simulation')}</Typography>
                </StyledMenuItem>
              </TextField>
              {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
              {savingResourceTypeError && <ErrorBanner />}
            </>
          )}
        </Field>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};
export default ResourceTypeField;
