import React, { FC, useEffect, useState } from 'react';
import UppyDashboard from '../../../components/UppyDashboard';
import { Uppy } from '../../../types/file.types';
import { Content } from '../../../types/content.types';
import { useFormikContext } from 'formik';
import { Resource } from '../../../types/resource.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import { UppyFile } from '@uppy/core';
import LinearProgress from '@mui/material/LinearProgress';
import { Colors, DeviceWidths, StyleWidths } from '../../../themes/mainTheme';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteResourceContent } from '../../../api/resourceApi';
import ErrorBanner from '../../../components/ErrorBanner';
import Thumbnail from '../../../components/Thumbnail';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/rootReducer';
import { useMediaQuery } from '@mui/material';

interface AdditionalFilesUploadProps {
  additionalFileUploadUppy: Uppy;
  newContent: Content | undefined;
}
interface UploadPerFile {
  percentage: number;
  filename: string;
  fileSize?: string;
  fileType?: string;
}
enum ErrorIndex {
  NO_ERRORS = -1,
}

const LargeParagraphSpace = styled.div`
  margin-top: 40px;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: block;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    display: flex;
  }
  align-items: flex-end;
  flex-wrap: wrap;
`;

const SmallParagraphSpace = styled.div`
  display: block;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    width: 45rem;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    padding-left: 2rem;
  }
`;

const UppyDashboardWrapper = styled.div`
  max-width: 90vw;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    max-width: ${StyleWidths.width3};
  }
`;

const UploadImageProgressCard = styled.div`
  width: 100px;
`;

const filterAdditionalFiles = (contents: undefined | Content[]) => {
  if (contents) {
    return (
      contents.filter((content) => {
        return content.features.dlr_content_type === 'file' && content.features.dlr_thumbnail_default !== 'true';
      }) ?? []
    );
  } else {
    return [];
  }
};

const calculateFileSizeString = (size: number): string => {
  if (size / 1024 / 1024 / 1024 > 1) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  } else if (size / 1024 / 1024 > 1) {
    return (size / 1024 / 1024).toFixed(2) + ' MB';
  } else if (size / 1024 > 1) {
    return (size / 1024).toFixed() + ' kB';
  } else {
    return size + ' Bytes';
  }
};

const getIndividualProgress = (contents: Content[] | undefined, additionalFilesUppy: Uppy) => {
  const additionalFilesContents = filterAdditionalFiles(contents);
  const uploadedFiles: UploadPerFile[] = [];
  for (let i = 0; i < additionalFilesContents.length; i++) {
    const filename = additionalFilesContents[i].features.dlr_content ?? '';
    const uppyAdditionalFile = additionalFilesUppy.getFiles().find((file) => file.meta.name === filename);
    let percentage = 0;
    let fileType = '';
    let fileSize = '0 MB';
    if (uppyAdditionalFile) {
      fileSize = calculateFileSizeString(uppyAdditionalFile.size);
      percentage = uppyAdditionalFile.progress?.percentage ?? 0;
      fileType = uppyAdditionalFile.type ?? '';
    }
    uploadedFiles.push({ filename, percentage, fileType, fileSize });
  }

  return uploadedFiles;
};

