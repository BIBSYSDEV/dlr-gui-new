import React, { useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import FormHelperText from '@material-ui/core/FormHelperText';

const StyledFormControl: any = styled(FormControl)`
  margin-left: 1rem;
  margin-right: 1rem;
`;

interface InstitutionList {
  name: string;
  isSelected: boolean;
}

export const InstitutionParameterName = 'inst';

const InstitutionListInitial: InstitutionList[] = [
  { name: 'NTNU', isSelected: false },
  { name: 'BI', isSelected: false },
  { name: 'OsloMet', isSelected: false },
  { name: 'UiB', isSelected: false },
  { name: 'HVL', isSelected: false },
];

const generateInstitutionList = (
  initalInstitutionList: InstitutionList[],
  activeInstitution: string | null
): InstitutionList[] => {
  if (activeInstitution === null) {
    return initalInstitutionList;
  } else {
    const activeInstitutionList = activeInstitution.replace('(', '').replace(')', '').split(' OR ');
    activeInstitutionList.forEach((institution) => {
      const initalInstitutionListIndex = initalInstitutionList.findIndex((initalInstitutionListItem) =>
        institution.includes(initalInstitutionListItem.name.toLowerCase())
      );
      if (initalInstitutionListIndex > -1) {
        initalInstitutionList[initalInstitutionListIndex].isSelected = true;
      }
    });
    return initalInstitutionList;
  }
};

const InstitutionFiltering = () => {
  const location = useLocation();
  const [institutionList, setInstitutionList] = useState(
    generateInstitutionList(InstitutionListInitial, new URLSearchParams(location.search).get(InstitutionParameterName))
  );
  const history = useHistory();

  const changeSelected = (index: number, event: any) => {
    const locationSearch = new URLSearchParams(location.search);
    const activeInstitutions = locationSearch.get(InstitutionParameterName) ?? '';
    if (event.target.checked) {
      if (!activeInstitutions.includes(institutionList[index].name.toLowerCase())) {
        if (activeInstitutions.length === 0) {
          locationSearch.set(InstitutionParameterName, institutionList[index].name.toLowerCase());
        } else if (activeInstitutions.includes('(')) {
          locationSearch.set(
            InstitutionParameterName,
            `${activeInstitutions.replace(')', '')} OR ${institutionList[index].name.toLowerCase()})`
          );
        } else {
          locationSearch.set(
            InstitutionParameterName,
            `(${activeInstitutions} OR ${institutionList[index].name.toLowerCase()})`
          );
        }
      }
    } else {
      if (activeInstitutions.includes(institutionList[index].name.toLowerCase())) {
        if (!activeInstitutions.includes('(')) {
          locationSearch.delete(InstitutionParameterName);
        } else {
          const institutionArray = activeInstitutions
            .replace('(', '')
            .replace(')', '')
            .split(' OR ')
            .filter((institution) => institution !== institutionList[index].name.toLowerCase());
          if (institutionArray.length > 1) {
            locationSearch.set(InstitutionParameterName, `(${institutionArray.join(' OR ')})`);
          } else if (institutionArray.length === 0) {
            locationSearch.delete(InstitutionParameterName);
          } else {
            locationSearch.set(InstitutionParameterName, institutionArray[0]);
          }
        }
      }
    }
    const url = locationSearch.toString();
    history.replace(`?${url}`);
    setInstitutionList((prevState) => {
      prevState[index].isSelected = event.target.checked;
      return [...prevState];
    });
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">Institutions</Typography>{' '}
      </FormLabel>
      <FormHelperText error>Currently only accepting one institution at a time</FormHelperText>
      <FormGroup>
        {institutionList.map((institution, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox color="default" checked={institution.isSelected} name={institution.name} />}
            label={institution.name}
            onChange={(event) => {
              changeSelected(index, event);
            }}
          />
        ))}
      </FormGroup>
    </StyledFormControl>
  );
};

export default InstitutionFiltering;
