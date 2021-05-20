import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
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
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';

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
  & .MuiInputBase-root {
    height: 3rem;
  }
`;

const StyledLine = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StyledCard = styled(Card)`
  max-width: ${StyleWidths.width3};
  margin-top: 1rem;
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
  const [institutionUser, setInstitutionUser] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isCurator, setIsCurator] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [searchError, setSearchError] = useState<Error>();
  const [roleChangeError, setRoleChangeError] = useState<Error>();
  const [changesSaved, setChangesSaved] = useState(false);

  const handleSearchForUser = async (values: InstitutionUserSearchFormValues) => {
    try {
      setChangesSaved(false);
      setSearchError(undefined);
      setIsSearching(true);
      setInstitutionUser('');
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
      setSearchError(error);
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
      setRoleChangeError(error);
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
      setRoleChangeError(error);
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
      setRoleChangeError(error);
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
      setRoleChangeError(error);
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
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
        </div>
        <Switch
          data-testid={`inst-user-${role}-switch`}
          inputProps={{ 'aria-label': `${t('administrative.toggle')} ${title}` }}
          checked={value}
          color="primary"
          onChange={onChangeHandler}
          name="publisher"
        />
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
        {({ isValid, dirty }) => (
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
      {isSearching && (
        <StyledProgressWrapper>
          <CircularProgress />
        </StyledProgressWrapper>
      )}
      {searchError && <ErrorBanner userNeedsToBeLoggedIn={true} error={searchError} />}
      {institutionUser && (
        <StyledCard data-testid="inst-user-card">
          <CardContent>
            <Typography variant="h3">
              {t('administrative.roles_for_user')} {institutionUser}
            </Typography>
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
          </CardContent>
        </StyledCard>
      )}
      {roleChangeError && <ErrorBanner userNeedsToBeLoggedIn={true} error={roleChangeError} />}
    </>
  );
};

export default RoleSetter;
