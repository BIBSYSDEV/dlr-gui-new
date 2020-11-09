import React, { FC, useEffect, useState } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

interface Preview {
  type: string;
  theSource: string;
}

interface PreviewComponentProps {
  preview: Preview;
}

const PreviewComponent: FC<PreviewComponentProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (props != null) {
      setIsLoading(true);
    }
  }, []);

  const useStyles = makeStyles({
    root: {
      minWidth: 270,
    },
    title: {
      fontSize: 14,
      marginLeft: 5,
    },
    pos: {
      marginBottom: 5,
      marginLeft: 5,
    },
  });

  const classes = useStyles();

  const getPreviewModeBaseOnType = () => {
    if (props.preview.type == 'image') {
      return (
        <>
          <picture>
            <img src={props.preview.theSource} width="400" height="300" />
          </picture>
        </>
      );
    } else if (props.preview.type == 'video') {
      return (
        <>
          <video width="400" height="300" src={props.preview.theSource} controls></video>
        </>
      );
    } else {
      return <h3>Fohåndssvisning støttes ikke for dette filformatet.</h3>;
    }
  };

  return <>{isLoading ? <div>{getPreviewModeBaseOnType()}</div> : <CircularProgress />}</>;
};

export default PreviewComponent;
