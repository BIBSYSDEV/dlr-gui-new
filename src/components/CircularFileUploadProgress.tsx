import React, { FC, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import useInterval from '../utils/useInterval';
import { Uppy } from '../types/file.types';
import { CircularProgress } from '@material-ui/core';

interface CircularFileUploadProgressProps {
  uppy: Uppy;
  isUploadingNewFile: boolean;
  describedById: string;
}

const completedDelayMilliSeconds = 3000;
const pollingDelayMilliseconds = 500;

const CircularFileUploadProgress: FC<CircularFileUploadProgressProps> = ({
  uppy,
  isUploadingNewFile,
  describedById,
}) => {
  const [percentageFileUpload, setPercentageFileUpload] = useState(0);
  const [shouldShowCompleted, setShouldShowCompleted] = useState(false);
  const [turnOff, setTurnOff] = useState(false);

  const calculateShouldUseInterval = () => {
    if (percentageFileUpload === 100) {
      if (turnOff) {
        return null;
      } else {
        return completedDelayMilliSeconds;
      }
    } else {
      return pollingDelayMilliseconds;
    }
  };

  useInterval(() => {
    setPercentageFileUpload(uppy.getState().totalProgress);
    if (uppy.getState().totalProgress === 100) {
      if (!shouldShowCompleted) {
        setShouldShowCompleted(true);
      } else {
        setShouldShowCompleted(false);
        setTurnOff(true);
      }
    }
  }, calculateShouldUseInterval());

  return (
    <>
      {percentageFileUpload > 0 && percentageFileUpload < 100 && (
        <CircularProgress
          aria-describedby={describedById}
          size={15}
          variant="determinate"
          value={percentageFileUpload}
        />
      )}
      {shouldShowCompleted && <CheckCircleIcon aria-describedby={describedById} />}
    </>
  );
};
export default CircularFileUploadProgress;
