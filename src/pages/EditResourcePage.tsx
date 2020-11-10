import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import ResourceForm from './ResourceForm';
import LinkResource from './LinkResource';
import UploadRegistration from './UploadRegistration';

const StyledEditPublication = styled.div`
  margin-top: 2rem;
  max-width: 55rem;
`;

interface EditResourcePageParamTypes {
  identifier: string;
}

const EditResourcePage: FC = () => {
  const { identifier } = useParams<EditResourcePageParamTypes>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const { t } = useTranslation();

  const handleChange = (panel: string) => (_: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return !identifier ? (
    <>
      <PageHeader>{t('resource.new_registration')}</PageHeader>
      <StyledEditPublication>
        <LinkResource expanded={expanded === 'link-panel'} onChange={handleChange('link-panel')} />
        <div>Eller</div>
        <UploadRegistration expanded={expanded === 'load-panel'} onChange={handleChange('load-panel')} />
      </StyledEditPublication>
    </>
  ) : (
    <ResourceForm identifier={identifier} />
  );
};

export default EditResourcePage;
