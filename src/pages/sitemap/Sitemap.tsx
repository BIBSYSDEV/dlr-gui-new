import React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../../components/PageHeader';
import { StyledContentWrapper } from '../../components/styled/Wrappers';
import { API_PATHS, API_URL, resourcePath } from '../../utils/constants';
import { List, ListItem } from '@mui/material';
import { handleLogout } from '../../layout/header/Logout';

const StyledTypography = styled(Typography)`
  margin-top: 2rem;
`;

interface LinkAndDescription {
  href: string;
  description: string;
  onClickFunction?: () => void;
}

const Sitemap = () => {
  const { t } = useTranslation();
  const currentUrl = encodeURIComponent(
    `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
  );

  const links: LinkAndDescription[] = [
    {
      href: `${API_URL}${API_PATHS.guiBackendLoginPath}/feideLogin?target=${currentUrl}/loginRedirect`,
      description: t('common.login'),
    },
    { href: '#', description: t('common.logout'), onClickFunction: handleLogout },
    {
      href: `${resourcePath}/user/current`,
      description: `${t('resource.my_resources')} (${t('common.must_be_logged_in').toLowerCase()})`,
    },
    { href: '/privacy-policy', description: t('privacy_policy.heading') },
    {
      href: '/registration',
      description: `${t('resource.new_registration')} (${t('common.must_be_logged_in').toLowerCase()})`,
    },
    {
      href: '/admin',
      description: `${t('administrative.page_heading')} (${t('common.must_be_logged_in').toLowerCase()})`,
    },
    {
      href: '/search-helper',
      description: `${t('search_tricks.page_title')}`,
    },
    {
      href: '/worklist',
      description: `${t('work_list.page_title')} (${t('work_list.page_requirements')})`,
    },
    {
      href: '/profile',
      description: `${t('profile.profile')} (${t('common.must_be_logged_in').toLowerCase()})`,
    },
  ].sort((a, b) => a.description.localeCompare(b.description));

  return (
    <StyledContentWrapper>
      <PageHeader>{t('sitemap.sitemap')}</PageHeader>
      <Typography variant="body1">{t('sitemap.usage_tip')}</Typography>
      <StyledTypography variant="h2">{t('sitemap.contents')}</StyledTypography>
      <nav>
        <List>
          {links.map((link, index) => (
            <ListItem key={index}>
              <Link underline="hover" href={link.href} onClick={link.onClickFunction}>
                {link.description}
              </Link>
            </ListItem>
          ))}
        </List>
      </nav>
    </StyledContentWrapper>
  );
};

export default Sitemap;
