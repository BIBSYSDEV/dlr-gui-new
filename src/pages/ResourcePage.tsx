import React, { FC } from 'react';
import styled from 'styled-components';
import { RouteProps, useParams } from 'react-router-dom';

const StyledPageContent = styled.div`
  display: grid;
  justify-items: center;
`;

interface resourcePageParamTypes {
  identifier: string;
}

const ResourcePage: FC<RouteProps> = (props) => {
  const { identifier } = useParams<resourcePageParamTypes>();

  return (
    <StyledPageContent>
      <h1>Placeholder for Resource Page for {identifier}</h1>
    </StyledPageContent>
  );
};

export default ResourcePage;
