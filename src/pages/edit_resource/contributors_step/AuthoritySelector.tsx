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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Pagination from '@material-ui/lab/Pagination';
import ErrorBanner from '../../../components/ErrorBanner';
import styled from 'styled-components';
import DialogContentText from '@material-ui/core/DialogContentText';
import AuthorityListItem from './AuthorityListItem';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { DeviceWidths } from '../../../themes/mainTheme';
import useDebounce from '../../../utils/useDebounce';
import { BIBSYS_AUTHORITY_URL } from '../../../utils/constants';

const StyledDialog = styled(Dialog)`
  min-width: 80vw;
`;

const StyledHowToRegIcon = styled(VerifiedUserIcon)`
  color: darkgreen;
`;

const StyledListWrapper = styled.div`
  margin-top: 2rem;
`;

const StyledLinkButton: any = styled(Button)`
  color: green;
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
  onAuthoritySelected?: (authorities: Authority[]) => void;
}

const AuthoritySelector: FC<AuthoritySelectorProps> = ({
  initialNameValue,
  resourceIdentifier,
  creatorOrContributorId,
  onAuthoritySelected,
}) => {
  const [selectedAuthorities, setSelectedAuthorities] = useState<Authority[]>([]);
  const [authorityInputSearchValue, setAuthorityInputSearchValue] = useState('');
  const [textFieldDirty, setTextFieldDirty] = useState(false);
  const [textFieldTouched, setTextFieldTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [authoritySearchResponse, setAuthoritySearchResponse] = useState<AuthoritySearchResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const fullScreenDialog = window.screen.height < DeviceWidths.sm;
  const debouncedSearchTerm = useDebounce(authorityInputSearchValue, 500);

  const handleClickOpen = () => {
    setAuthorityInputSearchValue(nameConverter(initialNameValue));
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
        if (response.length > 0 && onAuthoritySelected) {
          onAuthoritySelected(response);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchAuthorities();
  }, [resourceIdentifier, creatorOrContributorId, onAuthoritySelected]);

  const searchForAuthorities = useCallback(
    (offset: number) => {
      setIsLoading(true);
      setError(null);
      searchAuthorities(debouncedSearchTerm, offset)
        .then((response) => {
          setAuthoritySearchResponse(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    },
    [debouncedSearchTerm]
  );

  const invalidInput = (): boolean => {
    return textFieldDirty && textFieldTouched && authorityInputSearchValue.length < 1;
  };

  const handleSelectedAuthorityChange = (authorityId: string) => {
    if (authoritySearchResponse) {
      const newAuthority = authoritySearchResponse.results.find((auth) => auth.id === authorityId);
      if (newAuthority) {
        postAuthorityForResourceCreatorOrContributor(resourceIdentifier, creatorOrContributorId, newAuthority);
        setSelectedAuthorities([newAuthority]);
        if (onAuthoritySelected) {
          onAuthoritySelected([newAuthority]);
        }
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
    if (debouncedSearchTerm.length > 1 && selectedAuthorities.length === 0) {
      searchForAuthorities(OffsetFirstPage);
    }
  }, [debouncedSearchTerm.length, searchForAuthorities, selectedAuthorities, open]);

  return (
    <>
      {selectedAuthorities.length > 0 && (
        <StyledLinkButton
          target="_blank"
          rel="noopener noreferrer"
          href={`${BIBSYS_AUTHORITY_URL}/${selectedAuthorities[0].id}`}
          startIcon={<StyledHowToRegIcon />}>
          {selectedAuthorities[0].name}
        </StyledLinkButton>
      )}
      {selectedAuthorities.length === 0 && (
        <Button variant="outlined" color="primary" onClick={handleClickOpen} startIcon={<AddCircleIcon />}>
          {t('authority.verify')}
        </Button>
      )}
      <StyledDialog fullScreen={fullScreenDialog} open={open} onClose={handleClose} aria-labelledby={FormDialogTitleId}>
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
            <StyledListWrapper>
              <Typography id={ListTitleId} variant="h3">
                {t('authority.authorities')}:
              </Typography>
              <List aria-labelledby={ListTitleId}>
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
            </StyledListWrapper>
          )}
          {selectedAuthorities.length === 0 &&
            authoritySearchResponse?.numFound &&
            authoritySearchResponse.numFound >= AuthorityListLength && (
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
          <Button variant="contained" onClick={handleClose} color="primary">
            {t('authority.close')}
          </Button>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default AuthoritySelector;
