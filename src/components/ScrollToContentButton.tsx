import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const StyledContentButton = styled(Button)`
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

const StyledNavigationText = styled.span`
  z-index: 100 !important;
  outline: 3px solid #e24c5e !important;
  outline-offset: 2px !important;
  transition: none !important;
  text-decoration: none !important;
`;

interface ScrollToContentButtonProps {
  contentRef: any;
  text: string;
}

const ScrollToContentButton: FC<ScrollToContentButtonProps> = ({ contentRef, text }) => {
  const scrollToRef = () => {
    contentRef?.current?.focus({ preventScroll: true });
    contentRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center',
    });
  };

  return (
    <StyledContentButton onClick={scrollToRef}>
      <StyledNavigationText>{text}</StyledNavigationText>
    </StyledContentButton>
  );
};

export default ScrollToContentButton;
