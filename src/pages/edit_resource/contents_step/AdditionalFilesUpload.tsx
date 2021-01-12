import React, { FC, useEffect, useState } from 'react';
import UppyDashboard from '../../../components/UppyDashboard';
import { Uppy } from '../../../types/file.types';
import { Content } from '../../../types/content.types';
import { useFormikContext } from 'formik';
import { ResourceWrapper } from '../../../types/resource.types';
import { StyledContentWrapper, StyledSchemaPartColored } from '../../../components/styled/Wrappers';
import placeholderImage from '../../../resources/images/placeholder.png';
import { UppyFile } from '@uppy/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Colors } from '../../../themes/mainTheme';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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

const LargeParagraphSpace = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const SmallParagraphSpace = styled.div`
  min-width: 200px;
  display: block;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    padding-left: 2rem;
  }
`;

const StyledImg = styled.img`
  width: 100px;
`;

const UploadImageProgressCard = styled.div`
  width: 100px;
`;

const filterAdditionalFiles = (contents: undefined | Content[]) => {
  if (contents) {
    return contents.slice(1).filter((content) => content.features.dlr_content_type === 'file') ?? [];
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

const getIndividualProgress = (contents: Content[] | undefined, uppy: Uppy) => {
  const additionalFilesContents = filterAdditionalFiles(contents);
  const uploadedFiles: UploadPerFile[] = [];
  for (let i = 0; i < additionalFilesContents.length; i++) {
    const filename = additionalFilesContents[i].features.dlr_content ?? '';
    const uppyFile = uppy.getFiles().find((file) => file.meta.name === filename);
    const percentage = uppyFile?.progress?.percentage ?? 0;
    const fileType = uppyFile?.type ?? '';
    let fileSize = '0 MB';
    if (uppyFile) {
      fileSize = calculateFileSizeString(uppyFile.size);
    }
    uploadedFiles.push({ filename, percentage, fileType, fileSize });
  }

  return uploadedFiles;
};

const AdditionalFilesUpload: FC<AdditionalFilesUploadProps> = ({ additionalFileUploadUppy, newContent }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<ResourceWrapper>();
  const [contents, setContent] = useState<Content[]>(filterAdditionalFiles(values.resource.contents));
  const [uploadPercentageArray, setUploadPercentageArray] = useState<UploadPerFile[]>(
    getIndividualProgress(values.resource.contents, additionalFileUploadUppy)
  );

  useEffect(() => {
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
    if (newContent && !values.resource.contents?.find((content) => content.identifier === newContent.identifier)) {
      if (values.resource.contents) {
        values.resource.contents.push(newContent);
      } else {
        values.resource.contents = [newContent];
      }
      setContent([...filterAdditionalFiles(values.resource.contents)]);
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
  }, [newContent, values.resource, additionalFileUploadUppy]);

  return (
    <StyledSchemaPartColored color={Colors.ContentsPageGradientColor2}>
      <StyledContentWrapper>
        <LargeParagraphSpace>
          <Typography variant="h4" paragraph>
            {t('resource.files_and_license.additional_files.additional_files')}
          </Typography>
          <Typography variant="h6" paragraph>
            {t('resource.files_and_license.additional_files.additional_files_description')}
          </Typography>
          <Typography variant="h6" paragraph>
            {`${t('resource.files_and_license.additional_files.additional_files_warning')}.`}
          </Typography>
        </LargeParagraphSpace>
        {contents.map((content, index) => (
          <LargeParagraphSpace key={content.identifier}>
            <UploadImageProgressCard>
              <StyledImg alt="resource" src={placeholderImage} />
              <Typography align="right" variant="body1">
                {uploadPercentageArray[index]?.percentage} %
              </Typography>
              <LinearProgress
                aria-label={`${t(
                  'resource.files_and_license.additional_files.additional_files_progress_bar_aria_label'
                )} ${content.features.dlr_content}`}
                variant="determinate"
                value={uploadPercentageArray[index]?.percentage ?? 0}
                role="progressbar"
              />
            </UploadImageProgressCard>
            <SmallParagraphSpace>
              <Typography variant="body1">{content.features.dlr_content}</Typography>
              <Typography variant="body1">{uploadPercentageArray[index]?.fileType}</Typography>
              <Typography variant="body2">{uploadPercentageArray[index]?.fileSize}</Typography>
            </SmallParagraphSpace>
          </LargeParagraphSpace>
        ))}
        <LargeParagraphSpace>
          <UppyDashboard hideCancelButton={false} uppy={additionalFileUploadUppy} />
        </LargeParagraphSpace>
      </StyledContentWrapper>
    </StyledSchemaPartColored>
  );
};

export default AdditionalFilesUpload;
