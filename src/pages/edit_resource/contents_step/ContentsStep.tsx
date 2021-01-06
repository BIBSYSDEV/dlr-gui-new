import React, { Dispatch, FC, SetStateAction } from 'react';
import { Uppy } from '../../../types/file.types';
import FileFields from './FileFields';

interface ContentsStepProps {
  uppy: Uppy;
  setAllChangesSaved: Dispatch<SetStateAction<boolean>>;
}

const ContentsStep: FC<ContentsStepProps> = ({ uppy, setAllChangesSaved }) => {
  return (
    <>
      <FileFields uppy={uppy} setAllChangesSaved={setAllChangesSaved} />
    </>
  );
};

export default ContentsStep;
