import React from 'react';
import { StyledContentWrapperLarge, StyledContentWrapperMedium } from '../../components/styled/Wrappers';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemText } from '@material-ui/core';
import styled from 'styled-components';
import Link from '@material-ui/core/Link';
import { Colors } from '../../themes/mainTheme';
import BrowsingResource from '../../resources/images/illustrations/browsing_resource.svg';

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

const StyledImg = styled.img`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 23rem;
  }
`;

const validSearchFields = [
  'resource_title',
  'resource_description',
  'resource_id',
  'tags',
  'creator_name',
  'creator_id',
  'contributor_name',
  'contributor_id',
  'institution',
];

const SearchExplainer = () => {
  const { t } = useTranslation();
  const validSearchFieldsTranslated = validSearchFields
    .map((field) => t(`search_tricks.search_field.${field}`))
    .sort((a, b) => a.localeCompare(b));
  return (
    <StyledContentWrapperLarge>
      <PageHeader>{t('search_tricks.page_title')}</PageHeader>
      <ColoringWrapper color={'inherit'}>
        <StyledContentWrapperMedium>
          <StyledImg src={BrowsingResource} alt={t('illustration_alts_tags.browsing_resource')} />
          <StyledTypography gutterBottom variant="body1">
            {`${t('search_tricks.find_tricks')} `}
            <Link href="/">{t('search_tricks.search_for_resource').toLowerCase()}.</Link>
          </StyledTypography>
        </StyledContentWrapperMedium>
      </ColoringWrapper>
      <ColoringWrapper color={Colors.DLRBlue1}>
        <StyledContentWrapperMedium>
          <Typography gutterBottom variant="h2">
            {t('search_tricks.construction_search_term')}
          </Typography>
          <Typography gutterBottom>
            {t('search_tricks.question_mark1')}
            {'. '} <b>{t('search_tricks.question_mark2')}</b> {t('search_tricks.question_mark3')}.
          </Typography>
          <Typography gutterBottom>
            {t('search_tricks.asterisk1')}.<b>{` ${t('search_tricks.asterisk2')} `}</b> {t('search_tricks.asterisk3')}.
          </Typography>
          <Typography gutterBottom>
            {t('search_tricks.tilde1')}. <b>{` ${t('search_tricks.tilde2')} `}</b>
            {t('search_tricks.tilde3')}:<b>{` ${t('search_tricks.tilde4')} `}</b>
            {t('search_tricks.tilde5')}
          </Typography>
          <Typography>{t('search_tricks.does_not_support')}.</Typography>
        </StyledContentWrapperMedium>
      </ColoringWrapper>
      <StyledBottomColoringWrapper color={Colors.DLRBlue2}>
        <StyledContentWrapperMedium>
          <Typography gutterBottom variant="h2">
            {t('search_tricks.search_field_title')}:
          </Typography>
          <Typography gutterBottom>{t('search_tricks.field_hits')}:</Typography>
          <List>
            {validSearchFieldsTranslated.map((field, index) => (
              <ListItem key={index}>
                <ListItemText primary={field} />
              </ListItem>
            ))}
          </List>
        </StyledContentWrapperMedium>
      </StyledBottomColoringWrapper>
    </StyledContentWrapperLarge>
  );
};

export default SearchExplainer;
