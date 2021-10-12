import React, { FC } from 'react';
import { SearchParameters, SearchResult } from '../../types/search.types';
import { Link, Typography } from '@mui/material';
import { getLMSSearchParams } from '../../utils/lmsService';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface NoResultProps {
  searchResult: SearchResult;
}

const StyledLink = styled(Link)`
  padding-left: 0.2rem;
`;

const NoResult: FC<NoResultProps> = ({ searchResult }) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography gutterBottom variant="body1">
        {t('dashboard.search_result_no_hits')}{' '}
      </Typography>
      {searchResult.spellcheck_suggestions.length > 0 && (
        <Typography variant="body1">
          {t('dashboard.did_you_mean')}{' '}
          {searchResult.spellcheck_suggestions.map((suggestion, index) => (
            <StyledLink
              key={`${index}-${suggestion}`}
              data-testid={`search-suggestion-${suggestion}`}
              href={`/?${SearchParameters.query}=${suggestion}${
                getLMSSearchParams().toString().length > 0 ? `&${getLMSSearchParams()}` : ''
              }`}>
              {suggestion}
            </StyledLink>
          ))}
          ?
        </Typography>
      )}
    </>
  );
};

export default NoResult;
