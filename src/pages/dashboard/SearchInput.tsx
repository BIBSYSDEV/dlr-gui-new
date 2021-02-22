import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import { StyleWidths } from '../../themes/mainTheme';

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

const StyledGrid = styled(Grid)`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: ${StyleWidths.width3};
  }
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const StyledButton = styled(Button)`
  min-width: 5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

const SearchInput = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get('query') || '');
  const history = useHistory();
  const { t } = useTranslation();

  const setURLParams = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('query', searchTerm);
    const url = searchParams.toString();
    history.push(`?${url}`);
  };

  const updateSearchTermValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <StyledForm onSubmit={setURLParams}>
      <StyledGrid container spacing={1} alignItems="flex-end">
        <Grid item xs={1}>
          <SearchIcon />
        </Grid>
        <Grid item xs={11}>
          <StyledTextField
            variant="filled"
            fullWidth
            id="search-textfield"
            onChange={updateSearchTermValue}
            value={searchTerm}
            label={t('søk')}
          />
        </Grid>
      </StyledGrid>
      <StyledButton
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
