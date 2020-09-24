import React, { FC } from 'react';
import styled from 'styled-components';

const StyledPageContent = styled.div`
  display: grid;
  justify-items: center;
`;

const ResourcePage: FC = () => {
  return (
    <StyledPageContent>
      <h1>Placeholder for Resource Page</h1>
    </StyledPageContent>
  );
};

export default ResourcePage;
