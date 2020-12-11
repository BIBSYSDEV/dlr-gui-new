import React, { FC, useEffect, useState } from 'react';
import { Card, CircularProgress, Chip } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FormWrapper = styled.div`
  margin: 1rem;
  min-width: 20rem;
`;

const TitleWrapper = styled.div`
  fontsize: 14rem;
`;

const InfoWrappers = styled.div`
display: inline-block,
float: left,
margin-bottom: 1rem,
margin-left: 1rem,
`;

const ResourceMetadata: FC<any> = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  useEffect(() => {
    if (props != null) {
      setIsLoading(false);
    }
  }, [props]);

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
                <Chip color="primary" label={tag} />
              </span>
            );
          })}
        </>
      );
    }
  };

  const getCategory = () => {
    if (props.category.length === 0) {
      return (
        <h5>
          {t('common.none')} {t('resource.metadata.categories').toLowerCase()}
        </h5>
      );
    } else {
      return (
        <>
          <h5>{t('resource.metadata.categories')}:</h5>
          <span>
            <Chip color="primary" label={props.category} />
          </span>
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
            <InfoWrappers>{getCategory()}</InfoWrappers>
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
