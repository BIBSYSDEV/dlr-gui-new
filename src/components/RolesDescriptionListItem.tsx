import React, { FC } from 'react';
import { Divider, ListItem, ListItemText } from '@material-ui/core';

interface RolesDescriptionListItemProps {
  role: string;
  description: string;
}

const RolesDescriptionListItem: FC<RolesDescriptionListItemProps> = ({ role, description }) => {
  return (
    <>
      <ListItem>
        <ListItemText primary={role} secondary={description} />
      </ListItem>
      <Divider variant="fullWidth" component="li" />
    </>
  );
};

export default RolesDescriptionListItem;
