import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {
  getAuthoritiesForResourceCreatorOrContributor,
  postAuthorityForResourceCreatorOrContributor,
  searchAuthorities,
} from '../../../api/authoritiesApi';
import { Authority, AuthoritySearchResponse } from '../../../types/authority.types';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Pagination from '@material-ui/lab/Pagination';
import ErrorBanner from '../../../components/ErrorBanner';
import styled from 'styled-components';
import DialogContentText from '@material-ui/core/DialogContentText';
import AuthorityListItem from './AuthorityListItem';
import { useTranslation } from 'react-i18next';

const StyledDialog = styled(Dialog)`
  min-width: 80vw;
`;

const StyledHowToRegIcon = styled(HowToRegIcon)`
  color: darkgreen;
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

const OffsetFirstPage = 0;
const FirstPage = 1;
const AuthorityListLength = 10;
const FormDialogTitleId = 'form-dialog-title';
const TextFieldId = 'name';
const ListTitleId = 'nested-list-subheader';

interface AuthoritySelectorProps {
  initialNameValue: string;
  resourceIdentifier: string;
  creatorOrContributorId: string;
}

const AuthoritySelector: FC<AuthoritySelectorProps> = ({
  initialNameValue,
  resourceIdentifier,
  creatorOrContributorId,
}) => {
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [authorityInputSearchValue, setAuthorityInputSearchValue] = useState(nameConverter(initialNameValue));
  const [textFieldDirty, setTextFieldDirty] = useState(false);
  const [textFieldTouched, setTextFieldTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [authoritySearchResponse, setAuthoritySearchResponse] = useState<AuthoritySearchResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
    searchForAuthorities((value - FirstPage) * AuthorityListLength);
  };

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const response = await getAuthoritiesForResourceCreatorOrContributor(
          resourceIdentifier,
          creatorOrContributorId
        );
        setSelectedAuthorities(response);
      } catch (error) {
        setError(error);
      }
    };
    fetchAuthorities();
  }, [resourceIdentifier, creatorOrContributorId]);

  const searchForAuthorities = useCallback(
    (offset: number) => {
      setIsLoading(true);
      setError(null);
      searchAuthorities(authorityInputSearchValue, offset)
        .then((response) => {
          setAuthoritySearchResponse(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    },
    [authorityInputSearchValue]
  );

  const invalidInput = (): boolean => {
    return textFieldDirty && textFieldTouched && authorityInputSearchValue.length < 1;
  };

  const handleSelectedAuthorityChange = (authorityId: string) => {
    if (authoritySearchResponse) {
      const newAuthority = authoritySearchResponse.results.find((auth) => auth.id === authorityId);
      if (newAuthority) {
        postAuthorityForResourceCreatorOrContributor(resourceIdentifier, creatorOrContributorId, newAuthority);
        setSelectedAuthorities([...selectedAuthorities, newAuthority]);
      }
    }
  };

  const checkIfListItemIsSelectedAuthority = (checkAuthority: Authority): boolean => {
    if (selectedAuthorities) {
      return selectedAuthorities.findIndex((auth) => auth.id === checkAuthority.id) > -1;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (authorityInputSearchValue.length > 1 && selectedAuthorities.length === 0) {
      searchForAuthorities(OffsetFirstPage);
    }
  }, [authorityInputSearchValue.length, searchForAuthorities, selectedAuthorities, open]);

  return (
    <>
      {selectedAuthorities.length > 0 && (
        <Button variant="outlined" color="primary" onClick={handleClickOpen} startIcon={<StyledHowToRegIcon />}>
          {t('authority.view_verified_authority')}
        </Button>
      )}
      {selectedAuthorities.length === 0 && (
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          {t('authority.verify')}
        </Button>
      )}
      <StyledDialog open={open} onClose={handleClose} aria-labelledby={FormDialogTitleId}>
        <DialogTitle id={FormDialogTitleId}>
          {selectedAuthorities.length === 0 && t('authority.add_authority')}
          {selectedAuthorities.length > 0 && t('authority.authorities')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t('authority.not_possible_to_remove_warning')}. </DialogContentText>
          {selectedAuthorities.length === 0 && (
            <form onSubmit={() => searchForAuthorities(OffsetFirstPage)}>
              <TextField
                value={authorityInputSearchValue}
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
          )}

          {isLoading && <CircularProgress />}
          {authoritySearchResponse && !isLoading && (
            <List
              aria-labelledby={ListTitleId}
              subheader={
                <ListSubheader component="div" id={ListTitleId}>
                  {t('authority.authorities')}
                </ListSubheader>
              }>
              {selectedAuthorities.map((authority, index) => (
                <AuthorityListItem
                  isSelected={true}
                  handleSelectedAuthorityChange={handleSelectedAuthorityChange}
                  authority={authority}
                  key={index}
                />
              ))}
              {!isLoading &&
                selectedAuthorities.length === 0 &&
                authoritySearchResponse.results.map((authority, index) => (
                  <AuthorityListItem
                    isSelected={checkIfListItemIsSelectedAuthority(authority)}
                    handleSelectedAuthorityChange={handleSelectedAuthorityChange}
                    authority={authority}
                    key={index}
                  />
                ))}
            </List>
          )}
          {authoritySearchResponse?.numFound && authoritySearchResponse.numFound >= AuthorityListLength && (
            <Pagination
              color="primary"
              count={Math.ceil(authoritySearchResponse.numFound / AuthorityListLength)}
              page={page}
              onChange={(_event, value) => {
                handlePageChange(value);
              }}
            />
          )}
          {error && <ErrorBanner userNeedsToBeLoggedIn={true} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('authority.close')}
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default AuthoritySelector;
