import React, { FC, useEffect, useState } from 'react';
import { Card, CircularProgress, Chip } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FormWrapper = styled.div`
  margin-left: 1rem;
  min-width: 20rem;
`;

const TitleWrapper = styled.div`
  fontsize: 14rem;
`;

const InfoWrappers = styled.div`
display: inline-block,
flaot: left,
margin-bottom: 1rem,
margin-left: 1rem,
`;

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
  const { t } = useTranslation();
  useEffect(() => {
    if (props != null) {
      setIsLoading(false);
    }
  }, [props]);

  /*
  Henter Tags fra props
  Hvis ressursen ikke har tags printes "Ingen tags"
  Hvis ressursen har tags printes hver tag i sin egen 'Chip'
  */
  const getTags = () => {
    if (props.tags.length === 0) {
      return (
        <h5>
          {t('common.none')} {t('resource.metadata.tags').toLowerCase()}
        </h5>
      );
    } else {
      return (
        <>
          <h5>{t('resource.metadata.tags')}:</h5>
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
    if (props.kategori.length === 0 || props.kategori[0] == null) {
      return (
        <h5>
          {t('common.none')} {t('resource.metadata.categories').toLowerCase()}
        </h5>
      );
    } else {
      return (
        <>
          <h5>{t('resource.metadata.categories')}:</h5>
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
        <Card>
          <FormWrapper>
            <TitleWrapper>
              <h5>
                {t('resource.metadata.type')}: {props.type}
              </h5>
            </TitleWrapper>
            <InfoWrappers>{getKategori()}</InfoWrappers>
            <InfoWrappers>{getTags()}</InfoWrappers>
          </FormWrapper>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default ResourceMetadata;
