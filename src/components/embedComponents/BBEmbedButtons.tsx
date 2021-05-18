import React, { FC, useState } from 'react';
import { Button, Slider, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Resource } from '../../types/resource.types';
import { FRONTEND_URL } from '../../utils/constants';

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

interface BBEmbedButtonsProps {
  resource: Resource;
}

const BBEmbedButtons: FC<BBEmbedButtonsProps> = ({ resource }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const bbShowEmbedButton = searchParams.get('bbShowEmbedButton') === 'true';
  const [verticalSize, setVerticalSize] = useState(360);
  const [horizontalSize, setHorizontalSize] = useState(640);
  const [showCustomSliders, setShowCustomSliders] = useState(false);

  const handleChangeInVerticalSlider = (event: any, newValue: number | number[]) => {
    setVerticalSize(newValue as number);
  };
  const handleChangeInHorizontalSlider = (event: any, newValue: number | number[]) => {
    setHorizontalSize(newValue as number);
  };

  const verticalValueText = (value: number) => {
    return `${value} px`;
  };

  const embed = (mode: string) => {
    const data = {
      id: resource.identifier,
      title: resource.features.dlr_title,
      handle: resource.features.dlr_identifier_handle,
      mode,
      embedCode: `<iframe src="${FRONTEND_URL}/content/${resource.identifier}?width={width}&height={height}&showLicense={showLicense}&showNewVersion={showNewVersion}" style="border: none;" width="{iframeWidth}" height="{iframeHeight}" mozallowfullscreen="true" webkitallowfullscreen="true" allowfullscreen="true" ></iframe>`,
    };
    window.parent.postMessage(data, '*');
  };
  return (
    <>
      <p>Embed del</p>
      {bbShowEmbedButton && (
        <>
          <Typography>Sett inn i Blackboard</Typography>
          <Button variant="outlined" color="primary" onClick={() => embed('link')}>
            Sett inn lenke
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => embed(`${horizontalMarks[0].value}x${verticalMarks[0].value}`)}>
            Sett inn liten
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => embed(`${horizontalMarks[1].value}x${verticalMarks[1].value}`)}>
            Sett inn medium
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => embed(`${horizontalMarks[2].value}x${verticalMarks[2].value}`)}>
            Sett inn stor
          </Button>
          <Button
            onClick={() => {
              if (showCustomSliders) {
                setVerticalSize(360);
                setHorizontalSize(640);
              }
              setShowCustomSliders((prevState) => !prevState);
            }}
            variant="outlined"
            color="primary">
            {!showCustomSliders ? 'Velg egendefinert størrelse' : 'Skjul egendefinerte størrelser'}
          </Button>
          {showCustomSliders && (
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
              <Button variant="contained" color="primary" onClick={() => embed(`${horizontalSize}x${verticalSize}`)}>
                Sett inn egendefinert størrelse
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default BBEmbedButtons;
