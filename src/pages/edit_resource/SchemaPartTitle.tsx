import React, { FC } from 'react';
import { Typography, useMediaQuery } from '@material-ui/core';
import { DeviceWidths } from '../../themes/mainTheme';
import { StyledContentWrapper } from '../../components/styled/Wrappers';
import styled from 'styled-components';

const StyledSchemaPartLessPadding = styled.div`
  padding-bottom: 2rem;
  padding-top: 1rem;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    padding-left: 0;
  }
`;

const StyledTypography: any = styled(Typography)`
  font-weight: 600;
`;

interface SchemaPartTitleProps {
  stepTitle: string;
  error?: boolean;
}

const SchemaPartTitle: FC<SchemaPartTitleProps> = ({ stepTitle, error = false }) => {
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

  if (mediumOrLargerScreen) {
    return <></>;
  } else {
    return (
      <StyledSchemaPartLessPadding>
        <StyledContentWrapper>
          {!error ? (
            <StyledTypography color="primary" variant="h3" component="h2">
              {stepTitle}
            </StyledTypography>
          ) : (
            <StyledTypography color="secondary" variant="h3" component="h2">
              {stepTitle}
            </StyledTypography>
          )}
        </StyledContentWrapper>
      </StyledSchemaPartLessPadding>
    );
  }
};

export default SchemaPartTitle;
