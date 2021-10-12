import React, { Dispatch, FC, SetStateAction } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { QueryObject, SearchParameters } from '../../types/search.types';
import { useHistory, useLocation } from 'react-router-dom';
import { rewriteSearchParams } from '../../utils/rewriteSearchParams';
import HelperTextPopover from '../../components/HelperTextPopover';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

interface AccessFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const AccessFiltering: FC<AccessFilteringProps> = ({ queryObject, setQueryObject }) => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();

  const changeSelected = (event: any) => {
    setQueryObject((prevState) => ({
      ...prevState,
      showInaccessible: event.target.checked ?? false,
      offset: 0,
    }));
    rewriteSearchParams(
      SearchParameters.showInaccessible,
      [event.target.checked ? 'true' : 'false'],
      history,
      location,
      true
    );
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
        label={t('dashboard.access_filter')}
        onChange={(event) => {
          changeSelected(event);
        }}
      />
      <HelperTextPopover
        ariaButtonLabel={t('explanation_text.access_filtering_label')}
        popoverId={'access-filtering-explainer'}>
        <Typography>{`${t('explanation_text.access_filtering')} `}</Typography>
      </HelperTextPopover>
    </div>
  );
};

export default AccessFiltering;
