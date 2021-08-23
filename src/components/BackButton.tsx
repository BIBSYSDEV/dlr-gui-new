import React from 'react';
import { Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledBackButtonWrapper = styled.div`
  width: 100%;
`;

const BackButton = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const backHref = (location.pathname.includes('/editresource') ? '/resources/user/current' : '/') + location.search;

  return (
    <>
      {location.pathname === '/' || location.pathname.includes('/content/main') ? (
        <></>
      ) : (
        <>
          <StyledBackButtonWrapper>
            <Button data-testid="navigation-back-button" href={backHref} color="primary" variant="outlined">
              {backHref.includes('/resources/user/current')
                ? t('resource.my_resources')
                : t('search_tricks.search_for_resource')}
            </Button>
          </StyledBackButtonWrapper>
        </>
      )}
    </>
  );
};

export default BackButton;
