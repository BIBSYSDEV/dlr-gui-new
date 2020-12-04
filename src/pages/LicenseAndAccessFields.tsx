import React, { FC } from 'react';
import { StyledContentWrapper, StyledSchemaPartColored } from '../components/styled/Wrappers';
import { Colors } from '../themes/mainTheme';

const LicenseAndAccessFields: FC = () => {
  return (
    <StyledSchemaPartColored color={Colors.LicenseAccessPageGradientColor1}>
      <StyledContentWrapper></StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LicenseAndAccessFields;
