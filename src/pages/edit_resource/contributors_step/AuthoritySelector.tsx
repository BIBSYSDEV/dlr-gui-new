import React, { createRef, FC, useCallback, useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { postAuthorityForResourceCreatorOrContributor, searchAuthorities } from '../../../api/authoritiesApi';
import {
  Authority,
  AuthoritySearchResponse,
  DefaultAuthoritySearchLength,
  DefaultAuthoritySearchOffset,
} from '../../../types/authority.types';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';
import ErrorBanner from '../../../components/ErrorBanner';
import styled from 'styled-components';
import DialogContentText from '@material-ui/core/DialogContentText';
import AuthorityListItem from './AuthorityListItem';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { DeviceWidths } from '../../../themes/mainTheme';
import useDebounce from '../../../utils/useDebounce';
import { useMediaQuery } from '@material-ui/core';

const StyledDialog = styled(Dialog)`
  min-width: 80vw;
`;

const StyledContentWrapper = styled.div`
  min-height: 50vh;
`;

const StyledListWrapper = styled.div`
  margin-top: 2rem;
`;

const StyledProgressWrapper = styled.div`
  margin-top: 2.5rem;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const nameConverter = (fullName: string) => {
  if (fullName.includes(',')) {
    return fullName;
  }
  const names = fullName.split(' ');
  if (names.length <= 1) {
    return fullName;
  }
  const surname = names[names.length - 1] + ',';
  names[names.length - 1] = names[0];
  names[0] = surname;
  return names.join(' ');
};

const OffsetFirstPage = DefaultAuthoritySearchOffset;
const FirstPage = 1;
const AuthorityListLength = DefaultAuthoritySearchLength;
const FormDialogTitleId = 'form-dialog-title';
const TextFieldId = 'name';
const ListTitleId = 'nested-list-subheader';

interface AuthoritySelectorProps {
  initialNameValue: string;
  resourceIdentifier: string;
  creatorOrContributorId: string;
  onAuthoritySelected?: (authorities: Authority[]) => void;
}

const AuthoritySelector: FC<AuthoritySelectorProps> = ({
  initialNameValue,
  resourceIdentifier,
  creatorOrContributorId,
  onAuthoritySelected,
}) => {
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [authorityInputSearchValue, setAuthorityInputSearchValue] = useState(nameConverter(initialNameValue));
  const [textFieldDirty, setTextFieldDirty] = useState(false);
  const [textFieldTouched, setTextFieldTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [authoritySearchResponse, setAuthoritySearchResponse] = useState<AuthoritySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const fullScreenDialog = useMediaQuery(`(max-width:${DeviceWidths.sm}px)`);
  const debouncedSearchTerm = useDebounce(authorityInputSearchValue, 500);
  const startOfList = createRef<HTMLUListElement>();
  const mountedRef = useRef(true);

  const handleClickOpen = () => {
    setAuthorityInputSearchValue(nameConverter(initialNameValue));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
    searchForAuthorities((value - FirstPage) * AuthorityListLength, debouncedSearchTerm);
    if (startOfList && startOfList.current) {
      startOfList.current.scrollIntoView();
    }
  };

  const searchForAuthorities = useCallback((offset: number, searchTerm) => {
    const search = async (offset: number, searchTerm: string) => {
      try {
        setError(null);
        setIsLoading(true);
        setError(null);
        setAuthoritySearchResponse(null);
        const response = await searchAuthorities(searchTerm, offset);
        if (!mountedRef.current) return null;
        setAuthoritySearchResponse(response.data);
      } catch (error) {
        if (!mountedRef.current) return null;
        setError(error);
        setIsLoading(false);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };
    search(offset, searchTerm);
  }, []);

  const invalidInput = (): boolean => {
    return textFieldDirty && textFieldTouched && authorityInputSearchValue.length < 1;
  };

  const handleSelectedAuthorityChange = (authority: Authority) => {
    if (authoritySearchResponse) {
      postAuthorityForResourceCreatorOrContributor(resourceIdentifier, creatorOrContributorId, authority);
      setSelectedAuthorities([authority]);
      setOpen(false);
      if (onAuthoritySelected) {
        onAuthoritySelected([authority]);
      }
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm.length >= 1 && open) {
      setPage(FirstPage);
      searchForAuthorities(OffsetFirstPage, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, open, searchForAuthorities]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <>
      <Button data-testid="verify-authority-button" variant="outlined" color="primary" onClick={handleClickOpen}>
        {t('authority.verify')}
      </Button>
      <StyledDialog fullScreen={fullScreenDialog} open={open} onClose={handleClose} aria-labelledby={FormDialogTitleId}>
        <DialogTitle id={FormDialogTitleId}>
          {selectedAuthorities.length === 0 && t('authority.add_authority')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t('authority.not_possible_to_remove_warning')}. </DialogContentText>
          <StyledContentWrapper>
            <form onSubmit={() => searchForAuthorities(OffsetFirstPage, debouncedSearchTerm)}>
              <TextField
                value={authorityInputSearchValue}
                inputProps={{ 'data-testid': 'authority-search-field' }}
                onChange={(event) => {
                  setTextFieldDirty(true);
                  setAuthorityInputSearchValue(event.target.value);
                }}
                onBlur={() => setTextFieldTouched(true)}
                autoFocus
                error={invalidInput()}
                helperText={invalidInput() && t('authority.empty_search_query')}
                id={TextFieldId}
                label={t('authority.search_for_authority')}
                type="text"
                fullWidth
              />
            </form>
            {isLoading && (
              <StyledProgressWrapper>
                <CircularProgress />
              </StyledProgressWrapper>
            )}
            {authoritySearchResponse && !isLoading && (
              <StyledListWrapper>
                <Typography id={ListTitleId} variant="h3">
                  {t('authority.authorities')} ({authoritySearchResponse.numFound}):
                </Typography>
                <List ref={startOfList} aria-labelledby={ListTitleId}>
                  {!isLoading &&
                    authoritySearchResponse.results.map((authority, index) => (
                      <AuthorityListItem
                        handleSelectedAuthorityChange={handleSelectedAuthorityChange}
                        authority={authority}
                        key={index}
                      />
                    ))}
                </List>
              </StyledListWrapper>
            )}
            {authoritySearchResponse && authoritySearchResponse.numFound >= AuthorityListLength && (
              <Pagination
                color="primary"
                count={Math.ceil(authoritySearchResponse.numFound / AuthorityListLength)}
                page={page}
                onChange={(_event, value) => {
                  handlePageChange(value);
                }}
              />
            )}
            {error && <ErrorBanner userNeedsToBeLoggedIn={true} error={error} />}
          </StyledContentWrapper>
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="authority-selector-close-button"
            variant="contained"
            onClick={handleClose}
            color="primary">
            {t('common.close')}
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default AuthoritySelector;
