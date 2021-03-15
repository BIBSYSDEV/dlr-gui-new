import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Licenses } from '../../types/license.types';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import { QueryObject } from '../../types/search.types';
import { useTranslation } from 'react-i18next';
import CClogoImage from '../../components/CClogoImage';
import CCExplanation from '../../components/CCExplanation';
import styled from 'styled-components';

const StyledCheckboxLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 13rem;
  width: 100%;
`;

interface LicenseListItem {
  licenseCode: string;
  isSelected: boolean;
}

const licenseCodes: string[] = [
  Licenses.CC_BY,
  Licenses.CC_BY_SA,
  Licenses.CC_BY_NC,
  Licenses.CC_BY_ND,
  Licenses.CC_BY_NC_SA,
  Licenses.CC_BY_NC_ND,
  Licenses.CC_ZERO,
  Licenses.BI,
  Licenses.NTNU,
];

const initLicenseList = (): LicenseListItem[] => {
  return licenseCodes.map((license) => ({
    licenseCode: license,
    isSelected: false,
  }));
};

interface LicenseFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const LicenseFiltering: FC<LicenseFilteringProps> = ({ queryObject, setQueryObject }) => {
  const [licensesCheckList, setlicensesCheckList] = useState<LicenseListItem[]>(initLicenseList());
  const { t } = useTranslation();

  useEffect(() => {
    if (queryObject.licenses.length > 0) {
      const nextState = licenseCodes.map((licenseCode) => ({
        licenseCode: licenseCode,
        isSelected: !!queryObject.licenses.find((queryLicenseCode) => queryLicenseCode === licenseCode),
      }));
      setlicensesCheckList(nextState);
    } else {
      setlicensesCheckList(initLicenseList());
    }
  }, [queryObject]);

  const changeSelected = (index: number, event: any) => {
    if (event.target.checked) {
      setQueryObject((prevState) => ({
        ...prevState,
        licenses: [...prevState.licenses, licensesCheckList[index].licenseCode],
        offset: 0,
        queryFromURL: false,
      }));
    } else {
      setQueryObject((prevState) => {
        const newLicenses = prevState.licenses.filter(
          (licenseCode) => licenseCode !== licensesCheckList[index].licenseCode
        );
        return {
          ...prevState,
          licenses: newLicenses,
          offset: 0,
          queryFromURL: false,
        };
      });
    }
  };

  return (
    <FormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.licenses')}</Typography>
      </FormLabel>
      <FormGroup>
        {licensesCheckList.map((license, index) => (
          <FormControlLabel
            data-testid={`license-filtering-checkbox-label-${license.licenseCode}`}
            key={index}
            control={
              <Checkbox
                data-testid={`license-filtering-checkbox-${license.licenseCode}`}
                color="default"
                checked={license.isSelected}
                name={license.licenseCode.replace('4.0', '')}
              />
            }
            label={
              <StyledCheckboxLabelWrapper>
                <CClogoImage
                  showCCSVG={false}
                  licenseCode={license.licenseCode.replace('CC ', '').replace(' 4.0', '')}
                />
                <CCExplanation licenseCode={license.licenseCode} />
              </StyledCheckboxLabelWrapper>
            }
            onChange={(event) => {
              changeSelected(index, event);
            }}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default LicenseFiltering;
