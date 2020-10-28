import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageHeader } from '../components/PageHeader';
import { CircularProgress, TextField } from '@material-ui/core';
import { getResource, getResourceDefaults, postResourceFeature } from '../api/api';
import { Resource } from '../types/resource.types';
import deepmerge from 'deepmerge';

const StyledResource = styled.div`
  width: 100%;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 20rem;
  margin: auto;
  align-items: center;
  justify-items: center;
`;

interface ResourceFormProps {
  identifier?: string;
}

const ResourceForm: FC<ResourceFormProps> = ({ identifier }) => {
  const { t } = useTranslation();
  const [resource, setResource] = useState<Resource>();
  const [isLoadingResource, setIsLoadingResource] = useState<boolean>(false);
  const [allChangesSaved, setAllChangesSaved] = useState<boolean>(false);

  const saveCalculatedFields = (_resource: Resource) => {
    if (_resource.features.dlr_title) {
      postResourceFeature(_resource.identifier, 'dlr_title', _resource.features.dlr_title);
    }
    if (_resource.features.dlr_description) {
      postResourceFeature(_resource.identifier, 'dlr_description', _resource.features.dlr_description);
    }
    if (_resource.features.dlr_type) {
      postResourceFeature(_resource.identifier, 'dlr_type', _resource.features.dlr_type);
    }
    //TODO: tags, creators
    setAllChangesSaved(true);
  };

  useEffect(() => {
    if (identifier) {
      setIsLoadingResource(true);
      getResource(identifier).then((resourceResponse) => {
        getResourceDefaults(identifier).then((responseWithCalculatedDefaults) => {
          saveCalculatedFields(responseWithCalculatedDefaults.data);
          setResource(deepmerge(resourceResponse.data, responseWithCalculatedDefaults.data));
          setIsLoadingResource(false);
        });
      });
    }
  }, [identifier]);

  // const saveField = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   if (resource) {
  //     console.log(event.target.value);
  //     await postResourceFeature(resource.identifier, event.target.name, event.target.value);
  //     setAllChangesSaved(true);
  //   }
  // };

  return (
    <>
      <PageHeader>{t('resource.edit_resource')}</PageHeader>
      {isLoadingResource ? (
        <CircularProgress />
      ) : (
        <StyledResource>
          {resource && (
            <StyledForm>
              {resource?.features.dlr_thumbnail_url && (
                <img alt="thumbnail" style={{ maxWidth: '300px' }} src={resource?.features.dlr_thumbnail_url} />
              )}
              <TextField
                // onBlur={saveField} //TODO: use formik
                fullWidth
                disabled
                label={t('resource.title')}
                variant="filled"
                value={resource?.features.dlr_title}
              />
              <TextField
                fullWidth
                disabled
                label={t('resource.description')}
                variant="filled"
                // onBlur={saveField} //TODO: use formik
                value={resource?.features.dlr_description}
              />
              <TextField
                variant="filled"
                fullWidth
                disabled
                // onBlur={saveField} //TODO: use formik
                label={t('resource.submitter')}
                value={resource?.features.dlr_submitter_email}
              />
              <div>{allChangesSaved && <span>Form saved</span>}</div>
            </StyledForm>
          )}
        </StyledResource>
      )}
    </>
  );
};

export default ResourceForm;
