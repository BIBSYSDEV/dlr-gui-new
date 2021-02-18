import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import logo from '../resources/images/unit_logo.png';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@material-ui/core';
import NormalText from '../components/NormalText';

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
  justify-self: center;
`;

const StyledPrivacyPolicyContainer = styled.div`
  grid-area: privacy;
  justify-self: end;
  padding-right: 0.5rem;
`;

const StyledMuiLink: any = styled(MuiLink)`
  display: block;
`;

const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledFooter>
      <StyledLogoContainer>
        <NormalText>{t('delivered_by')}</NormalText>
        <img src={logo} alt="UNIT logo" />
      </StyledLogoContainer>
      <StyledPrivacyPolicyContainer>
        <StyledMuiLink
          aria-label={t('privacy_policy.heading')}
          color="primary"
          component={Link}
          to="/privacy-policy"
          data-testid="privacy_policy_link">
          {t('privacy_policy.heading')}
        </StyledMuiLink>
        <StyledMuiLink aria-label={t('sitemap.sitemap')} color="primary" component={Link} to="/sitemap">
          {t('sitemap.sitemap')}
        </StyledMuiLink>
      </StyledPrivacyPolicyContainer>
    </StyledFooter>
  );
};

export default Footer;
