import React, { FC, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';

const imageType = 'image';
const videoType = 'video';

interface Preview {
  type: string;
  theSource: string;
}

interface PreviewComponentProps {
  preview: Preview;
}

const PreviewComponent: FC<PreviewComponentProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (props != null) {
      setIsLoading(false);
    }
  }, [props]);

  const getPreviewModeBaseOnType = () => {
    //todo: inline i JSX
    if (props.preview.type === imageType) {
      return (
        <>
          <img src={props.preview.theSource} width="400px" height="300px" alt="Preview of resource" />
        </>
      );
    } else if (props.preview.type === videoType) {
      return (
        <>
          <video width="400px" height="300px" src={props.preview.theSource} controls />
        </>
      );
    } else {
      return <h3>Fohåndsvisning støttes ikke for dette filformatet.</h3>;
    }
  };

  return (
    <>{!isLoading ? <div style={{ minHeight: '300px' }}>{getPreviewModeBaseOnType()}</div> : <CircularProgress />}</>
  );
};

export default PreviewComponent;
