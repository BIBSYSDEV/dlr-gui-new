import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AllDLRInstitutionNames, QueryObject } from '../../types/search.types';

const StyledFormControl: any = styled(FormControl)`
  padding-top: 2rem;
  min-width: 8rem;
`;

interface InstitutionListItem {
  name: string;
  isSelected: boolean;
}

const initialInstitutionCheckedList: InstitutionListItem[] = AllDLRInstitutionNames.map((instName) => ({
  name: instName,
  isSelected: false,
}));

interface InstitutionFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const InstitutionFiltering: FC<InstitutionFilteringProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const [institutionCheckedList, setInstitutionCheckedList] = useState(initialInstitutionCheckedList);

  useEffect(() => {
    if (queryObject.institutions.length > 0) {
      const nextState = AllDLRInstitutionNames.map((institutionName) => ({
        name: institutionName,
        isSelected: !!queryObject.institutions.find(
          (instName) => instName.toLowerCase() === institutionName.toLowerCase()
        ),
      }));
      setInstitutionCheckedList(nextState);
    } else {
      setInstitutionCheckedList(initialInstitutionCheckedList);
    }
  }, [queryObject]);

  const changeSelected = (index: number, event: any) => {
    if (event.target.checked) {
      setQueryObject((prevState) => ({
        ...prevState,
        institutions: [...prevState.institutions, institutionCheckedList[index].name],
        offset: 0,
        queryFromURL: false,
      }));
    } else {
      setQueryObject((prevState) => {
        const newInstitutions = prevState.institutions.filter(
          (instName) => instName !== institutionCheckedList[index].name
        );
        return {
          ...prevState,
          institutions: newInstitutions,
          offset: 0,
          queryFromURL: false,
        };
      });
    }
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.institutions')}</Typography>{' '}
      </FormLabel>
      <FormGroup>
        {institutionCheckedList.map((institution, index) => (
          <FormControlLabel
            data-testid={`institution-filtering-checkbox-label-${institution.name.toLowerCase()}`}
            key={index}
            control={
              <Checkbox
                data-testid={`institution-filtering-checkbox-${institution.name.toLowerCase()}`}
                color="default"
                checked={institution.isSelected}
                name={institution.name}
              />
            }
            label={t(`institutions.${institution.name}`)}
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
