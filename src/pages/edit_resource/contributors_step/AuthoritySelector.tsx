import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';
import { searchAuthorities } from '../../../api/authoritiesApi';
import { AuthoritySearchResponse } from '../../../types/authority.types';

const nameConverter = (fullName: string) => {
  if (fullName.includes(',')) {
    return fullName;
  }
  const names = fullName.split(' ');
  if (names.length <= 1) {
    return fullName;
  }
  const surname = names[names.length - 1] + ',';
  names[names.length - 1] = names[0];
  names[0] = surname;
  return names.join(' ');
};

interface AuthoritySelectorProps {
  type: string;
  initialNameValue: string;
}

//Behandle tekststreng.
//1. med komma: kan kjøres rett inn.
//2. uten komma: må behandles.

const AuthoritySelector: FC<AuthoritySelectorProps> = ({ type, initialNameValue }) => {
  const [authorityInputSearchValue, setAuthorityInputSearchValue] = useState(nameConverter(initialNameValue));
  const [open, setOpen] = useState(false);
  const [authoritySearchResponse, setAuthoritySearchResponse] = useState<AuthoritySearchResponse>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const searchForAuthorities = () => {
    searchAuthorities(authorityInputSearchValue, 'Creator').then((response) => {
      setAuthoritySearchResponse(response.data);
    });
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>{authorityInputSearchValue}</DialogContentText>
          <form onSubmit={searchForAuthorities}>
            <TextField
              value={authorityInputSearchValue}
              onChange={(event) => setAuthorityInputSearchValue(event.target.value)}
              autoFocus
              id="name"
              label="Finn verifisert autoritet"
              type="text"
              fullWidth
            />
            <Button type="submit">Søk</Button>
          </form>
          {authoritySearchResponse && <>{JSON.stringify(authoritySearchResponse)}</>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthoritySelector;
