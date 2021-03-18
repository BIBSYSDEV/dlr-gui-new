import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Chip, CircularProgress, FormControl, FormGroup, TextField } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { QueryObject } from '../../types/search.types';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import CancelIcon from '@material-ui/icons/Cancel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HelperTextPopover from '../../components/HelperTextPopover';
import { searchTags } from '../../api/resourceApi';
import useDebounce from '../../utils/useDebounce';
import ErrorBanner from '../../components/ErrorBanner';

const minimumTagLength = 1;

const StyledFormControl: any = styled(FormControl)`
  margin-right: 1rem;
  margin-top: 2rem;
  max-width: ${StyleWidths.width3};
`;

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

const StyledCancelIcon = styled(CancelIcon)`
  color: ${Colors.ChipIconBackground};
`;

const StyledChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  const [tagSearchError, setTagSearchError] = useState<Error>();

  useEffect(() => {
    //TODO: lag egen debounce for å kunne bruke freesolo (skrive og trykke tab før det søkes)
    const searchForTags = async () => {
      setLoading(true);
      try {
        const response = await searchTags(debouncedTagInputValue);
        setOptions(response.data);
      } catch (error) {
        setTagSearchError(error);
      } finally {
        setLoading(false);
      }
    };
    setOptions([]);
    if (debouncedTagInputValue.length > 1 && tagInputFieldValue.length > 1) {
      searchForTags();
    }
  }, [debouncedTagInputValue]);

  useEffect(() => {
    setTagInputFieldValue('');
    setOptions([]);
    const newTagValue = tagValue.trim();
    if (!queryObject.tags.includes(newTagValue) && newTagValue.length > minimumTagLength) {
      setQueryObject((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, newTagValue],
        offset: 0,
        queryFromURL: false,
      }));
    }
  }, [tagValue, queryObject, setQueryObject]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputFieldValue(event.target.value);
  };

  const handleDelete = (tagToDelete: string) => {
    setQueryObject((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag !== tagToDelete),
      offset: 0,
      queryFromURL: false,
    }));
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
        <Autocomplete
          freeSolo
          id="filter-tags-input"
          value={tagInputFieldValue}
          options={options}
          onChange={(event: ChangeEvent<unknown>, value: any) => {
            setTagValue(value);
          }}
          loading={loading}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === 'Tab') {
              event.preventDefault();
              setTagValue(debouncedTagInputValue);
            }
          }}
          renderInput={(params) => (
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
        {tagSearchError && <ErrorBanner error={tagSearchError}></ErrorBanner>}
        <StyledChipContainer data-testid="filter-tag-container">
          {queryObject.tags.map((tag, index) => (
            <StyledChip
              key={index}
              deleteIcon={<StyledCancelIcon />}
              data-testid={`filter-tag-chip-${index}`}
              label={tag}
              onDelete={() => handleDelete(tag)}
              variant="outlined"
            />
          ))}
        </StyledChipContainer>
      </FormGroup>
    </StyledFormControl>
  );
};

export default TagsFiltering;
