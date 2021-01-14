import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import styled from 'styled-components';
import { Link as MuiLink, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { Colors } from '../../../themes/mainTheme';
import { ResourceWrapper } from '../../../types/resource.types';
import Thumbnail from '../../../components/Thumbnail';

const LinkWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const ThumbnailWrapper = styled.div`
  margin-top: 1rem;
  margin-right: 2rem;
  max-height: 200px;
  max-width: 200px;
`;

const LinkMetadata = styled.div`
  flex-grow: 1;
  margin-left: 2.5rem;
`;

const LinkFields = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<ResourceWrapper>();

  return (
    <StyledSchemaPartColored color={Colors.ContentsPageGradientColor1}>
      <StyledContentWrapper>
        <Typography variant="h5">{t('resource.metadata.link')}</Typography>
        <LinkWrapper>
          <ThumbnailWrapper>
            <Thumbnail resourceIdentifier={values.resource.identifier} alt={t('resource.metadata.resource')} />
          </ThumbnailWrapper>
          <LinkMetadata>
            <Typography variant="overline">{t('resource.metadata.link')}</Typography>
            <MuiLink display="block">{values.resource.features.dlr_content}</MuiLink>
          </LinkMetadata>
        </LinkWrapper>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default LinkFields;
