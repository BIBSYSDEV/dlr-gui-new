import React, { FC } from 'react';
import { Typography, useMediaQuery } from '@material-ui/core';
import { DeviceWidths } from '../../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPart } from '../../components/styled/Wrappers';

interface SchemaPartTitleProps {
  stepTitle: string;
}

const SchemaPartTitle: FC<SchemaPartTitleProps> = ({ stepTitle }) => {
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

  if (mediumOrLargerScreen) {
    return <></>;
  } else {
    return (
      <StyledSchemaPart>
        <StyledContentWrapper>
          <Typography variant="h3" component="h2">
            {stepTitle}
          </Typography>
        </StyledContentWrapper>
      </StyledSchemaPart>
    );
  }
};

export default SchemaPartTitle;
