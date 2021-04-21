import React, { Dispatch, FC, SetStateAction } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { QueryObject, SearchParameters } from '../../types/search.types';
import { useHistory, useLocation } from 'react-router-dom';

interface AccoessFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const AccessFiltering: FC<AccoessFilteringProps> = ({ queryObject, setQueryObject }) => {
  const location = useLocation();
  const history = useHistory();
  const changeSelected = (event: any) => {
    setQueryObject((prevState) => ({
      ...prevState,
      showInaccessible: event.target.checked ?? false,
      offset: 0,
    }));
    const urlSearchTerms = new URLSearchParams(location.search);
    event.target.checked
      ? urlSearchTerms.set(SearchParameters.showInaccessible, 'true')
      : urlSearchTerms.delete(SearchParameters.showInaccessible);
    history.push('?' + urlSearchTerms.toString());
  };

  return (
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
  );
};

export default AccessFiltering;
