import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, CircularProgress, Grid, TextField } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import Autocomplete from '@mui/material/Autocomplete';
import { deleteTag, postTag, searchTags, updateSearchIndex } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import { resetFormButKeepTouched } from '../../../utils/formik-helpers';
import styled from 'styled-components';
import CancelIcon from '@mui/icons-material/Cancel';
import HelperTextPopover from '../../../components/HelperTextPopover';
import Typography from '@mui/material/Typography';
import { StylePopoverTypography } from '../../../components/styled/StyledTypographies';
import useDebounce from '../../../utils/useDebounce';
import { handlePotentialAxiosError } from '../../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

const StyledChip = styled(Chip)`
  && {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-right: 0.5rem;
  }
`;

const StyledAutoCompleteWrapper = styled.div`
  flex-grow: 4;
`;

interface TagsFieldProps {
  setAllChangesSaved: (status: boolean) => void;
}

const TagsField: FC<TagsFieldProps> = ({ setAllChangesSaved }) => {
  const { t } = useTranslation();
  const { values, setFieldValue, resetForm, setTouched, touched } = useFormikContext<Resource>();
  const [tagInputFieldValue, setTagInputFieldValue] = useState('');
  const debouncedTagInputValue = useDebounce(tagInputFieldValue);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelSearch, setCancelSearch] = useState(false);
  const [saveError, setSaveError] = useState<Error | AxiosError>();
  const [tagSearchError, setTagSearchError] = useState<Error | AxiosError>();

  useEffect(() => {
    const searchForTags = async () => {
      if (!cancelSearch) {
        setLoading(true);
        try {
          const tag = debouncedTagInputValue.replaceAll('#', '');
          const response = await searchTags(tag);
          const optionsResult = response.data.facet_counts.map((facetCount) => facetCount.value);
          setOptions(optionsResult);
        } catch (error) {
          setTagSearchError(handlePotentialAxiosError(error));
        } finally {
          setLoading(false);
          setCancelSearch(false);
        }
      }
    };
    setOptions([]);
    if (debouncedTagInputValue.length > 1) {
      searchForTags();
    }
  }, [debouncedTagInputValue, cancelSearch, t]);

  const saveTagsChanging = async (name: string, tagArray: string[]) => {
    setAllChangesSaved(false);
    try {
      const promiseArray: Promise<any>[] = [];
      const cleanTagArray: string[] = [];
      tagArray.forEach((tag) => {
        tag = tag.replaceAll('#', '');
        if (cleanTagArray.indexOf(tag) === -1) {
          cleanTagArray.push(tag);
        }
      });
      tagArray = cleanTagArray;
      const newTags = tagArray.filter((tag) => !values.tags?.includes(tag));
      newTags.forEach((tag) => {
        promiseArray.push(postTag(values.identifier, tag));
      });
      const removeTags = values.tags?.filter((tag) => !tagArray.includes(tag));
      removeTags?.forEach((tag) => {
        promiseArray.push(deleteTag(values.identifier, tag));
      });
      setSaveError(undefined);
      //Must wait for all the promises to finish or we will get race conditions for updating setAllChangesSaved.
      await Promise.all(promiseArray);
      setFieldValue('tags', tagArray);
      values.tags = tagArray;
      values.isFresh = false;
      resetFormButKeepTouched(touched, resetForm, values, setTouched);
    } catch (error) {
      setSaveError(handlePotentialAxiosError(error));
    } finally {
      setAllChangesSaved(true);
      values.features.dlr_status_published && updateSearchIndex(values.identifier);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputFieldValue(event.target.value);
  };

  return (
    <StyledSchemaPartColored color={Colors.DescriptionPageGradientColor3}>
      <StyledContentWrapper>
        {values.isFresh && values.features.dlr_content_type === 'link' && values.tags && values.tags.length > 0 && (
          <Typography>{t('explanation_text.tags_link_fresh_warning')}</Typography>
        )}
        {!values.isFresh && values.features.dlr_content_type === 'link' && values.tags && values.tags.length > 0 && (
          <Typography>{t('explanation_text.tags_link_old_warning')}</Typography>
        )}
        <Field name={'tags'}>
          {({ field }: FieldProps) => (
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={10}>
                <StyledAutoCompleteWrapper>
                  <Autocomplete
                    {...field}
                    freeSolo
                    multiple
                    id="register-tags-input"
                    noOptionsText={t('common.no_options')}
                    options={options}
                    loading={loading}
                    filterSelectedOptions
                    isOptionEqualToValue={(option: string, value: string) =>
                      option.toLowerCase() === value.toLowerCase()
                    }
                    onChange={(_: ChangeEvent<unknown>, valueArray: string[]) => {
                      saveTagsChanging(field.name, valueArray);
                    }}
                    renderTags={(value: any, getTagProps: any) =>
                      value.map((option: any, index: number) => (
                        <StyledChip
                          color="accent"
                          deleteIcon={<CancelIcon />}
                          data-testid={`tag-chip-${index}`}
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="resource-feature-tags"
                        label={t('resource.metadata.tags')}
                        helperText={t('resource.add_tags')}
                        variant="filled"
                        onChange={handleChange}
                        fullWidth
                        data-testid="resource-tags-input"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={'1rem'} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </StyledAutoCompleteWrapper>
              </Grid>
              <Grid item xs={2}>
                <HelperTextPopover
                  popoverId="tags-explanation"
                  ariaButtonLabel={t('explanation_text.tags_helper_aria_label')}>
                  <StylePopoverTypography variant="body1">
                    {t('explanation_text.tags_helper_text')}.
                  </StylePopoverTypography>
                  <StylePopoverTypography>
                    {' '}
                    {t('explanation_text.tags_helper_text_edit_resource1')}.{' '}
                  </StylePopoverTypography>
                  <StylePopoverTypography>
                    {' '}
                    {t('explanation_text.tags_helper_text_edit_resource2')}.{' '}
                  </StylePopoverTypography>
                  <Typography variant="caption">{t('explanation_text.tags_helper_text_example')}.</Typography>
                </HelperTextPopover>
              </Grid>
            </Grid>
          )}
        </Field>
        {tagSearchError && <ErrorBanner error={tagSearchError} />}
        {saveError && <ErrorBanner userNeedsToBeLoggedIn={true} error={saveError} />}
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default TagsField;
