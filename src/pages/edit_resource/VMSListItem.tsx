import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Grid, Link, Typography } from '@mui/material';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import { VMSResource } from '../../types/resource.types';

const StyledImageWrapper: any = styled.div`
  min-height: 5rem;
  height: 5rem;
  min-width: 7.85rem;
  width: 7.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${Colors.DescriptionPageGradientColor2};
`;

const StyledResultItem = styled.li`
  padding: 1rem;
  width: 100%;
  max-width: ${StyleWidths.width4};
  background-color: ${Colors.Background};
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;

const StyledImage: any = styled.img`
  max-height: 5rem;
  max-width: 7.85rem;
`;

interface VMSListItemProps {
  item: VMSResource;
  handleUseResource: (vmsPresentation: VMSResource) => void;
}

const VMSListItem: FC<VMSListItemProps> = ({ item, handleUseResource }) => {
  const { t } = useTranslation();

  return (
    <StyledResultItem key={item.id} data-testid={`vms-item-${item.id}`}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <StyledImageWrapper>
            <StyledImage src={item.thumbnailUrl} />
          </StyledImageWrapper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Link underline="hover" href={item.url} target="_blank" rel="noopener noreferrer">
            <Typography>{item.title}</Typography>
          </Link>
        </Grid>
        <Grid item xs={12} sm={2}>
          {item.dlrContentIdentifier ? (
            <Typography variant="caption">{t('vms.already_imported')}</Typography>
          ) : (
            <Button
              variant="outlined"
              data-testid={`use-vms-link-button-${item.id}`}
              onClick={() => handleUseResource(item)}>
              {t('common.use')}
            </Button>
          )}
        </Grid>
      </Grid>
    </StyledResultItem>
  );
};

export default VMSListItem;
