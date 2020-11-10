import React, { FC, useEffect, useState } from 'react';
import { Card, makeStyles, Typography, CircularProgress } from '@material-ui/core';

/*
Enkel komponent for fremstilling av informasjon 
rundt publiseringen av ressursen.
Komponenten mottar: en creator, en publiserings dato og en eier.
*/
const AuthorCard: FC<any> = (props: any) => {
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

  return (
    <>
      {!isLoading ? (
        <Card className={classes.root}>
          <Typography className={classes.title} component={'div'} gutterBottom>
            <h2> Av: {props.name} </h2>
          </Typography>
          <Typography className={classes.pos} component={'div'} color="textSecondary">
            <h5> Publisert: {props.date} </h5>
          </Typography>
          <Typography className={classes.pos} component={'div'} color="textSecondary">
            <h5>Eier: {props.mail} </h5>
          </Typography>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default AuthorCard;
