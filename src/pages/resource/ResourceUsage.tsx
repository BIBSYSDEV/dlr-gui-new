import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { CompareCreators, Resource } from '../../types/resource.types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { getCitationFromCrossCite } from '../../api/resourceApi';
import styled from 'styled-components';
import { Alert, AlertTitle, Grid, Link } from '@mui/material';
import EmbedButtons from './EmbedButtons';
import ShareIcon from '@mui/icons-material/Share';
import SocialMediaSharing from '../../components/SocialMediaSharing';
import { resourcePath } from '../../utils/constants';
import { LMSParametersName } from '../../types/LMSParameters';
import ReadAccess from './ReadAccess';
import { SupportedFileTypes } from '../../types/content.types';
import { calculatePreferredWidAndHeigFromPresentationMode } from '../../utils/Preview.utils';

const StyledGridContainer = styled(Grid)`
  margin-top: 1rem;
`;

const StyledTypography = styled(Typography)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-right: 2rem;
  }
`;

const StyledCaptionWithGutterTypography = styled(Typography)`
  margin-bottom: 0.5rem;
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

const generatePreferredURL = (resource: Resource): string => {
  if (resource.features.dlr_identifier_doi) {
    return resource.features.dlr_identifier_doi;
  } else if (resource.features.dlr_identifier_handle) {
    return resource.features.dlr_identifier_handle;
  } else {
    return `${window.location.origin}${resourcePath}/${resource.identifier}`;
  }
};

const generateIframeText = (resource: Resource, presentationMode: SupportedFileTypes | undefined) => {
  const widthAndHeight = calculatePreferredWidAndHeigFromPresentationMode(presentationMode).medium;
  const isTransistorPresentation = presentationMode === SupportedFileTypes.Transistor;
  return `<iframe title="${resource.features.dlr_title.replaceAll('"', '')}" src="${
    window.location.origin
  }${resourcePath}/${resource.identifier}/content/main?${LMSParametersName.Navbar}=false&${
    LMSParametersName.Footer
  }=false&${LMSParametersName.PollForLogin}=true${isTransistorPresentation ? '&height=182px' : ''}" width="${
    widthAndHeight.width
  }" height="${widthAndHeight.height}" style="border: none;" allowfullscreen="true"></iframe>`;
};

const userAgentIsNotOperaForDesktop = () => {
  const userAgent = navigator.userAgent;
  return userAgent.match(/Android/) || !userAgent.match(/Opera|OPR\//);
};

interface ResourceUsageProps {
  resource: Resource;
  isPreview?: boolean;
  presentationMode: SupportedFileTypes | undefined;
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource, isPreview = false, presentationMode }) => {
  const { t } = useTranslation();
  const [citationPreTitle, setCitationPreTitle] = useState('');
  const [citationTitle, setCitationTitle] = useState('');
  const [citationPostTitle, setCitationPostTitle] = useState('');
  const [showCopiedLinkToClipboardInformation, setShowCopiedLinkToClipboardInformation] = useState(false);
  const mountedRef = useRef(true);

  const generateLinkSharingText = useCallback(() => {
    if (resource.features.dlr_identifier_doi) {
      return t('resource.share.share_doi');
    } else if (resource.features.dlr_identifier_handle) {
      return t('resource.share.share_handle');
    } else {
      return t('resource.share.share_link');
    }
  }, [resource.features.dlr_identifier_doi, resource.features.dlr_identifier_handle, t]);

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
    try {
      const data = { url: generatePreferredURL(resource), title: resource.features.dlr_title };
      if (userAgentIsNotOperaForDesktop()) {
        //navigator.share() works for chrome, edge and safari
        //firefox causes exception and Opera browsers crashes completely
        await navigator.share(data);
      } else {
        handleCopyButtonClick(generatePreferredURL(resource));
        setShowCopiedLinkToClipboardInformation(true);
      }
    } catch (error) {
      handleCopyButtonClick(generatePreferredURL(resource));
      setShowCopiedLinkToClipboardInformation(true);
    }
  };

  return (
    <>
      <Typography variant="h2">{t('common.usage')}</Typography>
      <StyledGridContainer container spacing={3}>
        <Grid item xs={12}>
          <ReadAccess resource={resource} />
        </Grid>
      </StyledGridContainer>
      <StyledGridContainer container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Typography variant="caption">{generateLinkSharingText()}</Typography>
          <Typography>
            {isPreview ? (
              generatePreferredURL(resource)
            ) : (
              <Link underline="hover" href={generatePreferredURL(resource)}>
                {generatePreferredURL(resource)}
              </Link>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          {!isPreview && (
            <Button startIcon={<ShareIcon />} color="primary" variant="outlined" onClick={shareLink}>
              {t('resource.share.share_link')}
            </Button>
          )}
        </Grid>
        {showCopiedLinkToClipboardInformation && (
          <Grid item xs={12}>
            <Alert severity="success" variant="outlined">
              <AlertTitle>{t('resource.share.copied_to_clipboard')}</AlertTitle>
            </Alert>
          </Grid>
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
          {!isPreview && (
            <StyledButton
              color="primary"
              variant="outlined"
              onClick={() => handleCopyButtonClick(citationPreTitle + citationTitle + citationPostTitle)}>
              {t('citation.copy_citation')}
            </StyledButton>
          )}
        </Grid>
      </StyledGridContainer>
      <StyledGridContainer container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Typography variant="caption">{t('embed.embed_code')}</Typography>

          <StyledTypography variant="body1">{generateIframeText(resource, presentationMode)}</StyledTypography>
        </Grid>
        <Grid item xs={12} sm={4}>
          {!isPreview && (
            <StyledButton
              color="primary"
              variant="outlined"
              onClick={() => handleCopyButtonClick(generateIframeText(resource, presentationMode))}>
              {t('embed.copy_embed_code')}
            </StyledButton>
          )}
        </Grid>
      </StyledGridContainer>
      {!isPreview && (
        <StyledGridContainer>
          <Grid item xs={12} sm={8}>
            <StyledCaptionWithGutterTypography variant="caption" display="block">
              {t('resource.share.share_social_medias')}
            </StyledCaptionWithGutterTypography>
            <SocialMediaSharing resourceTitle={resource.features.dlr_title} url={generatePreferredURL(resource)} />
          </Grid>
        </StyledGridContainer>
      )}
      <StyledGridContainer container spacing={3}>
        <Grid item xs={12}>
          <EmbedButtons resource={resource} />
        </Grid>
      </StyledGridContainer>
    </>
  );
};

export default ResourceUsage;
