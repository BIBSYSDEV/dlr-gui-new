import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { QueryObject, SearchParameters } from '../../types/search.types';
import { DefaultResourceTypes } from '../../types/resource.types';
import { TFunction, useTranslation } from 'react-i18next';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { rewriteSearchParams } from '../../utils/rewriteSearchParams';

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
}

const ResourceTypeFiltering: FC<ResourceTypeFilteringProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

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
    const newQueryObject = { ...queryObject, offset: 0 };
    event.target.checked
      ? (newQueryObject.resourceTypes = [...newQueryObject.resourceTypes, resourceTypeCheckList[index].name])
      : (newQueryObject.resourceTypes = newQueryObject.resourceTypes.filter(
          (resourceType) => resourceType !== resourceTypeCheckList[index].name
        ));
    setQueryObject(newQueryObject);
    rewriteSearchParams(SearchParameters.resourceType, newQueryObject.resourceTypes, history, location, true);
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel component="legend">
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
            label={<Typography>{t(`resource.type.${resourceType.name.toLowerCase()}`)}</Typography>}
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
