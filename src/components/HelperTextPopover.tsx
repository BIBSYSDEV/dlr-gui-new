import React, { FC } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import { IconButton, Popover } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { StyleWidths } from '../themes/mainTheme';

const ScreenReaderOnlyP = styled.p`
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden !important;
`;

const PopoverContent = styled.div`
  padding: 1rem;
  max-width: ${StyleWidths.width1};
`;

interface HelperTextPopoverProps {
  ariaButtonLabel: string;
  popoverId: string;
}
const HelperTextPopover: FC<HelperTextPopoverProps> = ({ ariaButtonLabel, popoverId, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label={ariaButtonLabel} onClick={handleClick} color="primary" size="large">
        <HelpIcon />
      </IconButton>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <PopoverContent>
          {children}
          <ScreenReaderOnlyP>{t('dashboard.close_popover')}</ScreenReaderOnlyP>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default HelperTextPopover;
