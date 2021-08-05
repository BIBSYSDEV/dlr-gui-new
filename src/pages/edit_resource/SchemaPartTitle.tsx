import React, { FC } from 'react';
import { Typography, useMediaQuery } from '@material-ui/core';
import { DeviceWidths } from '../../themes/mainTheme';
import { StyledContentWrapper, StyledSchemaPart } from '../../components/styled/Wrappers';

interface SchemaPartTitleProps {
  stepTitle: string;
  resourceTitle?: string;
}

const SchemaPartTitle: FC<SchemaPartTitleProps> = ({ stepTitle, resourceTitle }) => {
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

  if (mediumOrLargerScreen && !resourceTitle) {
    return <></>;
  } else {
    return (
      <StyledSchemaPart>
        <StyledContentWrapper>
          <Typography variant="h3" component="h2">
            {mediumOrLargerScreen && resourceTitle ? resourceTitle : stepTitle}
          </Typography>
        </StyledContentWrapper>
      </StyledSchemaPart>
    );
  }
};

export default SchemaPartTitle;
