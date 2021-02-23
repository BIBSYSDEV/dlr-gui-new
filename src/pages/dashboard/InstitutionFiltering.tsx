import React, { useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';

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
  { name: 'HiOA', isSelected: false },
];

const generateInstitutionList = (
  initalInstitutionList: InstitutionList[],
  activeInstitution: string[]
): InstitutionList[] => {
  activeInstitution.forEach((institution) => {
    const initalInstitutionListIndex = initalInstitutionList.findIndex(
      (initalInstitutionListItem) => initalInstitutionListItem.name.toLowerCase() === institution
    );
    if (initalInstitutionListIndex > 0) {
      initalInstitutionList[initalInstitutionListIndex].isSelected = true;
    }
  });
  return initalInstitutionList;
};

const InstitutionFiltering = () => {
  const location = useLocation();
  const [institutionList, setInstitutionList] = useState(
    generateInstitutionList(
      InstitutionListInitial,
      new URLSearchParams(location.search).getAll(InstitutionParameterName)
    )
  );
  const history = useHistory();

  const changeSelected = (index: number, event: any) => {
    const locationSearch = new URLSearchParams(location.search);
    const activeInstitutions = locationSearch.getAll(InstitutionParameterName);
    if (event.target.checked) {
      if (!activeInstitutions.find((institution) => institution === institutionList[index].name.toLowerCase())) {
        locationSearch.append(InstitutionParameterName, institutionList[index].name.toLowerCase());
        const url = locationSearch.toString();
        history.replace(`?${url}`);
      }
    } else {
      const newActiveInstitutions = activeInstitutions.filter(
        (institution) => institution !== institutionList[index].name.toLowerCase()
      );
      if (newActiveInstitutions.length !== activeInstitutions.length) {
        locationSearch.delete(InstitutionParameterName);
        newActiveInstitutions.forEach((institution) => {
          locationSearch.append(InstitutionParameterName, institution);
        });
        const url = locationSearch.toString();
        history.replace(`?${url}`);
      }
    }
    setInstitutionList((prevState) => {
      prevState[index].isSelected = event.target.checked;
      return [...prevState];
    });
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">Institution</Typography>{' '}
      </FormLabel>
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
