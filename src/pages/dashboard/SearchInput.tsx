import React, { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import { StyleWidths } from '../../themes/mainTheme';
import { NumberOfResultsPrPage, QueryObject, SearchParameters } from '../../types/search.types';
import { useHistory, useLocation } from 'react-router-dom';
import { rewriteSearchParams } from '../../utils/rewriteSearchParams';
import HelperTextPopover from '../../components/HelperTextPopover';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: baseline;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 1rem;
  }
`;

const StyledButton = styled(Button)`
  min-width: 7rem;
  margin-right: 0.5rem;
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
    rewriteSearchParams(SearchParameters.query, [searchTerm], history, location, true);
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
      <ButtonWrapper>
        <StyledButton
          data-testid="search-for-resource-submit"
          startIcon={<SearchIcon />}
          disabled={!searchTerm && searchTerm.length < 4}
          color="primary"
          variant="contained"
          type="submit">
          {t('common.search').toUpperCase()}
        </StyledButton>
        <HelperTextPopover
          ariaButtonLabel={t('explanation_text.search_input_helper_aria_label')}
          popoverId={'search-input-explainer'}>
          <Typography>
            {`${t('explanation_text.search_input_helper_text')} `}
            <Link href={'/search-helper'}>{t('search_tricks.page_title')}</Link>
          </Typography>
        </HelperTextPopover>
      </ButtonWrapper>
    </StyledForm>
  );
};

export default SearchInput;
