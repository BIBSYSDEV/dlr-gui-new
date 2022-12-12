import React, { FC } from 'react';
import { Button } from '@mui/material';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import panoptoLogo from '../../resources/images/Logo-Panopto-Icon-Black.png';
import { useTranslation } from 'react-i18next';
import { StyledFullWidthWrapper } from '../../components/styled/Wrappers';

interface StartRegistrationAccordionPanoptoProps {
  expanded: boolean;
  handleClickOpen: () => void;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
}

const StartRegistrationAccordionPanopto: FC<StartRegistrationAccordionPanoptoProps> = ({
  expanded,
  handleClickOpen,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <StartRegistrationMethodAccordion
      headerLabel={t('vms.panopto.start_with_panopto_resource')}
      icon={<img height="24px" src={panoptoLogo} alt={t('vms.panopto.logo_alt') ?? ''} />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="resource-method-panopto"
      dataTestId="new-resource-panopto">
      <StyledFullWidthWrapper>
        <Button
          data-testid="open-panopto-dialog-button"
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleClickOpen}>
          {t('vms.panopto.show_my_resources')}
        </Button>
      </StyledFullWidthWrapper>
    </StartRegistrationMethodAccordion>
  );
};

export default StartRegistrationAccordionPanopto;
