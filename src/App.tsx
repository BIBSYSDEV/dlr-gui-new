import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.values.lg + 'px'};
  align-items: center;
  flex-grow: 1;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const App: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledApp>
      <StyledContent>
        <h1>DLR</h1>
        <p>{t('test-string')}</p>
      </StyledContent>
    </StyledApp>
  );
};

export default App;
