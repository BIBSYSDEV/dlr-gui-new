import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputLabel, ListItemIcon, MenuItem, Select, Typography } from '@material-ui/core';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';
import { Field, FieldProps, useFormikContext } from 'formik';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Resource } from '../types/resource.types';
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

  const saveField = async () => {
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
              <InputLabel>Ressurs type</InputLabel>
              <StyledSelect
                {...field}
                variant="filled"
                onClose={() => {
                  !error && saveField();
                }}>
                <StyledMenuItem value="lydfil">
                  <ListItemIcon>
                    <VolumeUpIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Lydfil</Typography>
                </StyledMenuItem>
                <StyledMenuItem value="Video">
                  <ListItemIcon>
                    <VideocamIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Video</Typography>
                </StyledMenuItem>
                <StyledMenuItem value="presentasjon">
                  <ListItemIcon>
                    <SlideshowIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">presentasjon</Typography>
                </StyledMenuItem>
                <StyledMenuItem value="Dokument">
                  <ListItemIcon>
                    <DescriptionOutlinedIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Dokument</Typography>
                </StyledMenuItem>
                <StyledMenuItem value="Bilde">
                  <ListItemIcon>
                    <PhotoOutlinedIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Bilde</Typography>
                </StyledMenuItem>
                <StyledMenuItem value="Simulering">
                  <ListItemIcon>
                    <SlideshowIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Simulering</Typography>
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
