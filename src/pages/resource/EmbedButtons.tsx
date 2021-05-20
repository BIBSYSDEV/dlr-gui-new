import React, { FC } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Resource } from '../../types/resource.types';
import { LMSTypes } from '../../types/lms.types';
import { useTranslation } from 'react-i18next';
import { embed } from '../../utils/lmsService';

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
  const bbShowEmbedButton = searchParams.get('bbShowEmbedButton') === 'true';
  const showCanvasEmbed = searchParams.get('canvasShowEmbedButton');
  const showItsLearningEmbed = searchParams.get('itsLearningShowEmbedButton') === 'true';
  const showCanvasLinkEmbed = searchParams.get('canvasShowEmbedLinkButton') === 'true';
  const showEdxEmbed = searchParams.get('edxShowEmbedButton');
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
        <Typography>
          {bbShowEmbedButton && t('embed.embed_in_blackboard')}
          {showCanvasEmbed && t('embed.embed_in_canvas')}
          {showItsLearningEmbed && t('embed.embed_in_its_learning')}
          {showEdxEmbed && t('embed.embed_in_edx')}
        </Typography>
      </Grid>
      {(bbShowEmbedButton || showCanvasEmbed || showItsLearningEmbed || showEdxEmbed) && (
        <Grid item xs={12} sm={7}>
          {!showEdxEmbed && (
            <StyledButtons variant="outlined" color="primary" onClick={() => embed(resource, 'link', lmsPlatform)}>
              {t('embed.link')}
            </StyledButtons>
          )}
          <StyledButtons
            variant="outlined"
            color="primary"
            onClick={() =>
              embed(resource, `${small.horizontal}x${small.vertical}`, lmsPlatform, small.horizontal, small.vertical)
            }>
            {t('embed.small')}
          </StyledButtons>
          <StyledButtons
            variant="outlined"
            color="primary"
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
