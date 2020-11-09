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

const ResourceMetadata: FC<MetadataProps> = (props) => {
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
    if (props.metadata.tags == null) {
      return <p>Ingen tags</p>;
    } else {
      return (
        <>
          <h5>Tags:</h5>
          {props.metadata.tags.map((tag, i) => {
            return (
              <span>
                <Chip key={i} color="primary" label={tag}></Chip>{' '}
              </span>
            );
          })}
        </>
      );
    }
  };

  const getKategori = () => {
    if (props.metadata.kategori == null) {
      return <p>Ingen kategorier</p>;
    } else {
      return (
        <>
          <h5>Kategorier:</h5>
          {props.metadata.kategori.map((kategori, i) => {
            return (
              <span>
                <Chip color="primary" key={i} label={kategori}></Chip>{' '}
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
          <Typography className={classes.pos} color="textSecondary">
            <h5>Type: {props.metadata.type}</h5>
          </Typography>
          <Typography className={classes.listings} component={'p'} color="textSecondary">
            {getKategori()}
          </Typography>
          <Typography className={classes.listings} component={'p'} color="textSecondary">
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
