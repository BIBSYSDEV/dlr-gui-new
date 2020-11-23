import React, { FC, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      return <h3>{t('resource.preview_not_supported_filetype')}</h3>;
    }
  };

  return (
    <>{!isLoading ? <div style={{ minHeight: '300px' }}>{getPreviewModeBaseOnType()}</div> : <CircularProgress />}</>
  );
};

export default PreviewComponent;
