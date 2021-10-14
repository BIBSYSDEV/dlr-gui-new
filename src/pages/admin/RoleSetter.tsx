import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, List, ListItem, Switch, TextField, Typography } from '@mui/material';
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
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { StatusCode } from '../../utils/constants';
import axios, { AxiosError } from 'axios';
import { handlePotentialAxiosError } from '../../utils/AxiosErrorHandling';
import { inputBaseClasses } from '@mui/material';

const StyledSearchWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  max-width: ${StyleWidths.width3};
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const StyledInputWrapper = styled.div`
  margin-right: 1rem;
  flex: 1;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-bottom: 1rem;
  }
`;

const StyledTextField = styled(TextField)`
  width: 100%;
  & .${inputBaseClasses.root} {
    height: 3rem;
  }
`;

const StyledLine = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StyledLineAction = styled.div`
  min-width: 4rem;
  margin-left: 1rem;
`;

const StyledUserRoles = styled.div`
  max-width: ${StyleWidths.width3};
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  height: 3rem;
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 0;
  }
`;

export interface InstitutionUserSearchFormValues {
  email: string;
}

const emptyInstitutionUserSearchFormValues: InstitutionUserSearchFormValues = {
  email: '',
};

const RoleSetter = () => {
  const { t } = useTranslation();
  const [institutionUser, setInstitutionUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isCurator, setIsCurator] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [searchError, setSearchError] = useState<Error | AxiosError>();
  const [roleChangeError, setRoleChangeError] = useState<Error | AxiosError>();
  const [changesSaved, setChangesSaved] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [noAccessWarning, setNoAccessWarning] = useState(false);

  const handleSearchForUser = async (values: InstitutionUserSearchFormValues) => {
    try {
      setChangesSaved(false);
      setSearchError(undefined);
      setIsSearching(true);
      setInstitutionUser('');
      setIsCurator(false);
      setIsAdministrator(false);
      setIsPublisher(false);
      setIsEditor(false);
      setSearchTerm(values.email);

      setNoAccessWarning(false);
      const institutionUser = (await getRolesForInstitutionUser(values.email)).data;
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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === StatusCode.UNAUTHORIZED) setNoAccessWarning(true);
      } else setSearchError(handlePotentialAxiosError(error));
    } finally {
      setIsSearching(false);
    }
  };

  const handleChangeIsAdministrator = async () => {
    setChangesSaved(false);
    setRoleChangeError(undefined);
    try {
      isAdministrator
        ? await removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.administrator)
        : await setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.administrator);
      setIsAdministrator(!isAdministrator);
      setChangesSaved(true);
    } catch (error) {
      setRoleChangeError(handlePotentialAxiosError(error));
    }
  };

  const handleChangeIsCurator = async () => {
    setChangesSaved(false);
    setRoleChangeError(undefined);
    try {
      isCurator
        ? await removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.curator)
        : await setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.curator);
      setIsCurator(!isCurator);
      setChangesSaved(true);
    } catch (error) {
      setRoleChangeError(handlePotentialAxiosError(error));
    }
  };
  const handleChangeIsEditor = async () => {
    setChangesSaved(false);
    setRoleChangeError(undefined);
    try {
      isEditor
        ? await removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.editor)
        : await setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.editor);
      setIsEditor(!isEditor);
      setChangesSaved(true);
    } catch (error) {
      setRoleChangeError(handlePotentialAxiosError(error));
    }
  };
  const handleChangeIsPublisher = async () => {
    setChangesSaved(false);
    setRoleChangeError(undefined);
    try {
      isPublisher
        ? await removeRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.publisher)
        : await setRoleForInstitutionUser(institutionUser, InstitutionProfilesNames.publisher);
      setIsPublisher(!isPublisher);
      setChangesSaved(true);
    } catch (error) {
      setRoleChangeError(handlePotentialAxiosError(error));
    }
  };

  const createListItem = (
    title: string,
    description: string,
    value: boolean,
    onChangeHandler: () => void,
    role: InstitutionProfilesNames
  ) => (
    <ListItem>
      <StyledLine>
        <div>
          <Typography variant="h4" id={title}>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </div>
        <StyledLineAction>
          {user.id === institutionUser ? (
            value ? (
              <Typography variant="body1" color="primary" data-testid={`inst-user-${role}-text`}>
                {t('common.yes')}
              </Typography>
            ) : (
              <Typography variant="body1" color="primary" data-testid={`inst-user-${role}-text`}>
                {t('common.no')}
              </Typography>
            )
          ) : (
            <Switch
              data-testid={`inst-user-${role}-switch`}
              inputProps={{ 'aria-labelledby': title }}
              checked={value}
              color="primary"
              onChange={onChangeHandler}
              name="publisher"
            />
          )}
        </StyledLineAction>
      </StyledLine>
    </ListItem>
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('feedback.valid_email')).required(t('feedback.required_field')),
  });

  return (
    <>
      <Typography gutterBottom variant="h2">
        {t('administrative.set_roles_heading')}
      </Typography>
      <Formik
        onSubmit={handleSearchForUser}
        initialValues={emptyInstitutionUserSearchFormValues}
        validationSchema={validationSchema}>
        {({ isValid, dirty, values }) => (
          <Form>
            <StyledSearchWrapper>
              <StyledInputWrapper>
                <Field name="email">
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <StyledTextField
                      variant="outlined"
                      data-testid="inst-user-search-input"
                      label={t('administrative.userid')}
                      {...field}
                      type="email"
                      error={!!error && touched}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
              </StyledInputWrapper>
              <StyledButton
                data-testid="inst-user-search-button"
                disabled={!isValid || !dirty}
                variant="contained"
                type="submit"
                color="primary">
                {t('administrative.search_user')}
              </StyledButton>
            </StyledSearchWrapper>
          </Form>
        )}
      </Formik>
      {noAccessWarning && (
        <Typography variant={'body1'} color="secondary" data-testid="inst-user-search-no-access">
          {t('administrative.no_access_to_view_user')} {searchTerm}
        </Typography>
      )}
      {isSearching && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
      {searchError && <ErrorBanner userNeedsToBeLoggedIn={true} error={searchError} />}

      {institutionUser && (
        <StyledUserRoles data-testid="inst-user-card">
          <Typography variant="h3">
            {t('administrative.roles_for_user')} {institutionUser}
          </Typography>
          {user.id === institutionUser && (
            <Typography variant="body1" color={'primary'}>
              {t('administrative.cannot_change_own_roles')}
            </Typography>
          )}

          <List>
            {createListItem(
              t('administrative.roles.publisher'),
              t('administrative.role_description.publisher'),
              isPublisher,
              handleChangeIsPublisher,
              InstitutionProfilesNames.publisher
            )}
            {createListItem(
              t('administrative.roles.editor'),
              t('administrative.role_description.editor'),
              isEditor,
              handleChangeIsEditor,
              InstitutionProfilesNames.editor
            )}
            {createListItem(
              t('administrative.roles.curator'),
              t('administrative.role_description.curator'),
              isCurator,
              handleChangeIsCurator,
              InstitutionProfilesNames.curator
            )}
            {createListItem(
              t('administrative.roles.administrator'),
              t('administrative.role_description.administrator'),
              isAdministrator,
              handleChangeIsAdministrator,
              InstitutionProfilesNames.administrator
            )}
          </List>
          {changesSaved && (
            <Typography color="primary" variant="body2" data-testid="inst-user-roles-saved">
              {t('administrative.roles_changed')}
            </Typography>
          )}
        </StyledUserRoles>
      )}
      {roleChangeError && <ErrorBanner userNeedsToBeLoggedIn={true} error={roleChangeError} />}
    </>
  );
};

export default RoleSetter;
