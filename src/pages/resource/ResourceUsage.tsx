import React, { FC, useEffect, useRef, useState } from 'react';
import { CompareCreators, Resource } from '../../types/resource.types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import { TFunction, useTranslation } from 'react-i18next';
import { getCitationFromCrossCite } from '../../api/resourceApi';
import styled from 'styled-components';
import { Grid, Link } from '@material-ui/core';
import EmbedButtons from './EmbedButtons';
import { Alert, AlertTitle } from '@material-ui/lab';
import ShareIcon from '@material-ui/icons/Share';
import SocialMediaSharing from '../../components/SocialMediaSharing';

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
  const [showCopiedLinkToClipboardInformation, setShowCopiedLinkToClipboardInformation] = useState(false);
  const mountedRef = useRef(true);

  const generatePreferredURL = (): string => {
    if (resource.features.dlr_identifier_doi) {
      return resource.features.dlr_identifier_doi;
    } else if (resource.features.dlr_identifier_handle) {
      return resource.features.dlr_identifier_handle;
    } else {
      return `${window.location.origin}/resource/${resource.identifier}`;
    }
  };

  const generateLinkSharingText = (): string => {
    if (resource.features.dlr_identifier_doi) {
      return t('resource.share.share_doi');
    } else if (resource.features.dlr_identifier_handle) {
      return t('resource.share.share_handle');
    } else {
      return t('resource.share.share_link');
    }
  };

  const iframeText = `<iframe title="${resource.features.dlr_title.replaceAll('"', '')}" src="${
    window.location.origin
  }/resource/${
    resource.identifier
  }/content/main?navbar=false&footer=false" width="640px" height="360px" style="border: none;" allowfullscreen="true"></iframe>`;

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

  const shareLink = async () => {
    setShowCopiedLinkToClipboardInformation(false);
    if (resource.features.dlr_identifier_handle) {
      try {
        const data = { url: generatePreferredURL(), title: resource.features.dlr_title };
        const userAgent = navigator.userAgent;
        if (userAgent.match(/Android/) || !userAgent.match(/Opera|OPR\//)) {
          //navigator.share() works for chrome, edge and safari
          //firefox causes exception and Opera browsers crashes completely
          await navigator.share(data);
        } else {
          handleCopyButtonClick(generatePreferredURL());
          setShowCopiedLinkToClipboardInformation(true);
        }
      } catch (error) {
        handleCopyButtonClick(generatePreferredURL());
        setShowCopiedLinkToClipboardInformation(true);
      }
    }
  };

  return (
    <>
      <Typography variant="h2">{t('common.usage')}</Typography>
      <StyledGridContainer container spacing={3}>
        {resource.features.dlr_identifier_handle && (
          <>
            <Grid item xs={12} sm={8}>
              <Typography variant="caption">{generateLinkSharingText()}</Typography>
              <Typography>
                <Link href={generatePreferredURL()}>{generatePreferredURL()}</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button startIcon={<ShareIcon />} color="primary" variant="outlined" onClick={shareLink}>
                {t('resource.share.share_link').toUpperCase()}
              </Button>
            </Grid>
            {showCopiedLinkToClipboardInformation && (
              <Grid item xs={12}>
                <Alert severity="success" variant="filled">
                  <AlertTitle>{t('resource.share.copied_to_clipboard')}</AlertTitle>
                </Alert>
              </Grid>
            )}
          </>
        )}

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
      </StyledGridContainer>
      <StyledGridContainer container spacing={3}>
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
      <StyledGridContainer>
        <Grid item xs={12} sm={8}>
          <Typography variant="caption" gutterBottom>
            {t('resource.share.share_social_medias')}
          </Typography>
          <SocialMediaSharing resourceTitle={resource.features.dlr_title} url={generatePreferredURL()} />
        </Grid>
      </StyledGridContainer>
      <StyledGridContainer container spacing={3}>
        <Grid item xs={12}>
          <EmbedButtons resource={resource} />
        </Grid>
      </StyledGridContainer>
    </>
  );
};

export default ResourceUsage;
