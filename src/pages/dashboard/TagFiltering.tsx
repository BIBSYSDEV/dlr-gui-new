import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Chip, CircularProgress, FormControl, FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { QueryObject, SearchParameters, SearchQueryBooleanOperator } from '../../types/search.types';
import CancelIcon from '@mui/icons-material/Cancel';
import Autocomplete from '@mui/material/Autocomplete';
import HelperTextPopover from '../../components/HelperTextPopover';
import { searchTags } from '../../api/resourceApi';
import useDebounce from '../../utils/useDebounce';
import ErrorBanner from '../../components/ErrorBanner';
import { useHistory, useLocation } from 'react-router-dom';
import { rewriteSearchParams } from '../../utils/rewriteSearchParams';
import { StyleWidths } from '../../themes/mainTheme';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { AxiosError } from 'axios';

const minimumTagLength = 1;

const StyledAutocomplete: any = styled(Autocomplete)`
  max-width: 18rem;
`;

const StyledFormControl: any = styled(FormControl)`
  max-width: ${StyleWidths.width3};
`;

const StyledChip = styled(Chip)`
  && {
    margin: 1rem 0.5rem 0 0;
  }
`;

const StyledChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StyledFormLabel = styled(FormLabel)`
  display: flex;
  align-items: center;
`;

interface TagsFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const TagsFiltering: FC<TagsFilteringProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const [tagInputFieldValue, setTagInputFieldValue] = useState('');
  const [tagValue, setTagValue] = useState('');
  const debouncedTagInputValue = useDebounce(tagInputFieldValue);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelSearch, setCancelSearch] = useState(false);
  const [tagSearchError, setTagSearchError] = useState<Error | AxiosError>();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const searchForTags = async () => {
      if (!cancelSearch) {
        setLoading(true);
        try {
          const response = await searchTags(debouncedTagInputValue.toLowerCase());
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

  const handleNewTags = (value: any) => {
    setTagValue(value);
    if (value?.length > 0) {
      const newTagValue = value.trim();
      if (newTagValue.length > minimumTagLength) {
        const newTags = !queryObject.tags.includes(newTagValue) ? [...queryObject.tags, newTagValue] : queryObject.tags;
        setQueryObject((prevState) => ({
          ...prevState,
          tags: newTags,
          offset: 0,
        }));
        rewriteSearchParams(SearchParameters.tag, newTags, history, location, true);
      }
      setTagInputFieldValue('');
      setCancelSearch(false);
      setOptions([]);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputFieldValue(event.target.value);
  };

  const handleDelete = (tagToDelete: string) => {
    const newTags = queryObject.tags.filter((tag) => tag !== tagToDelete);
    setQueryObject((prevState) => ({
      ...prevState,
      tags: newTags,
      offset: 0,
    }));
    setTagValue('');
    rewriteSearchParams(SearchParameters.tag, newTags, history, location, true);
  };

  const handleChangeInBooleanSearchQueryCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQueryTabBooleanOperator = event.target.checked
      ? SearchQueryBooleanOperator.AND
      : SearchQueryBooleanOperator.OR;
    setQueryObject((prevState) => ({
      ...prevState,
      tagFilterOperator: searchQueryTabBooleanOperator,
      offset: 0,
    }));
    rewriteSearchParams(SearchParameters.tagFilterOperator, [searchQueryTabBooleanOperator], history, location, true);
  };

  return (
    <StyledFormControl component="fieldset">
      <StyledFormLabel>
        <Typography variant="h3">{t('dashboard.tags')}</Typography>
        <HelperTextPopover ariaButtonLabel={t('explanation_text.tags_helper_aria_label')} popoverId="tags-explanation">
          <Typography variant="body1">{t('explanation_text.tags_helper_text')}.</Typography>
          <Typography variant="caption">{t('explanation_text.tags_helper_text_example')}.</Typography>
        </HelperTextPopover>
      </StyledFormLabel>
      <FormGroup>
        <StyledAutocomplete
          id="filter-tags-input"
          options={options}
          noOptionsText={t('common.no_options')}
          onChange={(event: ChangeEvent<unknown>, value: any) => {
            handleNewTags(value);
          }}
          filterOptions={(x: string) => x}
          isOptionEqualToValue={() => {
            return true;
          }}
          value={tagValue}
          inputValue={tagInputFieldValue}
          loading={loading}
          renderInput={(params: any) => (
            <TextField
              {...params}
              variant="outlined"
              helperText={t('dashboard.enter_tags')}
              label={t('resource.metadata.tags')}
              data-testid="filter-tags-input"
              onChange={handleChange}
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
        {tagSearchError && <ErrorBanner error={tagSearchError} />}
        <StyledChipContainer data-testid="filter-tag-container">
          {queryObject.tags.map((tag, index) => (
            <StyledChip
              key={index}
              color="accent"
              deleteIcon={<CancelIcon data-testid={`tag-filter-delete-${tag}`} />}
              data-testid={`filter-tag-chip-${index}`}
              label={tag}
              onDelete={() => handleDelete(tag)}
            />
          ))}
        </StyledChipContainer>
      </FormGroup>
      {queryObject.tags.length > 1 && (
        <FormGroup>
          <FormControlLabel
            data-testid="tag-filter-operator-switch"
            control={
              <Switch
                color="accent"
                checked={queryObject.tagFilterOperator === SearchQueryBooleanOperator.AND}
                onChange={handleChangeInBooleanSearchQueryCheckBox}
              />
            }
            label={<Typography>{t('dashboard.tags_boolean_operator_in_search')}</Typography>}
          />
        </FormGroup>
      )}
    </StyledFormControl>
  );
};

export default TagsFiltering;
