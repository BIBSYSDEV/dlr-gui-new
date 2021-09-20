import axios, { AxiosError } from 'axios';

export const handlePotentialAxiosError = (error: unknown): AxiosError | Error => {
  if (axios.isAxiosError(error)) {
    return error;
  } else if (error instanceof Error) {
    return error;
  } else {
    return new Error('An error occurred');
  }
};
