import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  min-width: 10rem;
`;

const StyledActionContentWrapper = styled.div`
  margin-top: 1rem;
`;

interface ResourceUsageProps {
  resource: Resource;
}

const ResourceUsage: FC<ResourceUsageProps> = ({ resource }) => {
  const { t } = useTranslation();

  const handleReportButtonClick = () => {
    console.log('click');
  };

  return (
    <>
      <Typography variant="h2">{t('common.actions')}</Typography>
      <StyledActionContentWrapper>
        <StyledButton color="primary" variant="outlined" onClick={handleReportButtonClick}>
          {t('common.report').toUpperCase()}
        </StyledButton>
      </StyledActionContentWrapper>
    </>
  );
};

export default ResourceUsage;
