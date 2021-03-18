import React, { FC } from 'react';
import styled from 'styled-components';
import NC from '../resources/images/creative_commons_logos/nc.svg';
import SA from '../resources/images/creative_commons_logos/sa.svg';
import ND from '../resources/images/creative_commons_logos/nd.svg';
import Zero from '../resources/images/creative_commons_logos/zero.svg';
import BY from '../resources/images/creative_commons_logos/by.svg';
import Typography from '@material-ui/core/Typography';
import { IconButton, Popover } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { useTranslation } from 'react-i18next';
import Link from '@material-ui/core/Link';

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

interface ExplanationProps {
  icon: any;
  explanation: string;
}
const Explanation: FC<ExplanationProps> = ({ icon, explanation }) => {
  return (
    <ExplanationWrapper>
      <StyledImage src={icon} alt="" />
      <Typography>{explanation}</Typography>
    </ExplanationWrapper>
  );
};

interface CCExplanationProps {
  licenseCode: string;
}

const CCExplanation: FC<CCExplanationProps> = ({ licenseCode }) => {
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
      <IconButton aria-label={t('dashboard.explain_license')} color="primary" onClick={handleClick}>
        <HelpIcon />
      </IconButton>
      <Popover
        id={`explain-license-${licenseCode.replaceAll(' ', '').replace('.', '')}`}
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
          {licenseCode.toLowerCase().includes('cc') && !licenseCode.toLowerCase().includes('1') && (
            <Link
              href={`https://creativecommons.org/licenses/${licenseCode
                .replace('CC', '')
                .replace(' 4.0', '')
                .trim()
                .toLowerCase()}/4.0/deed.no`}
              target="_blank"
              rel="noopener noreferrer">
              {`${t('license.read_more')} ${licenseCode} (${t('license.external_page').toLowerCase()})`}
            </Link>
          )}
          {licenseCode.toLowerCase().includes('1') && (
            <Link
              href={`https://creativecommons.org/publicdomain/zero/1.0/deed.no`}
              target="_blank"
              rel="noopener noreferrer">
              {`${t('license.read_more')} ${licenseCode} (${t('license.external_page').toLowerCase()})`}
            </Link>
          )}
          <ScreenReaderOnlyP>{t('dashboard.close_popover')}</ScreenReaderOnlyP>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CCExplanation;
