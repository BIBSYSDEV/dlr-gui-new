import React, { FC } from 'react';
import { Resource } from '../types/resource.types';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PreviewComponent from '../components/PreviewComponent';
import { useTranslation } from 'react-i18next';
import { Preview } from './ResourcePage';
import styled from 'styled-components';
import { StyledContentWrapper } from '../components/styled/Wrappers';

interface ResourcePresentationProps {
  resource: Resource;
  preview: Preview;
}

const StyledPresentationWrapper = styled(StyledContentWrapper)`
  display: flex;
  flex-direction: column;
`;

const ResourcePresentation: FC<ResourcePresentationProps> = ({ resource, preview }) => {
  const { t } = useTranslation();

  return (
    resource && (
      <StyledPresentationWrapper>
        <Typography variant="h1">{resource?.features?.dlr_title}</Typography>
        {preview.url !== '' && <>{preview && <PreviewComponent preview={preview} />}</>}

        {resource.creators && resource.creators.length !== 0 && (
          <List>
            {resource.creators.map((creator) => {
              return (
                <ListItem key={creator.identifier}>
                  <ListItemText>
                    {t('resource.metadata.creator')}: {creator.features.dlr_creator_name}
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        )}

        {resource.features.dlr_time_published && (
          <Typography variant="body2">
            {t('resource.metadata.published')}: {resource.features.dlr_time_published}
          </Typography>
        )}
        {resource.features.dlr_time_created && (
          <Typography variant="body2">
            {t('resource.metadata.created')}: {resource.features.dlr_time_created}
          </Typography>
        )}
        {resource.features.dlr_submitter_email && (
          <Typography variant="body2">
            {t('resource.metadata.owner')}: {resource.features.dlr_submitter_email}
          </Typography>
        )}
        {resource.features.dlr_description && (
          <Typography variant="body2">{resource.features.dlr_description}</Typography>
        )}

        {resource.contributors &&
          resource.contributors.length !== 0 &&
          resource.contributors.map((contributor) => {
            return (
              <div key={contributor.features.dlr_contributor_identifier}>
                <Typography>{contributor.features.dlr_contributor_name}</Typography>
                <Typography>{contributor.features.dlr_contributor_type}</Typography>
              </div>
            );
          })}
        {/*<ResourceMetadata*/}
        {/*  type={preview.type}*/}
        {/*  category={resource?.features.dlr_subject_nsi_id ? resource.features.dlr_subject_nsi_id : ''}*/}
        {/*  tags={resource.tags}*/}
        {/*/>*/}
        {/*{resource.licenses && resource.licenses.length !== 0 &&*/}
        {/*resource.licenses.map((license) => {*/}
        {/*  return <LicenseCard key={license.identifier} license={license} />;*/}
        {/*});*/}
        {/*}*/}
      </StyledPresentationWrapper>
    )
  );
};

export default ResourcePresentation;
