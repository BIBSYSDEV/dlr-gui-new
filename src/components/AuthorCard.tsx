import React, { FC, useEffect, useState } from 'react';
import { Card, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const FormWrapper = styled.div`
  margin-left: 1rem;
`;

const TitleWrapper = styled.div`
  fontsize: 14rem;
`;

const InfoWrappers = styled.div`
  color: grey;
`;

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

  return (
    <>
      {!isLoading ? (
        <Card>
          <FormWrapper>
            <TitleWrapper>
              <h2> Av: {props.name} </h2>
            </TitleWrapper>
            <InfoWrappers>
              <h5> Publisert: {props.date} </h5>
            </InfoWrappers>
            <InfoWrappers>
              <h5>Eier: {props.mail} </h5>
            </InfoWrappers>
          </FormWrapper>
        </Card>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default AuthorCard;
