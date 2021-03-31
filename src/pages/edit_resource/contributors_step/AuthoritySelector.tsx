import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import {
  getAuthoritiesForResourceCreatorOrContributor,
  postAuthorityForResourceCreatorOrContributor,
  searchAuthorities,
} from '../../../api/authoritiesApi';
import { Authority, AuthoritySearchResponse } from '../../../types/authority.types';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import { Pagination } from '@material-ui/lab';
import ErrorBanner from '../../../components/ErrorBanner';
import styled from 'styled-components';
import DialogContentText from '@material-ui/core/DialogContentText';
import AuthorityListItem from './AuthorityListItem';

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

interface AuthoritySelectorProps {
  initialNameValue: string;
  resourceIdentifier: string;
  creatorOrContributorId: string;
}

//Behandle tekststreng.
//1. med komma: kan kjøres rett inn.
//2. uten komma: må behandles.

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (value: number) => {
    setPage(value);
    searchForAuthorities((value - 1) * 10);
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
    if (initialNameValue.length > 1 && selectedAuthorities.length === 0) {
      searchForAuthorities(0);
    }
  }, [initialNameValue, searchForAuthorities, selectedAuthorities, open]);

  return (
    <>
      {selectedAuthorities.length > 0 && (
        <Button variant="outlined" color="primary" onClick={handleClickOpen} startIcon={<StyledHowToRegIcon />}>
          Se verifisert autoritet
        </Button>
      )}
      {selectedAuthorities.length === 0 && (
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Verifiser
        </Button>
      )}
      <StyledDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {selectedAuthorities.length === 0 && 'Legg til autoriteter'}
          {selectedAuthorities.length > 0 && 'Autoriteter'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>NB! Det er ikke mulig å slette en autoritet etter at den er valgt. </DialogContentText>
          {selectedAuthorities.length === 0 && (
            <form onSubmit={() => searchForAuthorities(0)}>
              <TextField
                value={authorityInputSearchValue}
                onChange={(event) => {
                  setTextFieldDirty(true);
                  setAuthorityInputSearchValue(event.target.value);
                }}
                onBlur={() => setTextFieldTouched(true)}
                autoFocus
                error={invalidInput()}
                helperText={invalidInput() && 'søkestreng er tom'}
                id="name"
                label="Finn verifisert autoritet"
                type="text"
                fullWidth
              />
            </form>
          )}

          {isLoading && <CircularProgress />}
          {authoritySearchResponse && !isLoading && (
            <List
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Autoriteter
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
          {authoritySearchResponse?.numFound && authoritySearchResponse.numFound >= 10 && (
            <Pagination
              color="primary"
              count={Math.ceil(authoritySearchResponse.numFound / 10)}
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
            Lukk
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default AuthoritySelector;
