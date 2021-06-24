import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StartRegistrationMethodAccordion from './StartRegistrationMethodAccordion';
import VideocamIcon from '@material-ui/icons/Videocam';
import { getMyKalturaPresentations } from '../../api/resourceApi';
import { Button, CircularProgress, List, Typography } from '@material-ui/core';
import { Colors, StyleWidths } from '../../themes/mainTheme';
import ErrorBanner from '../../components/ErrorBanner';

const StyledBody = styled.div`
  width: 100%;
`;

const StyledList = styled(List)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledResultItem = styled.li`
  padding: 1rem;
  width: 100%;
  max-width: ${StyleWidths.width4};
  background-color: ${Colors.UnitTurquoise_20percent};
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;

const StyledImage: any = styled.img`
  max-height: 5rem;
  max-width: 7.85rem;
`;

export interface KalturaPresentation {
  id: string;
  title: string;
  timeRecorded: string;
  downloadUrl: string;
  url: string;
  thumbnailUrl: string;
  institution: string;
  dlrContentIdentifier: string;
}

interface KalturaRegistrationProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  onSubmit: (id: string) => void;
}

const KalturaRegistration: FC<KalturaRegistrationProps> = ({ expanded, onChange, onSubmit }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState<KalturaPresentation[]>();
  const [getKalturaPresentationError, setGetKalturaPresentationError] = useState<Error>();
  const [busyGettingKalturaPresentation, setBusyGettingKalturaPresentation] = useState(false);

  useEffect(() => {
    const getKaltura = async () => {
      try {
        setBusyGettingKalturaPresentation(true);
        setGetKalturaPresentationError(undefined);
        setResult((await getMyKalturaPresentations()).data);
      } catch (error) {
        setGetKalturaPresentationError(undefined);
      } finally {
        setBusyGettingKalturaPresentation(false);
      }
    };
    expanded && getKaltura();
  }, [expanded]);

  return (
    <StartRegistrationMethodAccordion
      headerLabel={t('Start med å velge en video fra din kalture-konto')}
      icon={<VideocamIcon className="icon" />}
      expanded={expanded}
      onChange={onChange}
      ariaControls="resource-method-link"
      dataTestId="new-resource-link">
      <StyledBody>
        <StyledList>
          {busyGettingKalturaPresentation ? (
            <CircularProgress />
          ) : (
            result &&
            result.map((resultItem) => (
              <StyledResultItem>
                <StyledImage src={resultItem.thumbnailUrl} />
                <a href={resultItem.thumbnailUrl}>
                  <Typography> {resultItem.title}</Typography>
                </a>
                <Button variant="outlined">Bruk</Button>
              </StyledResultItem>
            ))
          )}
        </StyledList>
        {getKalturaPresentationError && (
          <ErrorBanner userNeedsToBeLoggedIn={true} error={getKalturaPresentationError} />
        )}
      </StyledBody>
    </StartRegistrationMethodAccordion>
  );
};

export default KalturaRegistration;
