import React, { FC } from 'react';
import { StyledContentWrapperLarge, StyledContentWrapperMedium } from '../../components/styled/Wrappers';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemText } from '@material-ui/core';
import styled from 'styled-components';
import Link from '@material-ui/core/Link';
import { Colors } from '../../themes/mainTheme';
import { BrowsingResource } from '../../resources/images/illustrations/svg';

interface Props {
  color: string;
}

const ColoringWrapper = styled.div<Props>`
  background-color: ${(props) => props.color};
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const StyledBottomColoringWrapper = styled(ColoringWrapper)`
  margin-bottom: 2rem;
`;

const StyledTypography = styled(Typography)`
  margin-top: 2rem;
`;

interface SimpleListItemProps {
  primary: string;
}
const SimpleListItem: FC<SimpleListItemProps> = ({ primary }) => {
  return (
    <ListItem>
      <ListItemText primary={primary} />
    </ListItem>
  );
};

const SearchExplainer = () => {
  const { t } = useTranslation();
  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('Tips til søk etter ressurser')}</PageHeader>
      <ColoringWrapper color={'inherit'}>
        <StyledContentWrapperMedium>
          <BrowsingResource />
          <StyledTypography gutterBottom variant="body1">
            Her finner du tips til hvordan du <Link href="/">søker etter ressurser</Link>.
          </StyledTypography>
        </StyledContentWrapperMedium>
      </ColoringWrapper>
      <ColoringWrapper color={Colors.ContributorsPageGradientColor1}>
        <StyledContentWrapperMedium>
          <Typography gutterBottom variant="h2">
            {t('Konstruering av søketekst')}
          </Typography>
          <Typography gutterBottom>
            Spørsmålstegn (?) kan brukes for å erstatte en bokstav. b?k gir treff på både "bok" og "bak" men ikke
            "brekk".
          </Typography>
          <Typography gutterBottom>
            Asterisk (*) kan brukes for å erstatte en eller flere bokstaver. b*k gir treff på "bok", "bak" og "brekk".
          </Typography>
          <Typography gutterBottom>
            Thilde (~) finner resultat som ligner på ordet. lete~ vil gi treff på blant annet "sete", "leter" og
            "seter". Man kan også spesifisere hvor mange bokstaver ordet kan avvike med: lete~1 vil gi treff på blant
            annet "sete" og "leter", men ikke "seter".
          </Typography>
          <Typography>Søk støtter ikke funksjonalitet til +, AND og OR som syntaks.</Typography>
        </StyledContentWrapperMedium>
      </ColoringWrapper>
      <StyledBottomColoringWrapper color={Colors.ContributorsPageGradientColor2}>
        <StyledContentWrapperMedium>
          <Typography gutterBottom variant="h2">
            Søkefelt:
          </Typography>
          <Typography gutterBottom>Søketeksten leter etter treff i følgende felt:</Typography>
          <List>
            <SimpleListItem primary={'Resurstittel'} />
            <SimpleListItem primary={'Ressursbeskrivelse'} />
            <SimpleListItem primary={'Ressurs-id'} />
            <SimpleListItem primary={'Emneord'} />
            <SimpleListItem primary={'Opphaver-navn'} />
            <SimpleListItem primary={'Opphaver-id'} />
            <SimpleListItem primary={'Bidragsyter-navn'} />
            <SimpleListItem primary={'Bidragsyter-id'} />
            <SimpleListItem primary={'Institusjon'} />
          </List>
        </StyledContentWrapperMedium>
      </StyledBottomColoringWrapper>
    </StyledContentWrapperLarge>
  );
};

export default SearchExplainer;
