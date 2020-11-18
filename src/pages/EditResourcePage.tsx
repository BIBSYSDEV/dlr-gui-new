import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import ResourceForm from './ResourceForm';
import LinkResource from './LinkResource';
import UploadRegistration from './UploadRegistration';
import { Typography } from '@material-ui/core';
import useUppy from '../utils/useUppy';
import { ResourceCreationType } from '../types/resource.types';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  max-width: 55rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

interface EditResourcePageParamTypes {
  identifier: string;
}

class ResourceType {}

const EditResourcePage: FC = () => {
  let { identifier } = useParams<EditResourcePageParamTypes>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const { t } = useTranslation();
  const uppy = useUppy('', false);
  const [showForm, setShowForm] = useState<boolean>(!!identifier);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onSubmitLink = (resourceIdentifier: string) => {
    setResourceType(ResourceCreationType.LINK);
    identifier = resourceIdentifier;
    setShowForm(true);
  };

  useEffect(() => {
    if (uppy) {
      uppy.on('upload', () => {
        setResourceType(ResourceCreationType.FILE);
        setShowForm(true);
      });
    }
  }, [uppy]);

  return !showForm ? (
    <>
      <PageHeader>{t('resource.new_registration')}</PageHeader>
      <StyledEditPublication>
        <UploadRegistration expanded={expanded === 'load-panel'} onChange={handleChange('load-panel')} uppy={uppy} />
        <Typography style={{ margin: '2rem 2rem' }}>{t('common.or')}</Typography>
        <LinkResource
          expanded={expanded === 'link-panel'}
          onChange={handleChange('link-panel')}
          onSubmit={onSubmitLink}
        />
      </StyledEditPublication>
    </>
  ) : (
    <>
      <ResourceForm identifier={identifier} uppy={uppy} resourceType={resourceType} />
    </>
  );
};

export default EditResourcePage;
