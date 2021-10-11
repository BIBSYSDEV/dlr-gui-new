import React, { FC } from 'react';
import { SearchParameters, SearchResult } from '../../types/search.types';
import { Link, Typography } from '@material-ui/core';
import { getLMSSearchParams } from '../../utils/lmsService';
import { useTranslation } from 'react-i18next';

interface NoResultProps {
  searchResult: SearchResult;
}

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
          {searchResult.spellcheck_suggestions.map((suggestion) => (
            <>
              <Link
                data-testid={'search-suggestions'}
                href={`/?${SearchParameters.query}=${suggestion}${
                  getLMSSearchParams().toString().length > 0 ? `&${getLMSSearchParams()}` : ''
                }`}>
                {suggestion}
              </Link>{' '}
            </>
          ))}
          ?
        </Typography>
      )}
    </>
  );
};

export default NoResult;
