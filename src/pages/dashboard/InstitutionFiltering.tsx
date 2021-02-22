import React, { useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const StyledFormControl: any = styled(FormControl)`
  margin-left: 1rem;
  margin-right: 1rem;
`;

interface InstitutionList {
  name: string;
  isSelected: boolean;
}

const InstitutionListInitial: InstitutionList[] = [
  { name: 'NTNU', isSelected: false },
  { name: 'BI', isSelected: false },
  { name: 'OsloMet', isSelected: false },
  { name: 'UiB', isSelected: false },
  { name: 'HiOA', isSelected: false },
];

const InstitutionFiltering = () => {
  const location = useLocation();
  const [institutionList, setInstitutionList] = useState(InstitutionListInitial);
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get('institution') || '');

  const changeSelected = (index: number, event: any) => {
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
