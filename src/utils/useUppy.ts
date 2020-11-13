import { useState, useEffect } from 'react';
import { Uppy } from '../types/file.types';
import { createUppy } from './uppy-config';

const useUppy = (resourceIdentifier = '', shouldAllowMultipleFiles = true): Uppy => {
  const [uppy] = useState(createUppy(resourceIdentifier, shouldAllowMultipleFiles));

  useEffect(
    () => () => {
      uppy && uppy.close();
    },
    [uppy]
  );

  return uppy;
};

export default useUppy;
