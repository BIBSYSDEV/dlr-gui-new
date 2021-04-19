import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { QueryObject } from '../../types/search.types';
import { DefaultResourceTypes } from '../../types/resource.types';
import { TFunction, useTranslation } from 'react-i18next';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const StyledFormControl: any = styled(FormControl)`
  margin-top: 2rem;
`;

interface ResourceTypeListItem {
  name: string;
  isSelected: boolean;
}

const initialResourceTypeCheckList = (t: TFunction<'translation'>): ResourceTypeListItem[] => {
  return DefaultResourceTypes.map<ResourceTypeListItem>((resourceType) => ({
    name: t(resourceType),
    isSelected: false,
  }));
};

interface ResourceTypeFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
  setQueryFromURL: Dispatch<SetStateAction<boolean>>;
  queryFromURL: boolean;
}

const ResourceTypeFiltering: FC<ResourceTypeFilteringProps> = ({
  queryObject,
  setQueryObject,
  setQueryFromURL,
  queryFromURL,
}) => {
  const { t } = useTranslation();

  const [resourceTypeCheckList, setResourceCheckList] = useState(initialResourceTypeCheckList(t));

  useEffect(() => {
    if (queryObject.resourceTypes.length > 0) {
      const nextState = DefaultResourceTypes.map((resourceType) => ({
        name: resourceType,
        isSelected: !!queryObject.resourceTypes.find((type) => type === resourceType),
      }));
      setResourceCheckList(nextState);
    } else {
      setResourceCheckList(initialResourceTypeCheckList(t));
    }
  }, [queryObject, t]);

  const changeSelected = (index: number, event: any) => {
    if (event.target.checked) {
      setQueryObject((prevState) => ({
        ...prevState,
        resourceTypes: [...prevState.resourceTypes, resourceTypeCheckList[index].name],
        offset: 0,
      }));
    } else {
      setQueryObject((prevState) => {
        const newResourceTypes = prevState.resourceTypes.filter(
          (resourceType) => resourceType !== resourceTypeCheckList[index].name
        );
        return {
          ...prevState,
          resourceTypes: newResourceTypes,
          offset: 0,
        };
      });
    }
    if (queryFromURL) {
      setQueryFromURL(false);
    }
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('resource.metadata.type')}</Typography>
      </FormLabel>
      <FormGroup>
        {resourceTypeCheckList.map((resourceType, index) => (
          <FormControlLabel
            data-testid={`resource-type-filtering-checkbox-label-${resourceType.name.toLowerCase()}`}
            key={index}
            control={
              <Checkbox
                data-testid={`resource-type-filtering-checkbox-${resourceType.name.toLowerCase()}`}
                color="default"
                checked={resourceType.isSelected}
                name={resourceType.name}
              />
            }
            label={t(`resource.type.${resourceType.name.toLowerCase()}`)}
            onChange={(event) => {
              changeSelected(index, event);
            }}
          />
        ))}
      </FormGroup>
    </StyledFormControl>
  );
};

export default ResourceTypeFiltering;
