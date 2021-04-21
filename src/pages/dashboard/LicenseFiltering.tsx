import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { CreativeCommonsLicenseCodes, Licenses } from '../../types/license.types';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import { QueryObject, SearchParameters } from '../../types/search.types';
import { useTranslation } from 'react-i18next';
import CClogoImage from '../../components/CClogoImage';
import LicensePopoverExplanation from '../../components/LicensePopoverExplanation';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { User, UserInstitution } from '../../types/user.types';
import { useHistory, useLocation } from 'react-router-dom';
import { rewriteSearchParams } from '../../utils/rewriteSearchParams';

const StyledCheckboxLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 13rem;
  width: 100%;
`;

const StyledFormControl: any = styled(FormControl)`
  margin-top: 2rem;
`;

interface LicenseListItem {
  licenseCode: string;
  isSelected: boolean;
}

const initLicenseList = (user: User): LicenseListItem[] => {
  const licenses = CreativeCommonsLicenseCodes.map((license) => ({
    licenseCode: license,
    isSelected: false,
  }));
  switch (user.institution.toLowerCase()) {
    case UserInstitution.NTNU.toLowerCase():
      licenses.push({
        licenseCode: Licenses.NTNU,
        isSelected: false,
      });
      break;
    case UserInstitution.BI.toLowerCase():
      licenses.push({
        licenseCode: Licenses.BI,
        isSelected: false,
      });
      break;
    default:
      break;
  }
  return licenses;
};

interface LicenseFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const LicenseFiltering: FC<LicenseFilteringProps> = ({ queryObject, setQueryObject }) => {
  const user = useSelector((state: RootState) => state.user);
  const [licensesCheckList, setLicensesCheckList] = useState<LicenseListItem[]>(initLicenseList(user));
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (queryObject.licenses.length > 0) {
      const nextState = CreativeCommonsLicenseCodes.map((licenseCode) => ({
        licenseCode: licenseCode,
        isSelected: !!queryObject.licenses.find((queryLicenseCode) => queryLicenseCode === licenseCode),
      }));
      setLicensesCheckList(nextState);
    } else {
      setLicensesCheckList(initLicenseList(user));
    }
  }, [queryObject, user]);

  const changeSelected = (index: number, event: any) => {
    const newQueryObject = { ...queryObject, offset: 0 };
    event.target.checked
      ? (newQueryObject.licenses = [...newQueryObject.licenses, licensesCheckList[index].licenseCode])
      : (newQueryObject.licenses = newQueryObject.licenses.filter(
          (licenseCode) => licenseCode !== licensesCheckList[index].licenseCode
        ));
    setQueryObject(newQueryObject);
    rewriteSearchParams(SearchParameters.license, newQueryObject.licenses, history, location);
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.licenses')}</Typography>
      </FormLabel>
      <FormGroup>
        {licensesCheckList.map((license, index) => (
          <FormControlLabel
            data-testid={`license-filtering-checkbox-label-${license.licenseCode.replaceAll(' ', '').replace('.', '')}`}
            key={index}
            control={
              <Checkbox
                data-testid={`license-filtering-checkbox-${license.licenseCode.replaceAll(' ', '').replace('.', '')}`}
                color="default"
                checked={license.isSelected}
                name={license.licenseCode.replace('4.0', '')}
              />
            }
            label={
              <StyledCheckboxLabelWrapper>
                <CClogoImage
                  showCCImage={false}
                  licenseCode={license.licenseCode.replace('CC ', '').replace(' 4.0', '')}
                />
                <LicensePopoverExplanation licenseCode={license.licenseCode} />
              </StyledCheckboxLabelWrapper>
            }
            onChange={(event) => {
              changeSelected(index, event);
            }}
          />
        ))}
      </FormGroup>
    </StyledFormControl>
  );
};

export default LicenseFiltering;
