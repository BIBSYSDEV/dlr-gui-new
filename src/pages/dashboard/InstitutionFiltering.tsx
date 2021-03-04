import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useTranslation } from 'react-i18next';
import { QueryObject } from '../../types/search.types';

const StyledFormControl: any = styled(FormControl)`
  margin-left: 1rem;
  margin-right: 1rem;
`;

interface InstitutionListItem {
  name: string;
  isSelected: boolean;
}

const initialInstitutionList: InstitutionListItem[] = [
  { name: 'NTNU', isSelected: false },
  { name: 'BI', isSelected: false },
  { name: 'OsloMet', isSelected: false },
  { name: 'UiB', isSelected: false },
  { name: 'HVL', isSelected: false },
];

interface InstitutionFilteringProps {
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const InstitutionFiltering: FC<InstitutionFilteringProps> = ({ setQueryObject }) => {
  const { t } = useTranslation();
  //const location = useLocation();
  const [institutionList, setInstitutionList] = useState(initialInstitutionList);

  // const parseInstitutionParameter = (institutions: string): string[] => {
  //   return institutions.replace('(', '').replace(')', '').split(' OR ');
  // };

  //  todo : move out
  // useEffect(() => {
  //   const activeInstitutions = new URLSearchParams(location.search).get(SearchParameters.institution);
  //   if (activeInstitutions) {
  //     const activeInstitutionList = parseInstitutionParameter(activeInstitutions);
  //     const nextState = initialInstitutionList.map((institutionListItem) => {
  //       return {
  //         name: institutionListItem.name,
  //         isSelected:
  //           activeInstitutionList.findIndex(
  //             (activeInstName) => activeInstName === institutionListItem.name.toLowerCase()
  //           ) !== -1,
  //       };
  //     });
  //     setInstitutionList(nextState);
  //   } else {
  //     setInstitutionList(initialInstitutionList);
  //   }
  // }, [location]);

  const changeSelected = (index: number, event: any) => {
    // TODO: move url-handling
    //const locationSearch = new URLSearchParams(location.search);
    //    const activeInstitutions = locationSearch.get(SearchParameters.institution) ?? '';
    // if (event.target.checked) {
    //   if (!activeInstitutions.includes(institutionList[index].name.toLowerCase())) {
    //     if (activeInstitutions.length === 0) {
    //       locationSearch.set(SearchParameters.institution, institutionList[index].name.toLowerCase());
    //     } else if (activeInstitutions.includes('(')) {
    //       locationSearch.set(
    //         SearchParameters.institution,
    //         `${activeInstitutions.replace(')', '')} OR ${institutionList[index].name.toLowerCase()})`
    //       );
    //     } else {
    //       locationSearch.set(
    //         SearchParameters.institution,
    //         `(${activeInstitutions} OR ${institutionList[index].name.toLowerCase()})`
    //       );
    //     }
    //   }
    // } else {
    //   if (activeInstitutions.includes(institutionList[index].name.toLowerCase())) {
    //     if (!activeInstitutions.includes('(')) {
    //       locationSearch.delete(SearchParameters.institution);
    //     } else {
    //       const institutionArray = activeInstitutions
    //         .replace('(', '')
    //         .replace(')', '')
    //         .split(' OR ')
    //         .filter((institution) => institution !== institutionList[index].name.toLowerCase());
    //       if (institutionArray.length > 1) {
    //         locationSearch.set(SearchParameters.institution, `(${institutionArray.join(' OR ')})`);
    //       } else if (institutionArray.length === 0) {
    //         locationSearch.delete(SearchParameters.institution);
    //       } else {
    //         locationSearch.set(SearchParameters.institution, institutionArray[0]);
    //       }
    //     }
    //   }
    // }
    setInstitutionList((prevState) => {
      prevState[index].isSelected = event.target.checked;
      return [...prevState];
    });

    if (event.target.checked) {
      setQueryObject((prevState) => ({
        ...prevState,
        institutions: [...prevState.institutions, institutionList[index].name],
        offset: 0,
      }));
    } else {
      setQueryObject((prevState) => {
        const newInstitutions = prevState.institutions.filter((instName) => instName !== institutionList[index].name);
        return {
          ...prevState,
          institutions: newInstitutions,
          offset: 0,
        };
      });
    }
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.institutions')}</Typography>{' '}
      </FormLabel>
      <FormHelperText error>Currently only accepting one institution at a time</FormHelperText>
      <FormGroup>
        {institutionList.map((institution, index) => (
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
