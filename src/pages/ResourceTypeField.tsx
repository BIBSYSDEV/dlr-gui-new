import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InputLabel, ListItemIcon, MenuItem, Select, Typography } from '@material-ui/core';
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

const StyledSelect = styled(Select)`
  max-width: 100%;
  min-width: 25rem;
`;

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
  const { values } = useFormikContext<ResourceWrapper>();
  const { t } = useTranslation();

  const saveField = async () => {
    console.log('starting saving', values.resource.features);
    if (values.resource.features.dlr_type) {
      setAllChangesSaved(false);
      try {
        await postResourceFeature(values.resource.identifier, 'dlr_type', values.resource.features.dlr_type);
      } catch (error) {
        //TODO: handle error with ErrorBanner
      } finally {
        setAllChangesSaved(true);
      }
    }
  };
  return (
    <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor1}>
      <StyledContentWrapper>
        <Field name="resource.features.dlr_type">
          {({ field, meta: { error } }: FieldProps) => (
            <>
              <InputLabel>{t('resource.type.resource_type')}</InputLabel>
              <StyledSelect
                {...field}
                variant="filled"
                onClose={() => {
                  !error && saveField();
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
                <StyledMenuItem value={ResourceFeatureTypes.image.toLowerCase()}>
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
              </StyledSelect>
              <FormHelperText error>{error}</FormHelperText>
            </>
          )}
        </Field>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};
export default ResourceTypeField;
