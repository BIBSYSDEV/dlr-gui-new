import React, { FC } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Resource } from '../../types/resource.types';
import { embed } from '../../utils/iframe_utils';
import { LMSTypes } from '../../types/lms.types';

const StyledGrid = styled(Grid)`
  margin-top: 2rem;
`;

const StyledButtons = styled(Button)`
  margin-right: 1rem;
  margin-top: 1rem;
`;

const horizontalMarks = [
  { value: 560, label: 'liten' },
  { value: 640, label: 'medium' },
  { value: 853, label: 'stor' },
];
const verticalMarks = [
  { value: 315, label: 'liten' },
  { value: 360, label: 'medium' },
  { value: 480, label: 'stor' },
];

interface BBEmbedButtonsProps {
  resource: Resource;
}

const BBEmbedButtons: FC<BBEmbedButtonsProps> = ({ resource }) => {
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
      {(bbShowEmbedButton || showCanvasEmbed || showItsLearningEmbed || showEdxEmbed) && (
        <>
          <Grid item xs={12} sm={5}>
            <Typography>Bygg inn i Blackboard</Typography>
          </Grid>
          <Grid item xs={12} sm={7}>
            {!showEdxEmbed && (
              <StyledButtons variant="outlined" color="primary" onClick={() => embed(resource, 'link', lmsPlatform)}>
                lenke
              </StyledButtons>
            )}
            <StyledButtons
              variant="outlined"
              color="primary"
              onClick={() => embed(resource, `${horizontalMarks[0].value}x${verticalMarks[0].value}`, lmsPlatform)}>
              liten
            </StyledButtons>
            <StyledButtons
              variant="outlined"
              color="primary"
              onClick={() => embed(resource, `${horizontalMarks[1].value}x${verticalMarks[1].value}`, lmsPlatform)}>
              medium
            </StyledButtons>
            <StyledButtons
              variant="outlined"
              color="primary"
              onClick={() => embed(resource, `${horizontalMarks[2].value}x${verticalMarks[2].value}`, lmsPlatform)}>
              stor
            </StyledButtons>
          </Grid>
        </>
      )}
      {showCanvasLinkEmbed && (
        <>
          <Grid item xs={12} sm={7}>
            <StyledButtons
              variant="outlined"
              color="primary"
              onClick={() => embed(resource, 'canvasShowEmbedLinkButton', lmsPlatform)}>
              Sett inn i Canvas
            </StyledButtons>
          </Grid>
        </>
      )}
    </StyledGrid>
  );
};

export default BBEmbedButtons;
