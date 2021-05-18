import React, { useState } from 'react';
import { Button, Slider, Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledVerticalSlider = styled(Slider)`
  min-height: 10rem;
  margin-right: 10rem;
`;
const StyledHorizontalSlider = styled(Slider)`
  max-width: 20rem;
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

const BBEmbedButtons = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const bbShowEmbedButton = searchParams.get('bbShowEmbedButton') === 'true';
  const [verticalSize, setVerticalSize] = useState(360);
  const [horizontalSize, setHorizontalSize] = useState(640);

  const handleChangeInVerticalSlider = (event: any, newValue: number | number[]) => {
    setVerticalSize(newValue as number);
  };
  const handleChangeInHorizontalSlider = (event: any, newValue: number | number[]) => {
    setHorizontalSize(newValue as number);
  };

  const verticalValueText = (value: number) => {
    return `${value} px`;
  };
  return (
    <>
      <p>Embed del</p>
      {bbShowEmbedButton && (
        <>
          <Typography id="vertical-slider" gutterBottom>
            Høyde
          </Typography>
          <StyledVerticalSlider
            valueLabelDisplay="auto"
            onChange={handleChangeInVerticalSlider}
            min={300}
            max={500}
            step={5}
            defaultValue={360}
            getAriaValueText={verticalValueText}
            orientation="vertical"
            aria-labelledby="vertical-slider"
            marks={verticalMarks}
          />
          <StyledHorizontalSlider
            valueLabelDisplay="auto"
            onChange={handleChangeInHorizontalSlider}
            min={450}
            max={1000}
            step={5}
            defaultValue={640}
            aria-labelledby="horizontal-slider"
            marks={horizontalMarks}
          />
          <Typography id="horizontal-slider" gutterBottom>
            Bredde
          </Typography>
          <Typography>{`${horizontalSize} px * ${verticalSize} px`}</Typography>
          <Button variant="contained">Embed</Button>
        </>
      )}
    </>
  );
};

export default BBEmbedButtons;