const AdditionalFilesUpload: FC<AdditionalFilesUploadProps> = ({ additionalFileUploadUppy, newContent }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Resource>();
  const [errorIndex, setErrorIndex] = useState(ErrorIndex.NO_ERRORS);
  const [contents, setContents] = useState<Content[]>(filterAdditionalFiles(values.contents.additionalContent));
  const [uploadPercentageArray, setUploadPercentageArray] = useState<UploadPerFile[]>(
    getIndividualProgress(values.contents.additionalContent, additionalFileUploadUppy)
  );
  const { institution } = useSelector((state: RootState) => state.user);
  const mediumOrLargerScreen = useMediaQuery(`(min-width:${DeviceWidths.md}px)`);

  useEffect(() => {
    const beforeUnloadListener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return (event.returnValue = '');
    };
    additionalFileUploadUppy.on('upload', () => {
      window.addEventListener('beforeunload', beforeUnloadListener, { capture: true });
    });
    additionalFileUploadUppy.on('complete', () => {
      window.removeEventListener('beforeunload', beforeUnloadListener, { capture: true });
    });
    additionalFileUploadUppy.on('upload-progress', (file: UppyFile, progress) => {
      setUploadPercentageArray((prevState) => {
        const index = prevState.findIndex((element) => element.filename === file.meta.name);
        if (index >= 0) {
          prevState[index].percentage = Math.ceil((progress.bytesUploaded / progress.bytesTotal) * 100);
        }
        return [...prevState];
      });
    });
  }, [additionalFileUploadUppy]);

  useEffect(() => {
    if (
      newContent &&
      !values.contents?.additionalContent.find((content) => content.identifier === newContent.identifier)
    ) {
      if (values.contents.additionalContent) {
        values.contents.additionalContent.push(newContent);
      } else {
        values.contents.additionalContent = [newContent];
      }
      setContents([...filterAdditionalFiles(values.contents.additionalContent)]);
      setUploadPercentageArray((prevState) => {
        const newUploadPerFile: UploadPerFile = { filename: newContent.features.dlr_content ?? '', percentage: 0 };
        if (additionalFileUploadUppy) {
          const uppyFile = additionalFileUploadUppy
            .getFiles()
            .find((file) => file.meta.name === newUploadPerFile.filename);
          if (uppyFile) {
            newUploadPerFile.fileSize = calculateFileSizeString(uppyFile.size);
            newUploadPerFile.fileType = uppyFile.type;
            newUploadPerFile.percentage = uppyFile.progress?.percentage ?? 0;
          }
        }
        return [...prevState, newUploadPerFile];
      });
    }
  }, [newContent, values, additionalFileUploadUppy]);

  useEffect(() => {
    setContents([...filterAdditionalFiles(values.contents.additionalContent)]);
  }, [values.contents.additionalContent]);

  const deleteContent = async (contentToBeDeleted: Content, index: number) => {
    try {
      await deleteResourceContent(values.identifier, contentToBeDeleted.identifier);
      if (values.contents) {
        values.contents.additionalContent = values.contents.additionalContent.filter(
          (content) => content.identifier !== contentToBeDeleted.identifier
        );

        setContents((prevState) => prevState.filter((content) => content.identifier !== contentToBeDeleted.identifier));
        setErrorIndex(ErrorIndex.NO_ERRORS);
        const fileId = additionalFileUploadUppy
          .getFiles()
          .find((file) => file.meta.name === contentToBeDeleted.features.dlr_content)?.id;
        if (fileId) {
          additionalFileUploadUppy.removeFile(fileId);
        }
      }
    } catch (error) {
      setErrorIndex(index);
    }
  };

  const displayContent = (dlrContenName: string): UploadPerFile | undefined => {
    return uploadPercentageArray.find((uploadFile) => uploadFile.filename === dlrContenName);
  };

  return (
    <StyledSchemaPartColored color={Colors.DLRColdGreen2}>
      <StyledContentWrapper>
        <LargeParagraphSpace>
          <Typography variant="h3" gutterBottom component={mediumOrLargerScreen ? 'h2' : 'h3'}>
            {t('resource.files_and_license.additional_files.additional_files')}
          </Typography>
          <Typography variant="overline" paragraph>
            {t('resource.files_and_license.additional_files.additional_files_description')}
          </Typography>
          <Typography variant="overline" paragraph>
            {`${t('resource.files_and_license.additional_files.additional_files_warning')}.`}
          </Typography>
        </LargeParagraphSpace>
        {contents.map((content, index) => (
          <LargeParagraphSpace key={content.identifier}>
            <UploadImageProgressCard>
              <Thumbnail
                institution={values.features.dlr_storage_id ?? institution}
                resourceOrContentIdentifier={content.identifier}
              />
              {displayContent(content.features.dlr_content)?.percentage !== 0 && (
                <>
                  <Typography align="right" variant="body1">
                    {displayContent(content.features.dlr_content)?.percentage} %
                  </Typography>
                  <LinearProgress
                    aria-label={`${t(
                      'resource.files_and_license.additional_files.additional_files_progress_bar_aria_label'
                    )} ${content.features.dlr_content}`}
                    variant="determinate"
                    value={displayContent(content.features.dlr_content)?.percentage ?? 0}
                    role="progressbar"
                  />
                </>
              )}
            </UploadImageProgressCard>
            <SmallParagraphSpace>
              <Typography variant="body1" data-testid={`additional-file-content-${content.identifier}`}>
                {content.features.dlr_content}
              </Typography>
              <Typography variant="body2" data-testid={`additional-file-type-${content.identifier}`}>
                {displayContent(content.features.dlr_content)?.fileType}
              </Typography>
              <Typography variant="overline">{displayContent(content.features.dlr_content)?.fileSize}</Typography>
            </SmallParagraphSpace>
            <Button
              color="secondary"
              variant="outlined"
              startIcon={<DeleteIcon fontSize="large" />}
              size="large"
              data-testid={`additional-file-${content.identifier}-delete-button`}
              onClick={() => {
                deleteContent(content, index);
              }}>
              {t('common.remove')}
            </Button>
            {errorIndex === index && <ErrorBanner userNeedsToBeLoggedIn={true} />}
          </LargeParagraphSpace>
        ))}
        <LargeParagraphSpace data-testid={`additional-files-uppy-dashboard`}>
          <UppyDashboardWrapper>
            <UppyDashboard hideCancelButton={false} uppy={additionalFileUploadUppy} />
          </UppyDashboardWrapper>
        </LargeParagraphSpace>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default AdditionalFilesUpload;
