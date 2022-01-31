import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import siktLogo from '../resources/images/sikt_logo.png';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import NormalText from '../components/NormalText';
import { generateNewUrlAndRetainLMSParams } from '../utils/lmsService';

const StyledFooter = styled.footer`
  display: grid;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: '. logo privacy';
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: ' logo privacy';
    grid-template-columns: 1fr 1fr;
  }
  min-height: 3rem;
  align-items: center;
  border-top: 2px solid ${({ theme }) => theme.palette.separator.main};
`;

const StyledLogoContainer = styled.div`
  grid-area: logo;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0.5rem;
`;

const StyledPrivacyPolicyContainer = styled.div`
  grid-area: privacy;
  justify-self: end;
  padding-right: 0.5rem;
`;

const StyledMuiLink: any = styled(MuiLink)`
  display: block;
`;

const Footer = () => {
  const { t } = useTranslation();

  return (
    <StyledFooter>
      <StyledLogoContainer>
        <NormalText>{t('delivered_by')}</NormalText>
        <img src={siktLogo} alt="Sikt logo" />
      </StyledLogoContainer>
      <StyledPrivacyPolicyContainer>
        <StyledMuiLink
          underline="hover"
          aria-label={t('privacy_policy.heading')}
          color="primary"
          component={Link}
          to={generateNewUrlAndRetainLMSParams('/privacy-policy')}
          data-testid="privacy_policy_link">
          {t('privacy_policy.heading')}
        </StyledMuiLink>
        <StyledMuiLink
          underline="hover"
          aria-label={t('sitemap.sitemap')}
          color="primary"
          component={Link}
          to={generateNewUrlAndRetainLMSParams('/sitemap')}>
          {t('sitemap.sitemap')}
        </StyledMuiLink>
      </StyledPrivacyPolicyContainer>
    </StyledFooter>
  );
};

export default Footer;
