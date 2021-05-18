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
import {
  getRolesForInstitutionUser,
  removeRoleForInstitutionUser,
  setRoleForInstitutionUser,
} from '../../api/institutionAuthorizationsApi';
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
  const [institutionUser, setInstitutionUser] = useState<string>('');
  const [searchInput, setSearchInput] = useState('gg@unit.no');
  const [isSearching, setIsSearching] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isCurator, setIsCurator] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [searchError, setSearchError] = useState<Error>();
  const [roleChangeError, setRoleChangeError] = useState<Error>();

  const handleSearchForUser = async () => {
    try {
      setSearchError(undefined);
      setIsSearching(true);
      setInstitutionUser('');
      const institutionUser = (await getRolesForInstitutionUser(searchInput)).data;
      setInstitutionUser(institutionUser.user);
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

  const handleChangeIsAdministrator = () => {
    setRoleChangeError(undefined);
    try {
      isAdministrator
        ? removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.administrator)
        : setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.administrator);
      setIsAdministrator(!isAdministrator);
    } catch (error) {
      setRoleChangeError(error);
    }
  };

  const handleChangeIsCurator = () => {
    setRoleChangeError(undefined);

    try {
      isCurator
        ? removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.curator)
        : setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.curator);
      setIsCurator(!isCurator);
    } catch (error) {
      setRoleChangeError(error);
    }
  };
  const handleChangeIsEditor = () => {
    try {
      isEditor
        ? removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.editor)
        : setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.editor);
      setIsEditor(!isEditor);
    } catch (error) {
      setRoleChangeError(error);
    }
  };
  const handleChangeIsPublisher = () => {
    try {
      isPublisher
        ? removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.publisher)
        : setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.publisher);
      setIsPublisher(!isPublisher);
    } catch (error) {
      setRoleChangeError(error);
    }
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
          label={t('administrative.userid')}
          defaultValue={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleSearchForUser();
            }
          }}
        />
        {/*//todo: validate email */}
        <Box height="100%">
          <StyledButton variant="contained" color="primary" onClick={handleSearchForUser}>
            {t('administrative.search_user')}
          </StyledButton>
        </Box>
      </StyledSearchWrapper>
      {isSearching && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
      {searchError && <ErrorBanner userNeedsToBeLoggedIn={true} error={searchError} />}
      {institutionUser && (
        <StyledCard>
          <CardContent>
            <Typography variant="h4">
              {t('administrative.roles_for_user')} {institutionUser}
            </Typography>
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
      {roleChangeError && <ErrorBanner userNeedsToBeLoggedIn={true} error={roleChangeError} />}
    </>
  );
};

export default RoleSetter;
