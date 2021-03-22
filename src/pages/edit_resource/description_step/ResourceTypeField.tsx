import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, ListItemIcon, MenuItem, TextField, Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { Field, FieldProps, useFormikContext } from 'formik';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Resource, ResourceFeatureNamesFullPath, ResourceFeatureTypes } from '../../../types/resource.types';
import { postResourceFeature } from '../../../api/resourceApi';
import styled from 'styled-components';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VideocamIcon from '@material-ui/icons/Videocam';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import PhotoOutlinedIcon from '@material-ui/icons/PhotoOutlined';
import ErrorBanner from '../../../components/ErrorBanner';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import HelperTextPopover from '../../../components/HelperTextPopover';

const StyledMenuItem = styled(MenuItem)`
  padding: 1rem;
  margin: 0.3rem;
`;

interface ResourceTypeFieldProps {
  setAllChangesSaved: (value: boolean) => void;
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
  } = useFormikContext<Resource>();
  const { t } = useTranslation();

  const saveResourceType = async (event: any) => {
    if (event.target.value.length > 0) {
      setAllChangesSaved(false);
      try {
        await postResourceFeature(values.identifier, 'dlr_type', event.target.value);
        setFieldValue(ResourceFeatureNamesFullPath.Type, event.target.value);
        setSavingResourceTypeError(false);
        values.features.dlr_type = event.target.value;
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
      } catch (error) {
        setSavingResourceTypeError(true);
      } finally {
        setAllChangesSaved(true);
      }
    }
  };
  return (
    <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor2}>
      <StyledContentWrapper>
        <Field name={ResourceFeatureNamesFullPath.Type}>
          {({ field, meta: { error, touched } }: FieldProps) => (
            <Grid container alignItems="flex-start">
              <Grid item xs={10}>
                <TextField
                  {...field}
                  id="resource-feature-type"
                  variant="filled"
                  select
                  required
                  error={touched && !!error}
                  fullWidth
                  value={field.value}
                  data-testid="resource-type-input"
                  label={t('resource.type.resource_type')}
                  onBlur={() => {
                    setFieldTouched(ResourceFeatureNamesFullPath.Type, true, true);
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
                  <StyledMenuItem value={ResourceFeatureTypes.simulation} data-testid="resource-type-option-simulation">
                    <ListItemIcon>
                      <SlideshowIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">{t('resource.type.simulation')}</Typography>
                  </StyledMenuItem>
                </TextField>
                {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
                {savingResourceTypeError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
              </Grid>
              <Grid item xs={2}>
                <HelperTextPopover ariaButtonLabel={'more info about resource type'} popoverId={'helper-resource-type'}>
                  <Typography variant="body1">Ressurstype er forsøkt utfylt ved opplasting av fil.</Typography>
                  <Typography variant="body1">Velg type som stemmer best overens med innholdet</Typography>
                  <Typography variant="body2">
                    Eksempelvis: Har du et videopptak av en forelesning, så velger du "video" som type
                  </Typography>
                  <Typography variant="body2">Passer ingen av ressurstypene overhodet, så velg "dokument"</Typography>
                </HelperTextPopover>
              </Grid>
            </Grid>
          )}
        </Field>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};
export default ResourceTypeField;
