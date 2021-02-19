import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledMainContentLink = styled.a`
  position: absolute !important;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  width: 1px;
  height: 1px;
  color: #fff;
  display: block;
  padding: 8px;
  text-align: center;
  text-decoration: none !important;
  background-color: #1a1a18;
  outline: none;
  font-weight: 500;

  :focus,
  :active {
    position: static !important;
    overflow: visible;
    clip: auto;
    width: auto;
    height: auto;
  }
`;

const StyledImportantNavigationText = styled.span`
  z-index: 100 !important;
  outline: 3px solid #e24c5e !important;
  outline-offset: 2px !important;
  transition: none !important;
  text-decoration: none !important;
`;

const MainContentId = '#content';

const MainContentLink = () => {
  const { t } = useTranslation();

  return (
    <StyledMainContentLink href={MainContentId}>
      <StyledImportantNavigationText>{t('skip_to_main_content')}</StyledImportantNavigationText>
    </StyledMainContentLink>
  );
};

export default MainContentLink;
