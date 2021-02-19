import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';

const StyledMainContentButton = styled(Button)`
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

interface ScrollToMainContentButtonProps {
  mainContentRef: any;
}

const ScrollToMainContentButton: FC<ScrollToMainContentButtonProps> = ({ mainContentRef }) => {
  const { t } = useTranslation();

  const scrollToRef = () => {
    mainContentRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center',
    });
  };

  return (
    <StyledMainContentButton onClick={scrollToRef}>
      <StyledImportantNavigationText>{t('skip_to_main_content')}</StyledImportantNavigationText>
    </StyledMainContentButton>
  );
};

export default ScrollToMainContentButton;
