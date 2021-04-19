import React, { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import { Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { AllDLRInstitutionNames, FacetType, QueryObject } from '../../types/search.types';
import styled from 'styled-components';
import { getAllFacets } from '../../api/resourceApi';
import ErrorBanner from '../../components/ErrorBanner';
import institutions from '../../resources/assets/institutions.json';

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
  setQueryFromURL: Dispatch<SetStateAction<boolean>>;
  queryFromURL: boolean;
}

const InstitutionFiltering: FC<InstitutionFilteringProps> = ({
  queryObject,
  setQueryObject,
  setQueryFromURL,
  queryFromURL,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [institutionsFromGetFacets, setInstitutionsFromGetFacets] = useState(AllDLRInstitutionNames);
  const [calledApiOnce, setCalledApiOnce] = useState(false);
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
      try {
        if (!mountedRef.current) return null;
        setError(null);
        setIsLoading(true);
        const facetsResponse = await getAllFacets();
        if (!mountedRef.current) return null;
        const list = facetsResponse.data.facet_counts
          .filter((facet) => facet.type === FacetType.dlrInstitutionId)
          .map((facet) => facet.value)
          .sort((a, b) => a.localeCompare(b));
        setInstitutionsFromGetFacets(list);
        updateInstitutionCheckedList(list);
      } catch (error) {
        if (!mountedRef.current) return null;
        setError(error);
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };
    if (!calledApiOnce) {
      setCalledApiOnce(true);
      generateInstitutionListFromFacets();
    } else {
      updateInstitutionCheckedList(institutionsFromGetFacets);
    }
  }, [calledApiOnce, queryObject.institutions, institutionsFromGetFacets]);

  const changeSelected = (index: number, event: any) => {
    if (event.target.checked) {
      setQueryObject((prevState) => ({
        ...prevState,
        institutions: [...prevState.institutions, institutionCheckedList[index].name],
        offset: 0,
      }));
    } else {
      setQueryObject((prevState) => ({
        ...prevState,
        institutions: prevState.institutions.filter((instName) => instName !== institutionCheckedList[index].name),
        offset: 0,
      }));
    }
    if (queryFromURL) {
      setQueryFromURL(false);
    }
  };

  const generateInstitutionName = (institutionCode: string): string => {
    const inst = institutions.find((institution) => institution.toLowerCase() === institutionCode.toLowerCase());
    if (inst) {
      return inst;
    } else {
      return institutionCode;
    }
  };

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <Typography variant="h3">{t('dashboard.institutions')}</Typography>{' '}
      </FormLabel>
      {isLoading ? (
        <CircularProgress />
      ) : (
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
              label={generateInstitutionName(institution.name)}
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
