import React, { FC, useEffect, useState } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

//Interfaces for å motta props
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

  /*
  Metode som bestemmer visningstype basert på 
  hvilken form for data som mottas.
  Per nå støttes bare video eller bilde fremvisning.
  Brukeren får beskjed om det ressursen ikke er en av disse typene
  */
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

  return <>{!isLoading ? <div>{getPreviewModeBaseOnType()}</div> : <CircularProgress />}</>;
};

export default PreviewComponent;
