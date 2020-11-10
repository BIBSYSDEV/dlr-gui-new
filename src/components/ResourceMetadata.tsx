import React, { FC, useEffect, useState } from 'react';
import { Card, makeStyles, Typography, CircularProgress, Fab, Chip } from '@material-ui/core';

interface Metadata {
  type: string;
  kategori?: string[];
  tags?: string[];
}

interface MetadataProps {
  metadata: Metadata;
}

const ResourceMetadata: FC<any> = (props: any) => {
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
      {isLoading ? (
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
