import React, { FC, useEffect, useState } from 'react';
import { Card, makeStyles, Typography, CircularProgress, Chip } from '@material-ui/core';

/*
Enkel komponent for å vise frem informasjon om ressursen
metoden tar imot: en type, en liste med kategorier, og en liste med tags.
Forløpig viser den frem: 
Type(video, image, osv), 
Kategorier(disse vises som et tall),
Tags(liste med tags)
*/
const ResourceMetadata: FC<any> = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (props != null) {
      //Hvis komponenten er tilsendt props sett loading til false
      setIsLoading(false);
    }
  }, []);

  const useStyles = makeStyles({
    root: {
      minWidth: 270,
    },
    listings: {
      display: 'inline - block',
      flaot: 'left',
      marginBottom: 5,
      marginLeft: 5,
    },
    pos: {
      marginLeft: 5,
    },
  });

  const classes = useStyles();

  /*
  Henter Tags fra props
  Hvis ressursen ikke har tags printes "Ingen tags"
  Hvis ressursen har tags printes hver tag i sin egen 'Chip'
  */
  const getTags = () => {
    if (props.tags.length == 0) {
      return <h5>Ingen tags</h5>;
    } else {
      return (
        <>
          <h5>Tags:</h5>
          {props.tags.map((tag: string, i: number) => {
            return (
              <span key={i}>
                <Chip color="primary" label={tag}></Chip>{' '}
              </span>
            );
          })}
        </>
      );
    }
  };

  /*
  Henter Kategorier fra props
  Hvis ressursen ikke har kategorier printes "Ingen kategorier"
  Hvis ressursen har kategorier printes hver kategori i sin egen 'Chip'
  Den første if-settningen har en ekstra sjekk da det virker som om 
  ressursen uten kategorier allikevell har ett tomt object liggende på possisjon 0
  */
  const getKategori = () => {
    if (props.kategori.length == 0 || props.kategori[0] == null) {
      return <h5>Ingen kategorier</h5>;
    } else {
      return (
        <>
          <h5>Kategorier:</h5>
          {props.kategori.map((kategori: string, i: number) => {
            return (
              <span key={i}>
                <Chip color="primary" label={kategori}></Chip>{' '}
              </span>
            );
          })}
        </>
      );
    }
  };

  return (
    <>
      {!isLoading ? (
        <Card className={classes.root}>
          <Typography className={classes.pos} component={'div'} color="textSecondary">
            <h5>Type: {props.type}</h5>
          </Typography>
          <Typography className={classes.listings} component={'div'} color="textSecondary">
            {getKategori()}
          </Typography>
          <Typography className={classes.listings} component={'div'} color="textSecondary">
            {getTags()}
          </Typography>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ResourceMetadata;
