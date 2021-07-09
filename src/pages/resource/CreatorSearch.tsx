import React, { FC, useState } from 'react';
import { Resource } from '../../types/resource.types';
import styled from 'styled-components';
import CreatorPublishedAccordion from './CreatorPublishedAccordion';

const StyledCreatorPublishedAccordion = styled(CreatorPublishedAccordion)`
  margin-bottom: 1rem;
`;

interface CreatorSearchProps {
  resource: Resource;
}

const CreatorSearch: FC<CreatorSearchProps> = ({ resource }) => {
  const [displayCreatorNames] = useState<string[]>(
    resource.creators
      .map((creator) => creator.features.dlr_creator_name)
      .filter((creatorName): creatorName is string => !!creatorName)
  );

  return (
    <>
      {displayCreatorNames.map((name) => (
        <StyledCreatorPublishedAccordion key={name} creatorName={name} parentResource={resource} />
      ))}
    </>
  );
};

export default CreatorSearch;
