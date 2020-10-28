import * as Yup from 'yup';
import { ErrorMessage } from './errorMessage';

export const urlValidationSchema = Yup.object().shape({
  url: Yup.string().trim().url(ErrorMessage.INVALID_FORMAT).required(ErrorMessage.REQUIRED),
});
