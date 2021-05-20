import React, { FC } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Resource } from '../../types/resource.types';
import { LMSTypes } from '../../types/lms.types';
import { useTranslation } from 'react-i18next';
import { embed } from '../../utils/lmsService';
import { LMSParametersName } from '../../types/LMSParameters';

const StyledGrid = styled(Grid)`
  margin-top: 2rem;
`;

const StyledButtons = styled(Button)`
  margin-right: 1rem;
  margin-top: 1rem;
`;

const small = {
  horizontal: 560,
  vertical: 315,
};

const medium = {
  horizontal: 640,
  vertical: 360,
};

const large = {
  horizontal: 853,
  vertical: 480,
};

interface EmbedButtonsProps {
  resource: Resource;
}

const EmbedButtons: FC<EmbedButtonsProps> = ({ resource }) => {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  const bbShowEmbedButton = searchParams.get(LMSParametersName.BBShowEmbedButton) === 'true';
  const showCanvasEmbed = searchParams.get(LMSParametersName.CanvasShowEmbedButton) === 'true';
  const showItsLearningEmbed = searchParams.get(LMSParametersName.ItsLearningShowEmbedButton) === 'true';
  const showCanvasLinkEmbed = searchParams.get(LMSParametersName.CanvasShowEmbedLinkButton) === 'true';
  const showEdxEmbed = searchParams.get(LMSParametersName.EdxShowEmbedButton);
  const getLmsPlatform = (): LMSTypes => {
    if (bbShowEmbedButton) return LMSTypes.BlackBoard;
    if (showCanvasEmbed) return LMSTypes.Canvas;
    if (showEdxEmbed) return LMSTypes.Edx;
    return LMSTypes.BlackBoard;
  };
  const lmsPlatform = getLmsPlatform();

  return (
    <StyledGrid container spacing={2} alignItems="baseline">
      <Grid item xs={12} sm={5}>
        {bbShowEmbedButton && (
          <Typography data-testid="embed-typography-description"> {t('embed.embed_in_blackboard')} </Typography>
        )}
        {showCanvasEmbed && (
          <Typography data-testid="embed-typography-description"> {t('embed.embed_in_canvas')} </Typography>
        )}
        {showItsLearningEmbed && (
          <Typography data-testid="embed-typography-description"> {t('embed.embed_in_its_learning')} </Typography>
        )}
        {showEdxEmbed && (
          <Typography data-testid="embed-typography-description"> {t('embed.embed_in_edx')} </Typography>
        )}
      </Grid>
      {(bbShowEmbedButton || showCanvasEmbed || showItsLearningEmbed || showEdxEmbed) && (
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
              embed(resource, `${small.horizontal}x${small.vertical}`, lmsPlatform, small.horizontal, small.vertical)
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
                `${medium.horizontal}x${medium.vertical}`,
                lmsPlatform,
                medium.horizontal,
                medium.vertical
              )
            }>
            {t('embed.medium')}
          </StyledButtons>
          <StyledButtons
            variant="outlined"
            color="primary"
            data-testid="embed-large-button"
            onClick={() =>
              embed(resource, `${large.horizontal}x${large.vertical}`, lmsPlatform, large.horizontal, large.vertical)
            }>
            {t('embed.large')}
          </StyledButtons>
        </Grid>
      )}
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
    </StyledGrid>
  );
};

export default EmbedButtons;
