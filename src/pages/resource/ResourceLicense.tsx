import React, { FC } from 'react';
import { Resource } from '../../types/resource.types';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { StyledFeatureWrapper } from '../../components/styled/Wrappers';
import LicenseCard2 from '../../components/LicenseCard2';

interface ResourceLicenseProps {
  resource: Resource;
}

const ResourceLicense: FC<ResourceLicenseProps> = ({ resource }) => {
  const { t } = useTranslation();

  return (
    <>
      {resource.licenses && resource.licenses.length !== 0 && resource.licenses[0].identifier.length > 0 && (
        <StyledFeatureWrapper data-testid="resource-license">
          <Typography gutterBottom variant="h2">
            {t('resource.metadata.license')}
          </Typography>
          {resource.licenses.map(
            (license) => license.identifier && <LicenseCard2 license={license} key={license.identifier} />
          )}
        </StyledFeatureWrapper>
      )}
    </>
  );
};

export default ResourceLicense;
