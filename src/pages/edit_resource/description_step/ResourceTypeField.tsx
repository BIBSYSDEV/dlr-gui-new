import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, ListItemIcon, MenuItem, TextField, Typography } from '@mui/material';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { Field, FieldProps, useFormikContext } from 'formik';
import FormHelperText from '@mui/material/FormHelperText';
import { Resource, ResourceFeatureNamesFullPath, ResourceFeatureTypes } from '../../../types/resource.types';
import { postResourceFeature, updateSearchIndex } from '../../../api/resourceApi';
import styled from 'styled-components';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VideocamIcon from '@mui/icons-material/Videocam';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import ErrorBanner from '../../../components/ErrorBanner';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import HelperTextPopover from '../../../components/HelperTextPopover';
import { StylePopoverTypography } from '../../../components/styled/StyledTypographies';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

const StyledMenuItem = styled(MenuItem)`
  padding: 1rem;
  margin: 0.3rem;
`;
const StyledMenuItemContent = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledListItemIcon = styled(ListItemIcon)`
  min-width: 2.5rem;
`;
const StyledTextField = styled(TextField)`
  max-width: 90vw;
`;
const StyledCombinedTextWrapper = styled.div`
  overflow: hidden;
  align-items: baseline;
  text-overflow: ellipsis;
`;

interface ResourceTypeFieldProps {
  setAllChangesSaved: (value: boolean) => void;
}

const ResourceTypeField: FC<ResourceTypeFieldProps> = ({ setAllChangesSaved }) => {
  const [savingResourceTypeError, setSavingResourceTypeError] = useState<Error | AxiosError>();
  const { values, setFieldTouched, setFieldValue, handleChange, resetForm, setTouched, touched } =
    useFormikContext<Resource>();
  const { t } = useTranslation();

  const saveResourceType = async (event: any) => {
    if (event.target.value.length > 0) {
      setAllChangesSaved(false);
      try {
        setSavingResourceTypeError(undefined);
        await postResourceFeature(values.identifier, 'dlr_type', event.target.value);
        setFieldValue(ResourceFeatureNamesFullPath.Type, event.target.value);
        values.features.dlr_type = event.target.value;
        resetFormButKeepTouched(touched, resetForm, values, setTouched);
        values.features.dlr_status_published && updateSearchIndex(values.identifier);
      } catch (error) {
        setSavingResourceTypeError(handlePotentialAxiosError(error));
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
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={10}>
                <StyledTextField
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
                  <StyledMenuItem value={ResourceFeatureTypes.video}>
                    <StyledMenuItemContent>
                      <StyledListItemIcon>
                        <VideocamIcon />
                      </StyledListItemIcon>
                      <Typography variant="inherit">{t('resource.type.video')}</Typography>
                    </StyledMenuItemContent>
                  </StyledMenuItem>
                  <StyledMenuItem value={ResourceFeatureTypes.image}>
                    <StyledMenuItemContent>
                      <StyledListItemIcon>
                        <PhotoOutlinedIcon />
                      </StyledListItemIcon>
                      <StyledCombinedTextWrapper>
                        <Typography variant="inherit">{t('resource.type.image')}</Typography>
                        <Typography variant="caption">
                          ({t('explanation_text.resource_type_examples_image')})
                        </Typography>
                      </StyledCombinedTextWrapper>
                    </StyledMenuItemContent>
                  </StyledMenuItem>
                  <StyledMenuItem value={ResourceFeatureTypes.document}>
                    <StyledMenuItemContent>
                      <StyledListItemIcon>
                        <DescriptionOutlinedIcon />
                      </StyledListItemIcon>
                      <StyledCombinedTextWrapper>
                        <Typography variant="inherit">{t('resource.type.document')}</Typography>
                        <Typography variant="caption">
                          ({t('explanation_text.resource_type_examples_document')})
                        </Typography>
                      </StyledCombinedTextWrapper>
                    </StyledMenuItemContent>
                  </StyledMenuItem>
                  <StyledMenuItem value={ResourceFeatureTypes.presentation}>
                    <StyledMenuItemContent>
                      <StyledListItemIcon>
                        <SlideshowIcon />
                      </StyledListItemIcon>
                      <StyledCombinedTextWrapper>
                        <Typography variant="inherit">{t('resource.type.presentation')}</Typography>
                        <Typography variant="caption">
                          ({t('explanation_text.resource_type_examples_presentation')})
                        </Typography>
                      </StyledCombinedTextWrapper>
                    </StyledMenuItemContent>
                  </StyledMenuItem>
                  <StyledMenuItem value={ResourceFeatureTypes.audio}>
                    <StyledMenuItemContent>
                      <StyledListItemIcon>
                        <VolumeUpIcon />
                      </StyledListItemIcon>
                      <Typography variant="inherit">{t('resource.type.audio')}</Typography>
                    </StyledMenuItemContent>
                  </StyledMenuItem>
                  <StyledMenuItem value={ResourceFeatureTypes.simulation} data-testid="resource-type-option-simulation">
                    <StyledMenuItemContent>
                      <StyledListItemIcon>
                        <SlideshowIcon />
                      </StyledListItemIcon>
                      <StyledCombinedTextWrapper>
                        <Typography variant="inherit">{t('resource.type.simulation')}</Typography>
                        <Typography variant="caption">
                          ({t('explanation_text.resource_type_examples_simulation')})
                        </Typography>
                      </StyledCombinedTextWrapper>
                    </StyledMenuItemContent>
                  </StyledMenuItem>
                </StyledTextField>
                {error && touched && <FormHelperText error>{t('feedback.required_field')}</FormHelperText>}
                {savingResourceTypeError && (
                  <ErrorBanner userNeedsToBeLoggedIn={true} error={savingResourceTypeError} />
                )}
              </Grid>
              <Grid item xs={2}>
                <HelperTextPopover
                  ariaButtonLabel={t('explanation_text.resource_type_helper_aria_label')}
                  popoverId={'helper-resource-type'}>
                  <StylePopoverTypography variant="body1">
                    {t('explanation_text.resource_type_helper_text')}
                  </StylePopoverTypography>
                  <StylePopoverTypography variant="body2">
                    {t('explanation_text.resource_type_example1')}
                  </StylePopoverTypography>
                  <StylePopoverTypography variant="body2">
                    {t('explanation_text.resource_type_example2')}
                  </StylePopoverTypography>
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
