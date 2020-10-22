import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const StyledBreadcrumbs = styled.div`
  grid-area: breadcrumbs;
  padding: 0.5rem;

  a {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

const Breadcrumbs: FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const pathNames = pathname.split('/').filter((x) => x);

  return (
    <>
      {pathNames.length > 0 && (
        <StyledBreadcrumbs>
          <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink component={Link} to="/">
              {t('breadcrumbs.home')}
            </MuiLink>
            {pathNames.map((pathName: string, index: number) => {
              const isId = pathName.match(
                '[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}'
              );
              const translatedValue = isId ? isId : t(`breadcrumbs.${pathName}`);
              const lastBreadcrumb = index === pathNames.length - 1;
              const to = `/${pathNames.slice(0, index + 1).join('/')}`;
              return lastBreadcrumb ? (
                <b key={to}>{translatedValue}</b>
              ) : (
                <MuiLink component={Link} to={to} key={to}>
                  {translatedValue}
                </MuiLink>
              );
            })}
          </MuiBreadcrumbs>
        </StyledBreadcrumbs>
      )}
    </>
  );
};

export default Breadcrumbs;
