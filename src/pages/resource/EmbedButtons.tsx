import React, { FC, useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { Resource } from '../../types/resource.types';
import { LMSTypes } from '../../types/lms.types';
import { useTranslation } from 'react-i18next';
import { embed } from '../../utils/lmsService';
import { LMSParametersName } from '../../types/LMSParameters';
import { useLocation } from 'react-router-dom';
import { calculatePreferredWidAndHeigFromPresentationMode, DefaultContentSize } from '../../utils/Preview.utils';
import { getResourceDefaultContent } from '../../api/resourceApi';
import { determinePresentationMode } from '../../utils/mime_type_utils';

const StyledButtons = styled(Button)`
  margin-right: 1rem;
  margin-top: 1rem;
`;

interface EmbedButtonsProps {
  resource: Resource;
}

const EmbedButtons: FC<EmbedButtonsProps> = ({ resource }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bbShowEmbedButton = searchParams.get(LMSParametersName.BBShowEmbedButton) === 'true';
  const showCanvasEmbed = searchParams.get(LMSParametersName.CanvasShowEmbedButton) === 'true';
  const showItsLearningEmbed = searchParams.get(LMSParametersName.ItsLearningShowEmbedButton) === 'true';
  const showCanvasLinkEmbed = searchParams.get(LMSParametersName.CanvasShowEmbedLinkButton) === 'true';
  const showEdxEmbed = searchParams.get(LMSParametersName.EdxShowEmbedButton);
  const [embeddingSizes, setEmbeddingSizes] = useState(DefaultContentSize);
  const getLmsPlatform = (): LMSTypes => {
    if (bbShowEmbedButton) return LMSTypes.BlackBoard;
    if (showCanvasEmbed) return LMSTypes.Canvas;
    if (showEdxEmbed) return LMSTypes.Edx;
    return LMSTypes.BlackBoard;
  };
  const lmsPlatform = getLmsPlatform();

  const getEmbedDescription = (): string => {
    if (bbShowEmbedButton) return t('embed.embed_in_blackboard');
    if (showCanvasEmbed) return t('embed.embed_in_canvas');
    if (showItsLearningEmbed) return t('embed.embed_in_its_learning');
    if (showEdxEmbed) return t('embed.embed_in_edx');
    return '';
  };

  useEffect(() => {
    const fetchDefaultContent = async () => {
      try {
        const defaultContent = (await getResourceDefaultContent(resource.identifier)).data;
        const presentationMode = determinePresentationMode(defaultContent);
        setEmbeddingSizes(calculatePreferredWidAndHeigFromPresentationMode(presentationMode));
      } catch (error) {
        setEmbeddingSizes(DefaultContentSize);
      }
    };
    fetchDefaultContent().then();
  }, [resource.identifier]);

  return (
    <>
      {(bbShowEmbedButton || showCanvasEmbed || showItsLearningEmbed || showEdxEmbed || showCanvasLinkEmbed) && (
        <>
          <Typography variant="caption" data-testid="embed-typography-description">
            {getEmbedDescription()}
          </Typography>
          <Grid container spacing={3} alignItems="baseline">
            <Grid item xs={12} sm={7}>
              {!showEdxEmbed && (
                <StyledButtons
                  data-testid="embed-link-button"
                  variant="outlined"
                  color="primary"
                  onClick={() => embed(resource, 'link', lmsPlatform)}>
                  {t('embed.link')}
                </StyledButtons>
              )}
              <StyledButtons
                variant="outlined"
                color="primary"
                data-testid="embed-small-button"
                onClick={() =>
                  embed(
                    resource,
                    `${embeddingSizes.small.width}x${embeddingSizes.small.height}`,
                    lmsPlatform,
                    embeddingSizes.small.width,
                    embeddingSizes.small.height
                  )
                }>
                {t('embed.small')}
              </StyledButtons>
              <StyledButtons
                variant="outlined"
                color="primary"
                data-testid="embed-medium-button"
                onClick={() =>
                  embed(
                    resource,
                    `${embeddingSizes.medium.width}x${embeddingSizes.medium.height}`,
                    lmsPlatform,
                    embeddingSizes.medium.width,
                    embeddingSizes.medium.height
                  )
                }>
                {t('embed.medium')}
              </StyledButtons>
              <StyledButtons
                variant="outlined"
                color="primary"
                data-testid="embed-large-button"
                onClick={() =>
                  embed(
                    resource,
                    `${embeddingSizes.medium.width}x${embeddingSizes.medium.height}`,
                    lmsPlatform,
                    embeddingSizes.medium.width,
                    embeddingSizes.medium.height
                  )
                }>
                {t('embed.large')}
              </StyledButtons>
            </Grid>

            {showCanvasLinkEmbed && (
              <>
                <Grid item xs={12} sm={7}>
                  <StyledButtons
                    variant="outlined"
                    data-testid="embed-canvas-link"
                    color="primary"
                    onClick={() => embed(resource, 'canvasShowEmbedLinkButton', lmsPlatform)}>
                    {t('embed.insert_into_canvas')}
                  </StyledButtons>
                </Grid>
              </>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default EmbedButtons;
