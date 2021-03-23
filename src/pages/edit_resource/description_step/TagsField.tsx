import React, { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, Grid, TextField } from '@material-ui/core';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { deleteTag, postTag } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import styled from 'styled-components';
import CancelIcon from '@material-ui/icons/Cancel';
import HelperTextPopover from '../../../components/HelperTextPopover';
import { AutocompleteRenderInputParams } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';

const StyledChip = styled(Chip)`
  && {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-right: 0.5rem;
    background-color: ${Colors.ChipBackground};
    color: ${Colors.Background};
    &:focus {
      color: ${Colors.PrimaryText};
      background-color: ${Colors.ChipBackgroundFocus};
    }
  }
`;

const StyledAutoComplete: any = styled(Autocomplete)`
  flex-grow: 4;
`;

const StyledCancelIcon = styled(CancelIcon)`
  color: ${Colors.ChipIconBackground};
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 1rem;
`;

interface TagsFieldProps {
  setAllChangesSaved: (status: boolean) => void;
}

const TagsField: FC<TagsFieldProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldValue, resetForm, setTouched, touched } = useFormikContext<Resource>();
  const [saveError, setSaveError] = useState(false);

  const saveTagsChanging = async (name: string, value: string[]) => {
    setAllChangesSaved(false);

    try {
      const promiseArray: Promise<any>[] = [];
      const newTags = value.filter((tag) => !values.tags?.includes(tag));
      newTags.forEach((tag) => {
        promiseArray.push(postTag(values.identifier, tag));
      });
      const removeTags = values.tags?.filter((tag) => !value.includes(tag));
      removeTags?.forEach((tag) => {
        promiseArray.push(deleteTag(values.identifier, tag));
      });
      //Must wait for all the promises to finish or we will get race conditions for updating setAllChangesSaved.
      await Promise.all(promiseArray);
      setSaveError(false);
      setFieldValue('tags', value);
      values.tags = value;
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (saveTagsError) {
      setSaveError(true);
    } finally {
      setAllChangesSaved(true);
    }
  };

  return (
    <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor3}>
      <StyledContentWrapper>
        <Field name={'tags'}>
          {({ field }: FieldProps) => (
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={10}>
                <StyledAutoComplete
                  {...field}
                  freeSolo
                  multiple
                  options={[]}
                  onChange={(_: ChangeEvent<unknown>, value: string[]) => {
                    saveTagsChanging(field.name, value);
                  }}
                  renderTags={(value: any, getTagProps: any) =>
                    value.map((option: any, index: number) => (
                      <StyledChip
                        deleteIcon={<StyledCancelIcon />}
                        data-testid={`tag-chip-${index}`}
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      id="resource-feature-tags"
                      label={t('resource.metadata.tags')}
                      helperText={t('resource.add_tags')}
                      variant="filled"
                      fullWidth
                      data-testid="resource-tags-input"
                      onBlur={(event) => {
                        const value = event.target.value;
                        const tags = value
                          .split(/[|,;]+/)
                          .map((value: string) => value.trim())
                          .filter((tag) => tag !== '');
                        saveTagsChanging(field.name, [...field.value, ...tags]);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={2}>
                <HelperTextPopover
                  popoverId="tags-explanation"
                  ariaButtonLabel={t('explanation_text.tags_helper_aria_label')}>
                  <StyledTypography variant="body1">{t('explanation_text.tags_helper_text')}.</StyledTypography>
                  <StyledTypography> {t('explanation_text.tags_helper_text_edit_resource1')}. </StyledTypography>
                  <StyledTypography> {t('explanation_text.tags_helper_text_edit_resource2')}. </StyledTypography>
                  <Typography variant="caption">{t('explanation_text.tags_helper_text_example')}.</Typography>
                </HelperTextPopover>
              </Grid>
            </Grid>
          )}
        </Field>
        {saveError && <ErrorBanner userNeedsToBeLoggedIn={true} />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default TagsField;
