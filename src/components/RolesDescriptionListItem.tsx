import React, { FC } from 'react';
import { Divider, ListItem, ListItemText } from '@mui/material';

interface RolesDescriptionListItemProps {
  role: string;
  description: string;
  dataTestId?: string;
}

const RolesDescriptionListItem: FC<RolesDescriptionListItemProps> = ({ role, description, dataTestId }) => {
  return (
    <>
      <ListItem>
        <ListItemText data-testid={dataTestId} primary={role} secondary={description} />
      </ListItem>
      <Divider variant="fullWidth" component="li" />
    </>
  );
};

export default RolesDescriptionListItem;
