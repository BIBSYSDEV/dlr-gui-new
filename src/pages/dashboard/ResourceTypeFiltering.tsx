import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { QueryObject } from '../../types/search.types';
import { DefaultResourceTypes } from '../../types/resource.types';
import { TFunction, useTranslation } from 'react-i18next';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';

interface ResourceTypeListItem {
  name: string;
  isSelected: boolean;
}

interface ResourceTypeFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const initialResourceTypeCheckList = (t: TFunction<string>): ResourceTypeListItem[] => {
  return DefaultResourceTypes.map<ResourceTypeListItem>((resourceType) => ({
    name: t(resourceType),
    isSelected: false,
  }));
};

const ResourceTypeFiltering: FC<ResourceTypeFilteringProps> = ({ queryObject, setQueryObject }) => {
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
        queryFromURL: false,
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
          queryFromURL: false,
        };
      });
    }
  };

  return (
    <FormControl component="fieldset">
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
            label={t(resourceType.name)}
            onChange={(event) => {
              changeSelected(index, event);
            }}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default ResourceTypeFiltering;
