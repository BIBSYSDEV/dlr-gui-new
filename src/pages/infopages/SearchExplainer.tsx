import React from 'react';
import { StyledContentWrapper } from '../../components/styled/Wrappers';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import Typography from '@material-ui/core/Typography';
import { List, ListItem } from '@material-ui/core';
import styled from 'styled-components';
import Link from '@material-ui/core/Link';

const StyledTypography = styled(Typography)`
  margin-top: 2rem;
`;

const SearchExplainer = () => {
  const { t } = useTranslation();
  return (
    <StyledContentWrapper>
      <PageHeader>{t('Tips til søk etter ressurser')}</PageHeader>
      <Typography variant="body1">
        Her finner du tips til hvordan du <Link href="/">søker etter ressurser</Link>.
      </Typography>
      <StyledTypography gutterBottom variant="h2">
        {t('Konstruering av søketekst')}
      </StyledTypography>

      <Typography gutterBottom>
        Spørsmålstegn (?) kan brukes for å erstatte en bokstav. b?k gir treff på både "bok" og "bak" men ikke "brekk".
      </Typography>

      <Typography gutterBottom>
        Asterisk (*) kan brukes for å erstatte en eller flere bokstaver. b*k gir treff på "bok", "bak" og "brekk".
      </Typography>

      <Typography>
        Thilde (~) finner resultat som ligner på ordet. lete~ vil gi treff på blant annet "sete", "leter" og "seter".
        Man kan også spesifisere hvor mange bokstaver ordet kan avvike med: lete~1 vil gi treff på blant annet "sete" og
        "leter", men ikke "seter".
      </Typography>

      <Typography>Søk støtter ikke funksjonalitet til +, AND og OR som syntaks.</Typography>

      <StyledTypography gutterBottom variant="h2">
        Søkefelt:
      </StyledTypography>
      <Typography gutterBottom>Søketeksten leter etter treff i følgende felt:</Typography>
      <List>
        <ListItem>Ressurstittel</ListItem>
        <ListItem>Ressursbeskrivelse</ListItem>
        <ListItem>Ressurs-id</ListItem>
        <ListItem>Emneord</ListItem>
        <ListItem>Opphaver-navn</ListItem>
        <ListItem>Opphaver-id</ListItem>
        <ListItem>Bidragsyter-navn</ListItem>
        <ListItem>Bidragsyter-id</ListItem>
        <ListItem>Institusjon</ListItem>
      </List>
    </StyledContentWrapper>
  );
};

export default SearchExplainer;
