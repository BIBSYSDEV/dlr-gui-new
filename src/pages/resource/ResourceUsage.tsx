import React, { FC, useEffect, useRef, useState } from 'react';
import { CompareCreators, Resource } from '../../types/resource.types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import { TFunction, useTranslation } from 'react-i18next';
import { getCitationFromCrossCite } from '../../api/resourceApi';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';

const StyledGridContainer = styled(Grid)`
  margin-top: 1rem;
`;

const StyledTypography = styled(Typography)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-right: 2rem;
  }
`;

const StyledButton = styled(Button)`
  min-width: 12rem;
`;

const generateCitationStringPreTitle = (resource: Resource): string => {
  let citation = resource.creators
    .sort((creatorA, creatorB) => CompareCreators(creatorA, creatorB))
    .map((creator) => creator.features.dlr_creator_name)
    .join(', ');
  if (resource.features.dlr_time_published) {
    citation += `. (${format(new Date(resource.features.dlr_time_published), 'yyyy')}).`;
  }
  return citation;
};

const generateCitationStringPostTitle = (resource: Resource, t: TFunction<'translation'>): string => {
  if (resource.features.dlr_identifier_doi) {
    return `. ${t('citation.retrieved_from')} ${resource.features.dlr_identifier_doi}`;
  } else if (resource.features.dlr_identifier_handle) {
    return `. ${t('citation.retrieved_from')} ${resource.features.dlr_identifier_handle}`;
  } else {
    return '';
  }
};

interface ResourceUsageProps {
  resource: Resource;
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [citationPreTitle, setCitationPreTitle] = useState('');
  const [citationTitle, setCitationTitle] = useState('');
  const [citationPostTitle, setCitationPostTitle] = useState('');
  const mountedRef = useRef(true);

  const iframeText = `<iframe title="${resource.features.dlr_title}" src="${window.location.origin}/resource/${resource.identifier}/content/main?navbar=false&footer=false" width="640px" height="360px" style="border: none;" allowfullscreen="true"></iframe>`;

  useEffect(() => {
    const getCitation = async () => {
      const newCitationPreTitle = generateCitationStringPreTitle(resource);
      const newCitationPostTitle = generateCitationStringPostTitle(resource, t);
      try {
        if (resource.features.dlr_identifier_doi) {
          const citationResponse = await getCitationFromCrossCite(resource.features.dlr_identifier_doi);
          if (!mountedRef.current) return null;
          if (citationResponse.data) {
            const splitCitation = citationResponse.data.split(/(<i>|<\/i>)+/);
            if (splitCitation.length === 5) {
              setCitationPreTitle(splitCitation[0]);
              setCitationTitle(splitCitation[2]);
              setCitationPostTitle(splitCitation[4]);
            } else {
              setCitationPreTitle(citationResponse.data);
              setCitationTitle(' ' + resource.features.dlr_title);
            }
          }
        } else {
          setCitationPreTitle(newCitationPreTitle);
          setCitationTitle(' ' + resource.features.dlr_title);
          setCitationPostTitle(newCitationPostTitle);
        }
      } catch (_error) {
        setCitationPreTitle(newCitationPreTitle);
        setCitationTitle(' ' + resource.features.dlr_title);
        setCitationPostTitle(newCitationPostTitle);
      }
    };
    getCitation();
  }, [resource, t]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleCopyButtonClick = (text: string) => {
    try {
      //requires HTTPS connection or localhost in order to work.
      navigator.clipboard.writeText(text);
    } catch (_error) {
      //Hacky workaround in case of no HTTPS connection
      const textField = document.createElement('textarea');
      textField.innerText = text;
      document.body.appendChild(textField);
      textField.select();
      //execCommand is deprecated but copy command is still widely supported
      document.execCommand('copy');
      textField.remove();
    }
  };

  return (
    <StyledGridContainer container spacing={3}>
      <Grid item xs={12} sm={8}>
        <Typography variant="caption">{t('citation.citation_link')}</Typography>
        <StyledTypography variant="body1">
          {citationPreTitle}
          <i>{citationTitle}</i>
          {citationPostTitle}
        </StyledTypography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <StyledButton
          color="primary"
          variant="outlined"
          onClick={() => handleCopyButtonClick(citationPreTitle + citationTitle + citationPostTitle)}>
          {t('citation.copy_citation').toUpperCase()}
        </StyledButton>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="caption">{t('embed.embed_code')}</Typography>

        <StyledTypography variant="body1">{iframeText}</StyledTypography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <StyledButton color="primary" variant="outlined" onClick={() => handleCopyButtonClick(iframeText)}>
          {t('embed.copy_embed_code').toUpperCase()}
        </StyledButton>
      </Grid>
    </StyledGridContainer>
  );
};

export default ResourceUsage;
