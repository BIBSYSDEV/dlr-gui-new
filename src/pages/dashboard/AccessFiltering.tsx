import React, { Dispatch, FC, SetStateAction } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { QueryObject } from '../../types/search.types';

interface AccoessFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const AccessFiltering: FC<AccoessFilteringProps> = ({ queryObject, setQueryObject }) => {
  const changeSelected = (event: any) => {
    setQueryObject((prevState) => ({
      ...prevState,
      showInaccessible: event.target.checked ?? false,
      offset: 0,
      queryFromURL: false,
    }));
  };

  return (
    <div>
      <FormControlLabel
        data-testid="access-checkbox-label"
        control={
          <Checkbox
            data-testid={`access-filtering-checkbox`}
            color="default"
            checked={queryObject.showInaccessible}
            name={'access'}
          />
        }
        label={'Vis også ressurser jeg ikke har tilgang til'}
        onChange={(event) => {
          changeSelected(event);
        }}
      />
    </div>
  );
};

export default AccessFiltering;
