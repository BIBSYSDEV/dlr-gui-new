import React, { FC, useEffect, useRef, useState } from 'react';
import { Resource } from '../../types/resource.types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import { TFunction, useTranslation } from 'react-i18next';
import { getCitationFromCrossCite } from '../../api/resourceApi';
import styled from 'styled-components';

const StyledTextAndButtonWrapper = styled.div`
  display: block;
  margin-top: 2rem;
`;

const StyledInformationWrapper = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 1 + 'px'}) {
    display: block;
  }
`;

const StyledTypography = styled(Typography)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-right: 2rem;
  }
`;

const generateCitationStringFromResourceMetadata = (resource: Resource, t: TFunction<'translation'>): string => {
  let citation = resource.creators
    .sort((creatorA, creatorB) => {
      if (creatorA.features.dlr_creator_order && creatorB.features.dlr_creator_order) {
        return creatorA.features.dlr_creator_order - creatorB.features.dlr_creator_order;
      }
      return 0;
    })
    .map((creator) => creator.features.dlr_creator_name)
    .join(', ');
  if (resource.features.dlr_time_published) {
    citation += `. ${format(new Date(resource.features.dlr_time_published), 'dd.MM.yyyy')}`;
  }

  citation += `. ${resource.features.dlr_title}`;
  if (resource.features.dlr_identifier_doi) {
    citation += `. ${t('citation.retrieved_from')} ${resource.features.dlr_identifier_doi}`;
  } else if (resource.features.dlr_identifier_handle) {
    citation += `. ${t('citation.retrieved_from')} ${resource.features.dlr_identifier_handle}`;
  }
  return citation;
};

interface ResourceUsageProps {
  resource: Resource;
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource }) => {
  const { t } = useTranslation();
  const [citation, setCitation] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    const getCitation = async () => {
      const newCitation = generateCitationStringFromResourceMetadata(resource, t);
      try {
        if (resource.features.dlr_identifier_doi) {
          const citationResponse = await getCitationFromCrossCite(resource.features.dlr_identifier_doi);
          if (!mountedRef.current) return null;
          if (citationResponse.data.text) {
            setCitation(citationResponse.data.text);
          }
        } else {
          setCitation(newCitation);
        }
      } catch (_error) {
        setCitation(newCitation);
      }
    };
    getCitation();
  }, [resource, t]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(citation);
  };

  return (
    <>
      <StyledTextAndButtonWrapper>
        <Typography variant="caption">{t('citation.citation_link')}</Typography>
        <StyledInformationWrapper>
          <StyledTypography variant="body1">{citation}</StyledTypography>
          <Button color="primary" variant="outlined" onClick={() => handleCopyButtonClick()}>
            {t('citation.copy_citation').toUpperCase()}
          </Button>
        </StyledInformationWrapper>
      </StyledTextAndButtonWrapper>
    </>
  );
};

export default ResourceUsage;
