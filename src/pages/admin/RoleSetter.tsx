import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import { getRolesForUser } from '../../api/institutionAuthorizationsApi';
import ErrorBanner from '../../components/ErrorBanner';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import { InstitutionProfilesNames } from '../../types/user.types';

const StyledSearchWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const RoleSetter = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<string>();
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCurator, setIsCurator] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [searchError, setSearchError] = useState<Error>();

  const handleSearchForUser = async () => {
    try {
      setSearchError(undefined);
      setIsSearching(true);
      const institutionUser = (await getRolesForUser(searchInput)).data;
      setUser(institutionUser.user);
      institutionUser.profiles.forEach((profile) => {
        switch (profile.name) {
          case InstitutionProfilesNames.curator:
            setIsCurator(true);
            break;
          case InstitutionProfilesNames.administrator:
            setIsAdmin(true);
            break;
          case InstitutionProfilesNames.editor:
            setIsEditor(true);
            break;
          case InstitutionProfilesNames.publisher:
            setIsPublisher(true);
            break;
          default:
            break;
        }
      });
    } catch (error) {
      setSearchError(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChangeIsAdmin = async () => {
    //todo: api
    setIsAdmin(!isAdmin);
  };
  const handleChangeIsCurator = async () => {
    //todo: api
    setIsCurator(!isCurator);
  };
  const handleChangeIsEditor = async () => {
    //todo: api
    setIsEditor(!isEditor);
  };
  const handleChangeIsPublisher = async () => {
    //todo: api
    setIsPublisher(!isPublisher);
  };

  return (
    <>
      <Typography gutterBottom variant="h2">
        {t('administrative.set_roles_heading')}
      </Typography>
      <StyledSearchWrapper>
        <TextField onChange={(event) => setSearchInput(event.target.value)}></TextField>
        {/*//todo: validate email*/}
        <Button variant="contained" color="primary" onClick={handleSearchForUser}>
          Søk bruker
        </Button>
      </StyledSearchWrapper>
      {isSearching && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
      {searchError && <ErrorBanner userNeedsToBeLoggedIn={true} error={searchError} />}
      {user && (
        <Card>
          <CardContent>
            <Typography variant="body1">Funnet bruker: {user}</Typography>
            <Typography variant="body2">Sett roller for brukeren</Typography>
            <List>
              <ListItem>
                <div>
                  <Typography variant="h6">Utgiver</Typography>
                  <Typography variant="caption">Tilgang til å publisere og redigere egne ressurser</Typography>
                </div>
                <ListItemSecondaryAction>
                  <Switch checked={isPublisher} onChange={handleChangeIsPublisher} name="publisher" />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <div>
                  <Typography variant="h6">Redaktør</Typography>
                  <Typography variant="caption">
                    Tilgang til Rapporteingsbehandling og har alle redigerings- og publiseringsmuligheter
                  </Typography>
                </div>
                <Switch checked={isEditor} onChange={handleChangeIsEditor} name="editor" />
              </ListItem>
              <ListItem>
                <div>
                  <Typography variant="h6">Kurator</Typography>
                  <Typography variant="caption">
                    Tilgang til å tildele DOI og alle redigerings- og publiseringsmuligheter{' '}
                  </Typography>
                </div>
                <Switch checked={isCurator} onChange={handleChangeIsCurator} name="curator" />
              </ListItem>
              <ListItem>
                <div>
                  <Typography variant="h6">Administrator</Typography>
                  <Typography variant="caption">Tilgang til å tildele roller innenfor egen institusjon</Typography>
                </div>
                <Switch checked={isAdmin} onChange={handleChangeIsAdmin} name="admin" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default RoleSetter;
