import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, TextField } from '@material-ui/core';
import * as Yup from 'yup';

const StyledInputBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`;

export interface LinkResourceFormValues {
  url: string;
}

const emptyLinkResourceFormValues: LinkResourceFormValues = {
  url: '',
};

interface LinkResourceFormProps {
  handleSubmit: (values: { url: string }) => void;
}

const LinkResourceForm: FC<LinkResourceFormProps> = ({ handleSubmit }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    url: Yup.string().url(t('feedback.valid_url')).required(t('feedback.required_field')),
  });

  return (
    <Formik onSubmit={handleSubmit} initialValues={emptyLinkResourceFormValues} validationSchema={validationSchema}>
      {({ isValid, dirty }) => (
        <Form>
          <StyledInputBox data-testid="new-resource-link-input-wrapper">
            <Field name="url">
              {({ field, meta: { error, touched } }: FieldProps) => (
                <StyledTextField
                  variant="filled"
                  fullWidth
                  aria-label="link"
                  label={t('resource.link_to_resource')}
                  inputProps={{ 'data-testid': 'new-resource-link-input' }}
                  {...field}
                  error={!!error && touched}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              data-testid="new-resource-link-submit-button"
              disabled={!isValid || !dirty}
              type="submit">
              {t('resource.submit_link').toUpperCase()}
            </Button>
          </StyledInputBox>
        </Form>
      )}
    </Formik>
  );
};

export default LinkResourceForm;
