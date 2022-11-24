import React, { FC } from 'react';
import styled from 'styled-components';
import CC from '../resources/images/creative_commons_logos/cc.svg';
import NC from '../resources/images/creative_commons_logos/nc.svg';
import SA from '../resources/images/creative_commons_logos/sa.svg';
import ND from '../resources/images/creative_commons_logos/nd.svg';
import Zero from '../resources/images/creative_commons_logos/zero.svg';
import BY from '../resources/images/creative_commons_logos/by.svg';
import Typography from '@mui/material/Typography';
import { IconButton, Popover } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useTranslation } from 'react-i18next';
import Link from '@mui/material/Link';

const StyledImage = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 1rem;
`;

const ExplanationWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-content: flex-start;
`;

const PopoverContent = styled.div`
  padding: 1rem;
`;

const ScreenReaderOnlyP = styled.p`
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden !important;
`;

const StyledTypography: any = styled(Typography)`
  margin-bottom: 0.5rem;
`;
const StyledLastTypography = styled(Typography)`
  margin-bottom: 1.5rem;
`;
const StyledFirstTypography = styled(Typography)`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

interface ExplanationProps {
  icon: any;
  explanation: string;
  fontVariant?: any;
}
const Explanation: FC<ExplanationProps> = ({ icon, explanation, fontVariant }) => {
  return (
    <ExplanationWrapper>
      <StyledImage src={icon} alt="" />
      <Typography component={fontVariant ? 'h5' : 'p'} variant={fontVariant ?? 'body2'}>
        {explanation}
      </Typography>
    </ExplanationWrapper>
  );
};

interface CCExplanationProps {
  licenseCode: string;
  showLink?: boolean;
  showIntroduction?: boolean;
  showInternalLicenseExplanation?: boolean;
}

const LicensePopoverExplanation: FC<CCExplanationProps> = ({
  licenseCode,
  showLink = true,
  showIntroduction = false,
  showInternalLicenseExplanation = false,
}) => {
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
    <div>
      <IconButton aria-label={t('dashboard.explain_license')} color="primary" onClick={handleClick} size="large">
        <HelpIcon />
      </IconButton>
      <Popover
        id={`explain-license-${licenseCode.replaceAll(' ', '').replace('.', '')}`}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{ sx: { overflow: 'hidden' } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <PopoverContent>
          {showIntroduction && (
            <>
              <StyledTypography component="h4" variant="subtitle2">
                {t('license.part_description.need_to_select_license')}
              </StyledTypography>
              <StyledTypography variant="body2">
                {t('license.part_description.cannot_change_license')}.
              </StyledTypography>
              <StyledLastTypography variant="body2">
                {t('license.part_description.more_information')}
              </StyledLastTypography>
              <Explanation
                icon={CC}
                explanation={`${t('license.part_description.cc_introduction')}:`}
                fontVariant="subtitle2"
              />
            </>
          )}
          {licenseCode.toLowerCase().includes('by') && (
            <Explanation icon={BY} explanation={t('license.part_description.by')} />
          )}
          {licenseCode.toLowerCase().includes('nc') && (
            <Explanation icon={NC} explanation={t(`license.part_description.nc`)} />
          )}
          {licenseCode.toLowerCase().includes('nd') && (
            <Explanation icon={ND} explanation={t('license.part_description.nd')} />
          )}
          {licenseCode.toLowerCase().includes('sa') && (
            <Explanation icon={SA} explanation={t('license.part_description.sa')} />
          )}
          {licenseCode.toLowerCase().includes('1') && (
            <Explanation icon={Zero} explanation={t('license.part_description.zero')} />
          )}
          {licenseCode.toLowerCase().includes('bi') && <Typography>{t('license.part_description.bi')}</Typography>}
          {licenseCode.toLowerCase().includes('ntnu') && <Typography>{t('license.part_description.ntnu')}</Typography>}
          {licenseCode.toLowerCase().includes('vid-intern') && (
            <Typography>{t('license.part_description.vid')}</Typography>
          )}
          {licenseCode.toLowerCase().includes('vid-opphaver') && (
            <Typography>{t('license.part_description.vid_opphaver')}</Typography>
          )}
          {licenseCode.toLowerCase().includes('cc') && !licenseCode.toLowerCase().includes('1') && showLink && (
            <Link
              underline="hover"
              href={`https://creativecommons.org/licenses/${licenseCode
                .replace('CC', '')
                .replace(' 4.0', '')
                .trim()
                .toLowerCase()}/4.0/deed.no`}
              target="_blank"
              rel="noopener noreferrer">
              {`${t('license.read_more')} ${licenseCode.replace(' 4.0', '')} (${t(
                'license.external_page'
              ).toLowerCase()})`}
            </Link>
          )}
          {licenseCode.toLowerCase().includes('1') && showLink && (
            <Link
              underline="hover"
              href={`https://creativecommons.org/publicdomain/zero/1.0/deed.no`}
              target="_blank"
              rel="noopener noreferrer">
              {`${t('license.read_more')} ${licenseCode.replace(' 1.0', '')} (${t(
                'license.external_page'
              ).toLowerCase()})`}
            </Link>
          )}
          {showInternalLicenseExplanation && (
            <>
              <StyledFirstTypography variant="subtitle2">
                {t('license.part_description.internal_license_introduction')}:
              </StyledFirstTypography>
              <StyledTypography variant="body2">
                {t('license.part_description.only_for_internal_usage')}.
              </StyledTypography>
            </>
          )}
          <ScreenReaderOnlyP>{t('dashboard.close_popover')}</ScreenReaderOnlyP>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LicensePopoverExplanation;
