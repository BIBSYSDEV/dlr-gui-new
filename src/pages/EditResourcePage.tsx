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

const EditResourcePage: FC = () => {
  const { identifier } = useParams<EditResourcePageParamTypes>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const { t } = useTranslation();
  const uppy = useUppy('', false);
  const [showForm, setShowForm] = useState<boolean>(!!identifier);

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (uppy) {
      uppy.on('upload', () => {
        setShowForm(true);
      });
    }
  }, [uppy]);

  return !showForm ? (
    <>
      <PageHeader>{t('resource.new_registration')}</PageHeader>
      <StyledEditPublication>
        <LinkResource expanded={expanded === 'link-panel'} onChange={handleChange('link-panel')} />
        <Typography style={{ margin: '2rem 2rem' }}>{t('common.or')}</Typography>
        <UploadRegistration expanded={expanded === 'load-panel'} onChange={handleChange('load-panel')} uppy={uppy} />
      </StyledEditPublication>
    </>
  ) : (
    <>
      <ResourceForm identifier={identifier} uppy={uppy} />
    </>
  );
};

export default EditResourcePage;
