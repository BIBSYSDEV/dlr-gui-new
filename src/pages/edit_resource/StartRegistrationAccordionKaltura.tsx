import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import kalturaLogo from '../../resources/images/Kaltura_Sun_black_icon.png';
import { useTranslation } from 'react-i18next';
import { StyledFullWidthWrapper } from '../../components/styled/Wrappers';

interface StartRegistrationAccordionKalturaProps {
  expanded: boolean;
  handleClickOpen: () => void;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const StartRegistrationAccordionKaltura: FC<StartRegistrationAccordionKalturaProps> = ({
  expanded,
  handleClickOpen,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <StartRegistrationMethodAccordion
      headerLabel={t('vms.kaltura.start_with_kaltura_resource')}
      icon={<img height="24px" src={kalturaLogo} alt={t('vms.kaltura.logo_alt')} />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="resource-method-kaltura"
      dataTestId="new-resource-kaltura">
      <StyledFullWidthWrapper>
        <Button
          data-testid="open-kaltura-dialog-button"
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleClickOpen}>
          {t('vms.kaltura.show_my_resources')}
        </Button>
      </StyledFullWidthWrapper>
    </StartRegistrationMethodAccordion>
  );
};

export default StartRegistrationAccordionKaltura;
