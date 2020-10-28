import { Field, Formik, Form, FieldProps, ErrorMessage } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, TextField } from '@material-ui/core';

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

  return (
    <Formik onSubmit={handleSubmit} initialValues={emptyLinkResourceFormValues}>
      {({ isValid, dirty }) => (
        <Form>
          <StyledInputBox>
            <Field name="url">
              {({ field, meta: { error, touched } }: FieldProps) => (
                <StyledTextField
                  variant="outlined"
                  fullWidth
                  aria-label="link"
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
              {t('resource.submit_link')}
            </Button>
          </StyledInputBox>
        </Form>
      )}
    </Formik>
  );
};

export default LinkResourceForm;
