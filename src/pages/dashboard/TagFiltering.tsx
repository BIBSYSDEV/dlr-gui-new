import React, { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { Chip, FormControl, FormGroup, TextField } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { QueryObject } from '../../types/search.types';
import { Colors } from '../../themes/mainTheme';
import CancelIcon from '@material-ui/icons/Cancel';
import Autocomplete from '@material-ui/lab/Autocomplete';

const minimumTagLength = 1;

const StyledFormControl: any = styled(FormControl)`
  margin-left: 1rem;
  margin-right: 1rem;
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

interface TagsFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const TagsFiltering: FC<TagsFilteringProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const [tagValue, setTagValue] = useState('');

  const submitTag = () => {
    const newTagValue = tagValue.trim();
    if (!queryObject.tags.includes(newTagValue) && newTagValue.length > minimumTagLength) {
      setQueryObject((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, newTagValue],
        offset: 0,
        queryFromURL: false,
      }));
    }
    setTagValue('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagValue(event.target.value);
  };

  const handleDelete = (tagToDelete: string) => {
    console.info('Delete ' + tagToDelete);
    setQueryObject((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag !== tagToDelete),
      offset: 0,
      queryFromURL: false,
    }));
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.tags')}</Typography>{' '}
      </FormLabel>
      <FormGroup>
        <Autocomplete
          freeSolo
          options={[]}
          id="filter-tags-input"
          value={tagValue}
          onBlur={submitTag}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitTag();
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              helperText={t('dashboard.enter_tags')}
              label={t('resource.metadata.tags')}
              fullWidth
              data-testid="filter-tags-input"
              onChange={handleChange}
            />
          )}
        />
        <StyledChipContainer>
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
