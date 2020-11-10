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

/*
Enkel komponent for å vise frem media innhold
Den mottar kilden til innholdet og typen innholdet er av.
Per nå støttes "video" og "image" som typer
*/
const PreviewComponent: FC<PreviewComponentProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (props != null) {
      setIsLoading(false);
    }
  }, []);

  /*
  Metode som bestemmer visningstype basert på 
  hvilken form for data som mottas.
  Per nå støttes bare video eller bilde fremvisning.
  Brukeren får beskjed om det ressursen ikke er en av disse typene
  */
  const getPreviewModeBaseOnType = () => {
    if (props.preview.type == imageType) {
      return (
        <>
          <picture>
            <img src={props.preview.theSource} width="400px" height="300px" />
          </picture>
        </>
      );
    } else if (props.preview.type == videoType) {
      return (
        <>
          <video width="400px" height="300px" src={props.preview.theSource} controls></video>
        </>
      );
    } else {
      return <h3>Fohåndsvisning støttes ikke for dette filformatet.</h3>;
    }
  };

  return <>{!isLoading ? <div>{getPreviewModeBaseOnType()}</div> : <CircularProgress />}</>;
};

export default PreviewComponent;
