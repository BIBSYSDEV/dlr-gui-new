import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import ResourceForm from './ResourceForm';
import LinkResource from './LinkResource';
import UploadRegistration from './UploadRegistration';
import { Typography } from '@material-ui/core';
import { ResourceCreationType } from '../types/resource.types';
import useUppy from '../utils/useUppy';
import { toast } from 'react-toastify';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  max-width: 55rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

interface EditResourcePageParamTypes {
  resourceIdentifierFromParam: string;
}

const EditResourcePage: FC = () => {
  const { resourceIdentifierFromParam } = useParams<EditResourcePageParamTypes>();
  const [resourceIdentifier, setResourceIdentifier] = useState<string>(resourceIdentifierFromParam);
  const [expanded, setExpanded] = useState<string | false>(false);
  const { t } = useTranslation();

  const onCreateFile = (resourceIdentifierCreatedOnMainFileSelection: string) => {
    if (resourceIdentifierCreatedOnMainFileSelection) {
      setResourceIdentifier(resourceIdentifierCreatedOnMainFileSelection);
      setResourceType(ResourceCreationType.FILE);
      setShowForm(true);
    }
  };

  const onSubmitLink = (resourceIdentifier: string) => {
    setResourceType(ResourceCreationType.LINK);
    setResourceIdentifier(resourceIdentifier);
    setShowForm(true);
  };

  const mainFileHandler = useUppy('', false, onCreateFile);
  const [showForm, setShowForm] = useState<boolean>(!!resourceIdentifier);
  const [resourceType, setResourceType] = useState<ResourceCreationType>(ResourceCreationType.FILE);

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  //triggers on uppy-events
  useEffect(() => {
    if (mainFileHandler) {
      mainFileHandler.on('upload', (file, response) => {
        setResourceType(ResourceCreationType.FILE);
      });
      mainFileHandler.on('upload-error', () => {
        toast.error('File upload error');
      });
    }
  }, [mainFileHandler]);

  return !showForm ? (
    <>
      <PageHeader>{t('resource.new_registration')}</PageHeader>
      <StyledEditPublication>
        <UploadRegistration
          expanded={expanded === 'load-panel'}
          onChange={handleChange('load-panel')}
          uppy={mainFileHandler}
        />
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
      <ResourceForm identifier={resourceIdentifier} uppy={mainFileHandler} resourceType={resourceType} />
    </>
  );
};

export default EditResourcePage;
