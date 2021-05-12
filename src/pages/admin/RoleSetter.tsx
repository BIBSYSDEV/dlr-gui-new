import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
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
import { StyleWidths } from '../../themes/mainTheme';

const StyledSearchWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  max-width: ${StyleWidths.width3};
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledTextField = styled(TextField)`
  margin-right: 1rem;
  flex: 1;
  & .MuiInputBase-root {
    height: 3rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-bottom: 1rem;
  }
`;
const StyledCard = styled(Card)`
  max-width: ${StyleWidths.width3};
  margin-top: 1rem;
`;

const StyledButton = styled(Button)`
  height: 3rem;
`;

const RoleSetter = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<string>();
  const [searchInput, setSearchInput] = useState('pcb@unit.no');
  const [isSearching, setIsSearching] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
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
            setIsAdministrator(true);
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

  const handleChangeIsAdministrator = async () => {
    //todo: api
    setIsAdministrator(!isAdministrator);
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

  const createListItem = (title: string, description: string, value: boolean, onChangeHandler: any) => (
    <ListItem>
      <div>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="caption">{description}</Typography>
      </div>
      <ListItemSecondaryAction>
        <Switch checked={value} color="primary" onChange={onChangeHandler} name="publisher" />
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <>
      <Typography gutterBottom variant="h2">
        {t('administrative.set_roles_heading')}
      </Typography>
      <StyledSearchWrapper>
        <StyledTextField
          variant="outlined"
          label={t('common.brukerid')}
          defaultValue={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSearchForUser();
            }
          }}
        />
        {/*//todo: validate email | search on enter*/}
        <Box height="100%">
          <StyledButton variant="contained" color="primary" onClick={handleSearchForUser}>
            Søk bruker
          </StyledButton>
        </Box>
      </StyledSearchWrapper>
      {isSearching && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
      {searchError && <ErrorBanner userNeedsToBeLoggedIn={true} error={searchError} />}
      {user && (
        <StyledCard>
          <CardContent>
            <Typography variant="h4">Bruker: {user}</Typography>
            <List>
              {createListItem(
                t('administrative.roles.publisher'),
                t('administrative.role_description.publisher'),
                isPublisher,
                handleChangeIsPublisher
              )}
              {createListItem(
                t('administrative.roles.editor'),
                t('administrative.role_description.editor'),
                isEditor,
                handleChangeIsEditor
              )}
              {createListItem(
                t('administrative.roles.curator'),
                t('administrative.role_description.curator'),
                isCurator,
                handleChangeIsCurator
              )}
              {createListItem(
                t('administrative.roles.administrator'),
                t('administrative.role_description.administrator'),
                isAdministrator,
                handleChangeIsAdministrator
              )}
            </List>
          </CardContent>
        </StyledCard>
      )}
    </>
  );
};

export default RoleSetter;
