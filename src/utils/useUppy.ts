import { useState, useEffect } from 'react';
import { Uppy } from '../types/file.types';
import { createUppy } from './uppy-config';
import { Resource } from '../types/resource.types';

const useUppy = (
  resourceIdentifier = '',
  shouldAllowMultipleFiles = true,
  onCreateFile: (newResource: Resource) => void
): Uppy => {
  const [uppy] = useState(createUppy(resourceIdentifier, shouldAllowMultipleFiles, onCreateFile));

  useEffect(
    () => () => {
      uppy && uppy.close();
    },
    [uppy]
  );

  return uppy;
};

export default useUppy;
