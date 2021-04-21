import React, { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import { StyleWidths } from '../../themes/mainTheme';
import { NumberOfResultsPrPage, QueryObject, SearchParameters } from '../../types/search.types';
import { useHistory, useLocation } from 'react-router-dom';
import { rewriteSearchParams } from '../../utils/rewriteSearchParams';

const StyledForm = styled.form`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const StyledTextField = styled(TextField)`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width3};
    margin-right: 1rem;
  }
`;

const StyledButton = styled(Button)`
  min-width: 7rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

interface SearchInputProps {
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
  queryObject: QueryObject;
}

const SearchInput: FC<SearchInputProps> = ({ setQueryObject, queryObject }) => {
  const [searchTerm, setSearchTerm] = useState(queryObject.query);
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQueryObject((prevState) => ({
      ...prevState,
      query: searchTerm,
      limit: NumberOfResultsPrPage,
      offset: 0,
      queryFromURL: false,
    }));
    rewriteSearchParams(SearchParameters.query, [searchTerm], history, location);
  };

  useEffect(() => {
    setSearchTerm(queryObject.query);
  }, [queryObject.query]);

  const updateSearchTermValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledTextField
        data-testid="search-for-resource-input"
        variant="filled"
        fullWidth
        id="search-textfield"
        onChange={updateSearchTermValue}
        value={searchTerm}
        label={t('common.search')}
      />
      <StyledButton
        data-testid="search-for-resource-submit"
        startIcon={<SearchIcon />}
        disabled={!searchTerm && searchTerm.length < 4}
        color="primary"
        variant="contained"
        type="submit">
        {t('common.search')}
      </StyledButton>
    </StyledForm>
  );
};

export default SearchInput;
