import React, { FC, useEffect, useState } from 'react';
import { Card, makeStyles, Typography, CircularProgress } from '@material-ui/core';

interface Author {
  name: string;
  date: string;
  mail?: string;
}

interface AuthCardProps {
  author: Author;
}

const AuthorCard: FC<AuthCardProps> = (props) => {
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

  return (
    <>
      {isLoading ? (
        <Card className={classes.root}>
          <Typography className={classes.title} gutterBottom>
            <h2>Av: {props.author.name}</h2>
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            <h5>Publisert: {props.author.date}</h5>
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            <h5>Eier: {props.author.mail}</h5>
          </Typography>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default AuthorCard;
