import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Chip, FormControl, FormGroup, TextField } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { QueryObject } from '../../types/search.types';
import { Colors } from '../../themes/mainTheme';
import CancelIcon from '@material-ui/icons/Cancel';

const StyledFormControl: any = styled(FormControl)`
  margin-left: 1rem;
  margin-right: 1rem;
`;

const StyledChip = styled(Chip)`
  && {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-right: 0.5rem;
    //background-color: ${Colors.ChipBackground};
    //color: ${Colors.Background};
    &:focus {
      //color: ${Colors.PrimaryText};
      //background-color: ${Colors.ChipBackgroundFocus};
    }
  }
`;

const StyledCancelIcon = styled(CancelIcon)`
  color: ${Colors.ChipIconBackground};
`;

const StyledChipContainer = styled.div`
  display: flex;
`;

interface TagsFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const TagsFiltering: FC<TagsFilteringProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const [tagValue, setTagValue] = useState('');

  const handleInput = (event: any) => {
    //TODO: no duplicates
    const value = event.target.value;
    console.log('adding tag!', value);
    setQueryObject((prevState) => ({
      ...prevState,
      tags: [...prevState.tags, value],
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagValue(event.target.value);
  };

  const handleDelete = (tag: string) => {
    console.info('Delete ' + tag);
    // setQueryObject((prevState) => ({
    //   ...prevState,
    //   tags: [...prevState.tags, value],
    // }));
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.tags')}</Typography>{' '}
      </FormLabel>
      <FormGroup>
        <TextField
          id="filter-tags-input"
          label={t('resource.metadata.tags')}
          helperText={t('resource.add_tags')}
          variant="outlined"
          fullWidth
          data-testid="filter-tags-input"
          onBlur={handleInput}
          value={tagValue}
          onChange={handleChange}
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
