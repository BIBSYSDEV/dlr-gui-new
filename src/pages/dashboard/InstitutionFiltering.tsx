import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { AllDLRInstitutionNames, FacetType, QueryObject } from '../../types/search.types';
import styled from 'styled-components';
import { getAllFacets } from '../../api/resourceApi';
import ErrorBanner from '../../components/ErrorBanner';

const StyledFormControl: any = styled(FormControl)`
  margin-top: 2rem;
`;

interface InstitutionListItem {
  name: string;
  isSelected: boolean;
}

const initialInstitutionCheckedList = (instList: string[]): InstitutionListItem[] => {
  return instList.map((instName) => ({
    name: instName,
    isSelected: false,
  }));
};

interface InstitutionFilteringProps {
  queryObject: QueryObject;
  setQueryObject: Dispatch<SetStateAction<QueryObject>>;
}

const InstitutionFiltering: FC<InstitutionFilteringProps> = ({ queryObject, setQueryObject }) => {
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  const [institutionsFromGetFacets, setInstitutionsFromGetFacets] = useState<string[]>(AllDLRInstitutionNames);
  const [calledAPIOnce, setCalledAPIONCE] = useState(false);
  const [institutionCheckedList, setInstitutionCheckedList] = useState(
    initialInstitutionCheckedList(AllDLRInstitutionNames)
  );
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const updateInstitutionCheckedList = (list: string[]) => {
      if (queryObject.institutions.length > 0) {
        const nextState = list.map((institutionName) => ({
          name: institutionName,
          isSelected: !!queryObject.institutions.find(
            (instName) => instName.toLowerCase() === institutionName.toLowerCase()
          ),
        }));
        setInstitutionCheckedList(nextState);
      } else {
        setInstitutionCheckedList(initialInstitutionCheckedList(list));
      }
    };
    const generateInstitutionListFromFacets = async () => {
      setError(null);
      try {
        setIsloading(true);
        const facetsResponse = await getAllFacets();
        const list = facetsResponse.data.facet_counts
          .filter((facet) => facet.type === FacetType.dlrInstitutionId)
          .map((facet) => facet.value)
          .sort((a, b) => a.localeCompare(b));
        if (!mountedRef.current) return null;
        setInstitutionsFromGetFacets(list);
        updateInstitutionCheckedList(list);
      } catch (error) {
        setError(error);
      } finally {
        setIsloading(false);
      }
    };
    if (!calledAPIOnce) {
      setCalledAPIONCE(true);
      generateInstitutionListFromFacets();
    } else {
      updateInstitutionCheckedList(institutionsFromGetFacets);
    }
  }, [calledAPIOnce, queryObject.institutions, institutionsFromGetFacets]);

  const changeSelected = (index: number, event: any) => {
    if (event.target.checked) {
      setQueryObject((prevState) => ({
        ...prevState,
        institutions: [...prevState.institutions, institutionCheckedList[index].name],
        offset: 0,
        queryFromURL: false,
      }));
    } else {
      setQueryObject((prevState) => ({
        ...prevState,
        institutions: prevState.institutions.filter((instName) => instName !== institutionCheckedList[index].name),
        offset: 0,
        queryFromURL: false,
      }));
    }
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.institutions')}</Typography>{' '}
      </FormLabel>
      {isLoading && <CircularProgress />}
      {!isLoading && (
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
              label={institution.name}
              onChange={(event) => {
                changeSelected(index, event);
              }}
            />
          ))}
        </FormGroup>
      )}
      {error && <ErrorBanner error={error} />}
    </StyledFormControl>
  );
};

export default InstitutionFiltering;
