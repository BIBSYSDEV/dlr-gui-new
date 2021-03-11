import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { QueryObject } from '../../types/search.types';
import { ResourceFeatureTypes } from '../../types/resource.types';
import { TFunction, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';

const StyledFormControl: any = styled(FormControl)`
  padding-top: 2rem;
`;

interface ResourceTypeListItem {
  name: string;
  isSelected: boolean;
}

const defaultResourceTypes: string[] = [
  ResourceFeatureTypes.audio,
  ResourceFeatureTypes.document,
  ResourceFeatureTypes.image,
  ResourceFeatureTypes.presentation,
  ResourceFeatureTypes.simulation,
  ResourceFeatureTypes.video,
];

const initialResourceTypeCheckList = (t: TFunction<string>): ResourceTypeListItem[] => {
  return defaultResourceTypes.map<ResourceTypeListItem>((resourceType) => ({
    name: t(resourceType),
    isSelected: false,
  }));
};

//TODO: cypress tester.

interface ResourceTypeFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const ResourceTypeFiltering: FC<ResourceTypeFilteringProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const [resourceTypeCheckList, setResourceCheckList] = useState(initialResourceTypeCheckList(t));

  useEffect(() => {
    if (queryObject.resourceTypes.length > 0) {
      const nextState = defaultResourceTypes.map((resourceType) => ({
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
            label={t(resourceType.name)}
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
