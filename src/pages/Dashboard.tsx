import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const StyledDashboard = styled.div`
  display: grid;
  grid-template-areas: 'search-bar' 'other-content';
  grid-template-rows: auto auto;
  row-gap: 1rem;
  justify-items: center;
`;

const Dashboard: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledDashboard>
      <h1>DLR</h1>
      <Link to="/resource/43892349059034">Lenke til ressurs-side</Link>
    </StyledDashboard>
  );
};

export default Dashboard;
